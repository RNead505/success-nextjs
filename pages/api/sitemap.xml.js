import { fetchWordPressData } from '../../lib/wordpress';

export default async function handler(req, res) {
  try {
    const siteUrl = 'https://www.success.com';

    // Fetch data in parallel
    const [posts, categories, authors] = await Promise.all([
      fetchWordPressData('posts?per_page=100&status=publish'),
      fetchWordPressData('categories?per_page=100'),
      fetchWordPressData('users?per_page=50'),
    ]);

    // Static pages
    const staticPages = [
      { url: '', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/magazine', changefreq: 'monthly', priority: 0.9 },
      { url: '/subscribe', changefreq: 'monthly', priority: 0.9 },
      { url: '/contact', changefreq: 'monthly', priority: 0.7 },
      { url: '/store', changefreq: 'weekly', priority: 0.8 },
      { url: '/advertise', changefreq: 'monthly', priority: 0.7 },
      { url: '/podcasts', changefreq: 'weekly', priority: 0.8 },
      { url: '/videos', changefreq: 'weekly', priority: 0.8 },
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
    )
    .join('')}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
  </url>`
    )
    .join('')}
  ${categories
    .map(
      (category) => `
  <url>
    <loc>${siteUrl}/category/${category.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
    )
    .join('')}
  ${authors
    .map(
      (author) => `
  <url>
    <loc>${siteUrl}/author/${author.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
    )
    .join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Failed to generate sitemap', error: error.message });
  }
}
