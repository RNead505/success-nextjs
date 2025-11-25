import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user has SUCCESS+ subscription
    const user = await prisma.users.findUnique({
      where: { email: session.user.email! },
      include: { subscriptions: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hasActiveSubscription = user.subscriptions?.status === 'active';

    if (!hasActiveSubscription) {
      return res.status(403).json({ error: 'SUCCESS+ subscription required' });
    }

    if (req.method === 'GET') {
      // Get all podcasts with user's listen history
      const podcasts = await prisma.podcasts.findMany({
        where: { isPublished: true },
        include: {
          listen_history: {
            where: { userId: user.id },
          },
        },
        orderBy: { publishedAt: 'desc' },
      });

      const podcastsWithProgress = podcasts.map((podcast) => {
        const listenHistory = podcast.listen_history[0];

        return {
          id: podcast.id,
          title: podcast.title,
          slug: podcast.slug,
          description: podcast.description,
          thumbnail: podcast.thumbnail,
          audioUrl: podcast.audioUrl,
          duration: podcast.duration,
          category: podcast.category,
          publishedAt: podcast.publishedAt,
          listened: listenHistory?.completed || false,
          progress: listenHistory?.progress || 0,
          lastListenedAt: listenHistory?.lastListenedAt,
        };
      });

      return res.status(200).json(podcastsWithProgress);
    }

    if (req.method === 'POST') {
      // Update listen progress
      const { podcastId, progress, completed } = req.body;

      if (!podcastId) {
        return res.status(400).json({ error: 'Podcast ID is required' });
      }

      // Check if podcast exists
      const podcast = await prisma.podcasts.findUnique({
        where: { id: podcastId },
      });

      if (!podcast || !podcast.isPublished) {
        return res.status(404).json({ error: 'Podcast not found' });
      }

      // Upsert listen history
      const listenHistory = await prisma.podcast_listen_history.upsert({
        where: {
          userId_podcastId: {
            userId: user.id,
            podcastId,
          },
        },
        update: {
          progress: progress || 0,
          completed: completed || false,
          lastListenedAt: new Date(),
        },
        create: {
          userId: user.id,
          podcastId,
          progress: progress || 0,
          completed: completed || false,
          lastListenedAt: new Date(),
        },
      });

      return res.status(200).json(listenHistory);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Podcasts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
