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
      const member = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          subscription: {
            select: {
              status: true,
              currentPeriodStart: true,
              currentPeriodEnd: true,
              stripePriceId: true,
              stripeSubscriptionId: true,
              stripeCustomerId: true,
              cancelAtPeriodEnd: true,
            },
          },
        },
      });

      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }

      return res.status(200).json(member);
    } catch (error) {
      console.error('Error fetching member:', error);
      return res.status(500).json({ message: 'Failed to fetch member' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete member (cascade will delete subscription)
      await prisma.user.delete({
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
