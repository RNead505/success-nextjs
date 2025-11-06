import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

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

  if (req.method === 'GET') {
    try {
      // Fetch all users with their subscriptions
      const members = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          subscriptions: {
            select: {
              status: true,
              currentPeriodEnd: true,
              stripePriceId: true,
              stripeSubscriptionId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(members);
    } catch (error) {
      console.error('Error fetching members:', error);
      return res.status(500).json({ message: 'Failed to fetch members' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
