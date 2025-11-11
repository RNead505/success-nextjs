import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { per_page = '50', page = '1', orderBy = 'createdAt', order = 'desc' } = req.query;

    const perPage = parseInt(per_page as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * perPage;

    const media = await prisma.media.findMany({
      take: perPage,
      skip,
      orderBy: {
        [orderBy as string]: order as 'asc' | 'desc',
      },
    });

    const total = await prisma.media.count();

    return res.status(200).json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return res.status(500).json({
      error: 'Failed to fetch media',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
