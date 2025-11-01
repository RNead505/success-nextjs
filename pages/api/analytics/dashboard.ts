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

      // Fetch WordPress content stats (get accurate totals from headers)
      // First, get the total counts from WordPress
      const [postsResponse, videosResponse, podcastsResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2'}/posts?per_page=1`),
        fetch(`${process.env.WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2'}/videos?per_page=1`).catch(() => null),
        fetch(`${process.env.WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2'}/podcasts?per_page=1`).catch(() => null),
        fetch(`${process.env.WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2'}/categories?per_page=1`),
      ]);

      // Get total counts from X-WP-Total header
      const totalPostsCount = parseInt(postsResponse.headers.get('X-WP-Total') || '0');
      const totalVideosCount = videosResponse ? parseInt(videosResponse.headers.get('X-WP-Total') || '0') : 0;
      const totalPodcastsCount = podcastsResponse ? parseInt(podcastsResponse.headers.get('X-WP-Total') || '0') : 0;
      const totalCategoriesCount = parseInt(categoriesResponse.headers.get('X-WP-Total') || '0');

      // Fetch recent posts for period calculation (last 100 is enough for recent data)
      const [posts, videos, podcasts] = await Promise.all([
        fetchWordPressData('posts?per_page=100&orderby=date&order=desc'),
        fetchWordPressData('videos?per_page=100&orderby=date&order=desc').catch(() => []),
        fetchWordPressData('podcasts?per_page=100&orderby=date&order=desc').catch(() => []),
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
          totalPosts: totalPostsCount,
          totalVideos: totalVideosCount,
          totalPodcasts: totalPodcastsCount,
          totalCategories: totalCategoriesCount,
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
