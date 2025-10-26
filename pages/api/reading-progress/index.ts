import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  // GET - Fetch user's reading progress
  if (req.method === 'GET') {
    try {
      const { completed } = req.query;

      const where: any = { userId };
      if (completed === 'true') {
        where.completed = true;
      } else if (completed === 'false') {
        where.completed = false;
      }

      const progress = await prisma.readingProgress.findMany({
        where,
        orderBy: { lastReadAt: 'desc' },
        take: 20,
      });

      return res.status(200).json(progress);
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      return res.status(500).json({ error: 'Failed to fetch reading progress' });
    }
  }

  // POST - Update reading progress
  if (req.method === 'POST') {
    try {
      const { articleId, articleTitle, articleUrl, progress } = req.body;

      if (!articleId || !articleTitle || !articleUrl || typeof progress !== 'number') {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (progress < 0 || progress > 100) {
        return res.status(400).json({ error: 'Progress must be between 0 and 100' });
      }

      const completed = progress >= 90; // Consider 90%+ as completed

      const readingProgress = await prisma.readingProgress.upsert({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
        update: {
          progress,
          completed,
          lastReadAt: new Date(),
        },
        create: {
          userId,
          articleId,
          articleTitle,
          articleUrl,
          progress,
          completed,
        },
      });

      // Create activity log if article was completed
      if (completed && progress >= 90) {
        // Check if we already logged this completion
        const existingActivity = await prisma.userActivity.findFirst({
          where: {
            userId,
            activityType: 'ARTICLE_READ',
            metadata: {
              contains: articleId,
            },
          },
        });

        if (!existingActivity) {
          await prisma.userActivity.create({
            data: {
              userId,
              activityType: 'ARTICLE_READ',
              title: `Read: ${articleTitle}`,
              metadata: JSON.stringify({ articleId, articleUrl }),
            },
          });
        }
      }

      return res.status(200).json(readingProgress);
    } catch (error) {
      console.error('Error updating reading progress:', error);
      return res.status(500).json({ error: 'Failed to update reading progress' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
