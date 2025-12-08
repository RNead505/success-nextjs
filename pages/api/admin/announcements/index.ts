import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req }) as any;

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const { active, page = '1', limit = '20' } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (active === 'true') {
        where.isActive = true;
        where.OR = [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ];
      }

      const [announcements, total] = await Promise.all([
        prisma.announcements.findMany({
          where,
          orderBy: {
            createdAt: 'desc'
          },
          take: limitNum,
          skip,
        }),
        prisma.announcements.count({ where })
      ]);

      return res.status(200).json({
        announcements: announcements.map(a => ({
          id: a.id,
          title: a.title,
          content: a.content,
          createdBy: a.createdBy,
          createdAt: a.createdAt.toISOString(),
          expiresAt: a.expiresAt?.toISOString(),
          isActive: a.isActive,
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    if (req.method === 'POST') {
      // Only Super Admin can create announcements
      if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { title, content, expiresAt } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const announcement = await prisma.announcements.create({
        data: {
          id: `announcement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title,
          content,
          createdBy: session.user.name || session.user.email,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: true,
        },
      });

      return res.status(201).json({
        announcement: {
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          createdBy: announcement.createdBy,
          createdAt: announcement.createdAt.toISOString(),
          expiresAt: announcement.expiresAt?.toISOString(),
          isActive: announcement.isActive,
        },
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error handling announcements:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
