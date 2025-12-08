import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

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

    // Find the most recent active announcement
    const announcement = await prisma.announcements.findFirst({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!announcement) {
      return res.status(200).json({ announcement: null });
    }

    return res.status(200).json({
      announcement: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        createdBy: announcement.createdBy,
        createdAt: announcement.createdAt.toISOString(),
        expiresAt: announcement.expiresAt?.toISOString(),
      },
    });

  } catch (error) {
    console.error('Error fetching active announcement:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
