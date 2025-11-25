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
      // Get all videos with user's watch history
      const videos = await prisma.videos.findMany({
        where: { isPublished: true },
        include: {
          watch_history: {
            where: { userId: user.id },
          },
        },
        orderBy: { publishedAt: 'desc' },
      });

      const videosWithProgress = videos.map((video) => {
        const watchHistory = video.watch_history[0];

        return {
          id: video.id,
          title: video.title,
          slug: video.slug,
          description: video.description,
          thumbnail: video.thumbnail,
          videoUrl: video.videoUrl,
          duration: video.duration,
          category: video.category,
          publishedAt: video.publishedAt,
          watched: watchHistory?.completed || false,
          progress: watchHistory?.progress || 0,
          lastWatchedAt: watchHistory?.lastWatchedAt,
        };
      });

      return res.status(200).json(videosWithProgress);
    }

    if (req.method === 'POST') {
      // Update watch progress
      const { videoId, progress, completed } = req.body;

      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      // Check if video exists
      const video = await prisma.videos.findUnique({
        where: { id: videoId },
      });

      if (!video || !video.isPublished) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Upsert watch history
      const watchHistory = await prisma.video_watch_history.upsert({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId,
          },
        },
        update: {
          progress: progress || 0,
          completed: completed || false,
          lastWatchedAt: new Date(),
        },
        create: {
          userId: user.id,
          videoId,
          progress: progress || 0,
          completed: completed || false,
          lastWatchedAt: new Date(),
        },
      });

      return res.status(200).json(watchHistory);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Videos API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
