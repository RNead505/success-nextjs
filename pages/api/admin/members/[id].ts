import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user has admin role
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch specific member with subscription details
      const member = await prisma.members.findUnique({
        where: {
          id: id,
        },
        include: {
          subscriptions: {
            select: {
              status: true,
              currentPeriodStart: true,
              currentPeriodEnd: true,
              stripePriceId: true,
              stripeSubscriptionId: true,
              stripeCustomerId: true,
              cancelAtPeriodEnd: true,
              provider: true,
              tier: true,
            },
          },
          platformUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          transactions: {
            select: {
              id: true,
              amount: true,
              currency: true,
              status: true,
              type: true,
              description: true,
              provider: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
          orders: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
      });

      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }

      // Transform data for frontend
      const transformedMember = {
        ...member,
        totalSpent: member.totalSpent.toNumber(),
        lifetimeValue: member.lifetimeValue.toNumber(),
        transactions: member.transactions.map((t) => ({
          ...t,
          amount: t.amount.toNumber(),
        })),
        orders: member.orders.map((o) => ({
          ...o,
          total: o.total.toNumber(),
        })),
      };

      return res.status(200).json(transformedMember);
    } catch (error) {
      console.error('Error fetching member:', error);
      return res.status(500).json({ message: 'Failed to fetch member' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete member (cascade will delete subscriptions, transactions, orders)
      await prisma.members.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
      console.error('Error deleting member:', error);
      return res.status(500).json({ message: 'Failed to delete member' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
