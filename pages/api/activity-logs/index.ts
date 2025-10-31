import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { page = '1', perPage = '50', action, entity, userId } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(perPage as string);

      const where: any = {};
      if (action) where.action = action;
      if (entity) where.entity = entity;
      if (userId) where.userId = userId;

      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where,
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: parseInt(perPage as string),
        }),
        prisma.activityLog.count({ where }),
      ]);

      return res.status(200).json({
        logs,
        total,
        page: parseInt(page as string),
        perPage: parseInt(perPage as string),
        totalPages: Math.ceil(total / parseInt(perPage as string)),
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { action, entity, entityId, details, ipAddress, userAgent } = req.body;

      const log = await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action,
          entity,
          entityId,
          details: details ? JSON.stringify(details) : null,
          ipAddress,
          userAgent,
        },
      });

      return res.status(201).json(log);
    } catch (error) {
      console.error('Error creating activity log:', error);
      return res.status(500).json({ error: 'Failed to create activity log' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
