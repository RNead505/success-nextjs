import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { hasDepartmentAccess } from '@/lib/departmentAuth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req }) as any;

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check department access
    if (!hasDepartmentAccess(session.user.role, session.user.primaryDepartment, 'SUCCESS_PLUS')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Fetch dashboard stats
    const [
      activeMembers,
      newMembersThisMonth,
      cancelledLastMonth,
      cancelledTwoMonthsAgo,
      subscriptions,
      recentActivity
    ] = await Promise.all([
      // Active SUCCESS+ members
      prisma.users.count({
        where: {
          successPlusMember: true,
          isActive: true
        }
      }),

      // New members this month
      prisma.users.count({
        where: {
          successPlusMember: true,
          createdAt: {
            gte: oneMonthAgo
          }
        }
      }),

      // Cancelled last month
      prisma.users.count({
        where: {
          successPlusMember: false,
          successPlusCancelledAt: {
            gte: oneMonthAgo,
            lt: now
          }
        }
      }),

      // Cancelled two months ago (for trend)
      prisma.users.count({
        where: {
          successPlusMember: false,
          successPlusCancelledAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo
          }
        }
      }),

      // Get all active subscriptions for MRR calculation
      prisma.subscriptions.findMany({
        where: {
          status: 'active',
          planType: {
            contains: 'success_plus'
          }
        },
        select: {
          amount: true,
          interval: true
        }
      }),

      // Recent member activity from staff activity feed
      prisma.staff_activity_feed.findMany({
        where: {
          department: 'SUCCESS_PLUS'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ]);

    // Calculate Monthly Recurring Revenue (normalize annual to monthly)
    const monthlyRecurringRevenue = subscriptions.reduce((total, sub) => {
      const amount = sub.amount || 0;
      if (sub.interval === 'year') {
        return total + (amount / 12);
      }
      return total + amount;
    }, 0);

    // Calculate churn rate
    const totalActiveLastMonth = activeMembers + cancelledLastMonth;
    const churnRate = totalActiveLastMonth > 0
      ? (cancelledLastMonth / totalActiveLastMonth) * 100
      : 0;

    const stats = {
      activeMembers,
      newMembersThisMonth,
      churnRate,
      monthlyRecurringRevenue,
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        type: activity.entityType?.toLowerCase() || 'member',
        description: activity.description || activity.action,
        timestamp: activity.createdAt.toISOString(),
        user: activity.userName
      }))
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching SUCCESS+ dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
