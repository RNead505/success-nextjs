import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Check authentication
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Get settings from database
      const settings = await prisma.siteSettings.findFirst();

      if (!settings) {
        // Return default settings if none exist
        return res.status(200).json({
          siteName: 'SUCCESS Magazine',
          siteDescription: 'Your Trusted Guide to the Future of Work',
          siteUrl: 'https://www.success.com',
          adminEmail: '',
          facebookUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          linkedinUrl: '',
          youtubeUrl: '',
          wordpressApiUrl: 'https://www.success.com/wp-json/wp/v2',
          wordpressApiKey: '',
          defaultMetaTitle: 'SUCCESS Magazine',
          defaultMetaDescription: '',
          googleAnalyticsId: '',
          facebookPixelId: '',
        });
      }

      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ message: 'Failed to fetch settings' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        siteName,
        siteDescription,
        siteUrl,
        adminEmail,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        linkedinUrl,
        youtubeUrl,
        wordpressApiUrl,
        wordpressApiKey,
        defaultMetaTitle,
        defaultMetaDescription,
        googleAnalyticsId,
        facebookPixelId,
      } = req.body;

      // Check if settings exist
      const existingSettings = await prisma.siteSettings.findFirst();

      let settings;
      if (existingSettings) {
        // Update existing settings
        settings = await prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            siteName,
            siteDescription,
            siteUrl,
            adminEmail,
            facebookUrl,
            twitterUrl,
            instagramUrl,
            linkedinUrl,
            youtubeUrl,
            wordpressApiUrl,
            wordpressApiKey,
            defaultMetaTitle,
            defaultMetaDescription,
            googleAnalyticsId,
            facebookPixelId,
          },
        });
      } else {
        // Create new settings
        settings = await prisma.siteSettings.create({
          data: {
            siteName,
            siteDescription,
            siteUrl,
            adminEmail,
            facebookUrl,
            twitterUrl,
            instagramUrl,
            linkedinUrl,
            youtubeUrl,
            wordpressApiUrl,
            wordpressApiKey,
            defaultMetaTitle,
            defaultMetaDescription,
            googleAnalyticsId,
            facebookPixelId,
          },
        });
      }

      return res.status(200).json({
        message: 'Settings saved successfully',
        settings,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      return res.status(500).json({
        message: 'Failed to save settings',
        error: error.message
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
