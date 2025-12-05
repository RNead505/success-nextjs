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
    if (!hasDepartmentAccess(session.user.role, session.user.primaryDepartment, 'COACHING')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(startOfToday.getDate() + 1);

    // Fetch dashboard stats
    const [
      activeClients,
      sessionsThisWeek,
      programsRunning,
      totalCoaches,
      sessionsThisWeekScheduled,
      todaysSessions
    ] = await Promise.all([
      // Active coaching clients
      prisma.coaching_clients.count({
        where: {
          status: 'ACTIVE'
        }
      }),

      // Sessions this week (all statuses)
      prisma.coaching_sessions.count({
        where: {
          scheduledAt: {
            gte: startOfWeek,
            lt: endOfWeek
          }
        }
      }),

      // Active programs
      prisma.coaching_programs.count({
        where: {
          status: 'ACTIVE'
        }
      }),

      // Total coaches
      prisma.coaching_coaches.count({
        where: {
          isActive: true
        }
      }),

      // Scheduled sessions this week for utilization calc
      prisma.coaching_sessions.count({
        where: {
          scheduledAt: {
            gte: startOfWeek,
            lt: endOfWeek
          },
          status: {
            in: ['SCHEDULED', 'COMPLETED']
          }
        }
      }),

      // Today's sessions with details
      prisma.coaching_sessions.findMany({
        where: {
          scheduledAt: {
            gte: startOfToday,
            lt: endOfToday
          }
        },
        include: {
          coaching_clients: {
            select: {
              name: true
            }
          },
          coaching_coaches: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          scheduledAt: 'asc'
        }
      })
    ]);

    // Calculate coach utilization (assuming 5 sessions per coach per week as capacity)
    const weeklyCapacity = totalCoaches * 5;
    const coachUtilization = weeklyCapacity > 0
      ? (sessionsThisWeekScheduled / weeklyCapacity) * 100
      : 0;

    const stats = {
      activeClients,
      sessionsThisWeek,
      programsRunning,
      coachUtilization,
      todaysSessions: todaysSessions.map(session => ({
        id: session.id,
        time: session.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        clientName: session.coaching_clients?.name || 'Unknown Client',
        coachName: session.coaching_coaches?.name || 'Unknown Coach',
        status: session.status
      }))
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching Coaching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
