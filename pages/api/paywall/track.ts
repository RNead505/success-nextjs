import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const { articleId, articleTitle, articleUrl } = req.body;

    // Get paywall config
    const config = await prisma.paywallConfig.findFirst();
    const freeArticleLimit = config?.freeArticleLimit || 3;
    const resetPeriodDays = config?.resetPeriodDays || 30;

    // Check if user has active subscription
    if (session?.user) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
      });

      if (subscription && subscription.status === 'ACTIVE') {
        // Subscriber - track but don't count against limit
        await prisma.pageView.create({
          data: {
            userId: session.user.id,
            articleId,
            articleTitle,
            articleUrl,
            ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
            userAgent: req.headers['user-agent']
          }
        });

        return res.status(200).json({ blocked: false, count: 0, isSubscriber: true });
      }
    }

    // Calculate reset date (beginning of current month)
    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() - resetPeriodDays);

    let userId: string | null = null;
    let sessionId: string | null = null;

    // Logged-in user tracking
    if (session?.user) {
      userId = session.user.id;

      // Count views since reset date
      const viewCount = await prisma.pageView.count({
        where: {
          userId: userId,
          viewedAt: { gte: resetDate }
        }
      });

      // Track this view
      await prisma.pageView.create({
        data: {
          userId,
          articleId,
          articleTitle,
          articleUrl,
          ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        }
      });

      const blocked = viewCount >= freeArticleLimit;

      return res.status(200).json({
        blocked,
        count: viewCount + 1,
        limit: freeArticleLimit,
        isSubscriber: false
      });
    }

    // Anonymous user tracking (cookie-based)
    // Get or create session ID
    sessionId = req.cookies.paywallSession || null;
    if (!sessionId) {
      sessionId = uuidv4();
      res.setHeader('Set-Cookie', `paywallSession=${sessionId}; Path=/; Max-Age=2592000; SameSite=Lax`); // 30 days
    }

    // Count views for this session since reset date
    const viewCount = await prisma.pageView.count({
      where: {
        sessionId: sessionId,
        viewedAt: { gte: resetDate }
      }
    });

    // Track this view
    await prisma.pageView.create({
      data: {
        sessionId,
        articleId,
        articleTitle,
        articleUrl,
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    });

    const blocked = viewCount >= freeArticleLimit;

    return res.status(200).json({
      blocked,
      count: viewCount + 1,
      limit: freeArticleLimit,
      isSubscriber: false
    });
  } catch (error) {
    console.error('Paywall tracking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
