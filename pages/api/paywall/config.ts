import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      let config = await prisma.paywallConfig.findFirst();

      // Create default config if none exists
      if (!config) {
        config = await prisma.paywallConfig.create({
          data: {
            freeArticleLimit: 3,
            resetPeriodDays: 30,
            enablePaywall: true,
            bypassedCategories: [],
            bypassedArticles: [],
            popupTitle: "You've reached your free article limit",
            popupMessage: "Subscribe to SUCCESS+ to get unlimited access to our premium content, exclusive interviews, and member-only benefits.",
            ctaButtonText: "Subscribe Now"
          }
        });
      }

      return res.status(200).json(config);
    } catch (error) {
      console.error('Error fetching paywall config:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update config (admin only - add auth check)
  if (req.method === 'PUT') {
    try {
      const {
        freeArticleLimit,
        resetPeriodDays,
        enablePaywall,
        bypassedCategories,
        bypassedArticles,
        popupTitle,
        popupMessage,
        ctaButtonText
      } = req.body;

      const config = await prisma.paywallConfig.findFirst();

      if (config) {
        const updated = await prisma.paywallConfig.update({
          where: { id: config.id },
          data: {
            freeArticleLimit,
            resetPeriodDays,
            enablePaywall,
            bypassedCategories,
            bypassedArticles,
            popupTitle,
            popupMessage,
            ctaButtonText
          }
        });

        return res.status(200).json(updated);
      } else {
        const created = await prisma.paywallConfig.create({
          data: {
            freeArticleLimit,
            resetPeriodDays,
            enablePaywall,
            bypassedCategories,
            bypassedArticles,
            popupTitle,
            popupMessage,
            ctaButtonText
          }
        });

        return res.status(201).json(created);
      }
    } catch (error) {
      console.error('Error updating paywall config:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
