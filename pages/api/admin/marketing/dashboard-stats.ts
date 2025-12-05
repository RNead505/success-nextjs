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
    if (!hasDepartmentAccess(session.user.role, session.user.primaryDepartment, 'MARKETING')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch dashboard stats
    const [
      siteTrafficToday,
      activeCampaigns,
      emailCampaignsLastWeek,
      conversionsThisMonth,
      totalTrafficThisMonth,
      topCampaigns
    ] = await Promise.all([
      // Site traffic today (from analytics table)
      prisma.site_analytics.aggregate({
        where: {
          date: {
            gte: startOfToday
          }
        },
        _sum: {
          pageviews: true
        }
      }),

      // Active marketing campaigns
      prisma.marketing_campaigns.count({
        where: {
          status: 'ACTIVE',
          endDate: {
            gte: now
          }
        }
      }),

      // Email campaigns sent last week for open rate calc
      prisma.email_campaigns.findMany({
        where: {
          sentAt: {
            gte: oneWeekAgo
          },
          status: 'SENT'
        },
        select: {
          totalSent: true,
          opens: true
        }
      }),

      // Conversions this month
      prisma.conversions.count({
        where: {
          createdAt: {
            gte: oneMonthAgo
          }
        }
      }),

      // Total traffic this month for conversion rate
      prisma.site_analytics.aggregate({
        where: {
          date: {
            gte: oneMonthAgo
          }
        },
        _sum: {
          sessions: true
        }
      }),

      // Top 5 campaigns by conversions
      prisma.marketing_campaigns.findMany({
        where: {
          status: {
            in: ['ACTIVE', 'COMPLETED']
          }
        },
        include: {
          _count: {
            select: {
              conversions: true
            }
          }
        },
        orderBy: {
          conversions: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ]);

    // Calculate email open rate
    const totalSent = emailCampaignsLastWeek.reduce((sum, campaign) => sum + (campaign.totalSent || 0), 0);
    const totalOpens = emailCampaignsLastWeek.reduce((sum, campaign) => sum + (campaign.opens || 0), 0);
    const emailOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;

    // Calculate conversion rate
    const totalSessions = totalTrafficThisMonth._sum.sessions || 0;
    const conversionRate = totalSessions > 0 ? (conversionsThisMonth / totalSessions) * 100 : 0;

    const stats = {
      siteTrafficToday: siteTrafficToday._sum.pageviews || 0,
      emailOpenRate,
      activeCampaigns,
      conversionRate,
      topCampaigns: topCampaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        type: campaign.type || 'Content',
        conversions: campaign._count.conversions,
        clickThroughRate: campaign.clickThroughRate || 0
      }))
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching Marketing dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
