import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.success.com';

/**
 * Dynamic Sitemap XML Generator
 *
 * Generates a sitemap.xml from database content
 * Includes posts, pages, categories, videos, podcasts
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const sitemap = await generateSitemap();

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).end();
  }
}

async function generateSitemap(): Promise<string> {
  // Fetch all published content
  const [posts, pages, categories, videos, podcasts] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.page.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.video.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.podcast.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' }
    })
  ]);

  const urls: string[] = [];

  // Homepage
  urls.push(createUrlEntry('/', new Date(), '1.0', 'daily'));

  // Static pages
  const staticPages = [
    '/about',
    '/about-us',
    '/magazine',
    '/subscribe',
    '/store',
    '/newsletter',
    '/speakers',
    '/contact'
  ];

  staticPages.forEach(page => {
    urls.push(createUrlEntry(page, new Date(), '0.8', 'weekly'));
  });

  // Blog posts
  posts.forEach(post => {
    const lastmod = post.updatedAt || post.publishedAt || new Date();
    urls.push(createUrlEntry(`/blog/${post.slug}`, lastmod, '0.7', 'weekly'));
  });

  // Pages
  pages.forEach(page => {
    urls.push(createUrlEntry(`/${page.slug}`, page.updatedAt, '0.6', 'monthly'));
  });

  // Categories
  categories.forEach(category => {
    urls.push(createUrlEntry(`/category/${category.slug}`, category.updatedAt, '0.6', 'daily'));
  });

  // Videos
  videos.forEach(video => {
    urls.push(createUrlEntry(`/video/${video.slug}`, video.updatedAt, '0.7', 'weekly'));
  });

  // Podcasts
  podcasts.forEach(podcast => {
    urls.push(createUrlEntry(`/podcast/${podcast.slug}`, podcast.updatedAt, '0.7', 'weekly'));
  });

  // Videos and Podcasts index pages
  urls.push(createUrlEntry('/videos', new Date(), '0.8', 'daily'));
  urls.push(createUrlEntry('/podcasts', new Date(), '0.8', 'daily'));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>`;
}

function createUrlEntry(
  path: string,
  lastmod: Date,
  priority: string = '0.5',
  changefreq: string = 'weekly'
): string {
  const url = `${SITE_URL}${path}`;
  const lastmodDate = lastmod.toISOString().split('T')[0]; // YYYY-MM-DD

  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
