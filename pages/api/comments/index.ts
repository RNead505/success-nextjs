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
      const { page = '1', perPage = '100', status = 'PENDING' } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(perPage as string);

      const where: any = {};
      if (status && status !== 'all') {
        where.status = status;
      }

      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: parseInt(perPage as string),
        }),
        prisma.comment.count({ where }),
      ]);

      return res.status(200).json({
        comments,
        total,
        page: parseInt(page as string),
        perPage: parseInt(perPage as string),
        totalPages: Math.ceil(total / parseInt(perPage as string)),
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        postId,
        postTitle,
        author,
        authorEmail,
        authorUrl,
        content,
        ipAddress,
        userAgent,
      } = req.body;

      const comment = await prisma.comment.create({
        data: {
          postId,
          postTitle,
          author,
          authorEmail,
          authorUrl,
          content,
          status: 'PENDING',
          ipAddress,
          userAgent,
        },
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
