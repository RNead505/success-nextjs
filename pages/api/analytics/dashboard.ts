import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { fetchWordPressData } from '../../../lib/wordpress';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { period = '7' } = req.query; // days
      const days = parseInt(period as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch WordPress content stats
      const [posts, videos, podcasts, categories] = await Promise.all([
        fetchWordPressData('posts?per_page=100'),
        fetchWordPressData('videos?per_page=100').catch(() => []),
        fetchWordPressData('podcasts?per_page=100').catch(() => []),
        fetchWordPressData('categories?per_page=100'),
      ]);

      // Get database stats
      const [
        totalUsers,
        activeSubscribers,
        totalBookmarks,
        newsletterSubscribers,
        magazineIssues,
        editorialItems,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        prisma.bookmark.count(),
        prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
        prisma.magazine.count(),
        prisma.editorialCalendar.count(),
      ]);

      // Calculate content stats
      const now = new Date();
      const recentPosts = posts.filter((post: any) => {
        const postDate = new Date(post.date);
        return postDate >= startDate;
      });

      // Get editorial calendar stats
      const editorialStats = await prisma.editorialCalendar.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });

      const dashboardData = {
        overview: {
          totalPosts: posts.length,
          totalVideos: videos.length,
          totalPodcasts: podcasts.length,
          totalCategories: categories.length,
          totalUsers,
          activeSubscribers,
          newsletterSubscribers,
          magazineIssues,
        },
        content: {
          postsThisPeriod: recentPosts.length,
          videosThisPeriod: videos.filter((v: any) => new Date(v.date) >= startDate).length,
          podcastsThisPeriod: podcasts.filter((p: any) => new Date(p.date) >= startDate).length,
        },
        editorial: {
          totalItems: editorialItems,
          byStatus: editorialStats.reduce((acc: any, stat) => {
            acc[stat.status] = stat._count.status;
            return acc;
          }, {}),
        },
        engagement: {
          totalBookmarks,
          avgBookmarksPerUser: totalUsers > 0 ? (totalBookmarks / totalUsers).toFixed(2) : 0,
        },
        topContent: {
          posts: posts.slice(0, 10).map((post: any) => ({
            id: post.id,
            title: post.title.rendered,
            slug: post.slug,
            date: post.date,
            categories: post.categories,
          })),
        },
      };

      return res.status(200).json(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      return res.status(500).json({
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
