import { fetchWordPressData } from '../../../lib/wordpress';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type = 'all' } = req.body;

    const results = {
      revalidated: [],
      errors: [],
      counts: {},
    };

    // Revalidate homepage
    try {
      await res.revalidate('/');
      results.revalidated.push('/');
    } catch (error) {
      results.errors.push({ path: '/', error: error.message });
    }

    if (type === 'all' || type === 'posts') {
      try {
        const posts = await fetchWordPressData('posts?per_page=50&_embed');
        results.counts.posts = posts.length;

        // Revalidate blog index
        await res.revalidate('/blog');
        results.revalidated.push('/blog');

        // Revalidate individual posts
        for (const post of posts.slice(0, 20)) {
          try {
            await res.revalidate(`/blog/${post.slug}`);
            results.revalidated.push(`/blog/${post.slug}`);
          } catch (error) {
            results.errors.push({ path: `/blog/${post.slug}`, error: error.message });
          }
        }
      } catch (error) {
        results.errors.push({ type: 'posts', error: error.message });
      }
    }

    if (type === 'all' || type === 'categories') {
      try {
        const categories = await fetchWordPressData('categories?per_page=100');
        results.counts.categories = categories.length;

        const mainCategories = ['business', 'lifestyle', 'money', 'entertainment', 'health', 'future-of-work'];
        for (const slug of mainCategories) {
          try {
            await res.revalidate(`/category/${slug}`);
            results.revalidated.push(`/category/${slug}`);
          } catch (error) {
            results.errors.push({ path: `/category/${slug}`, error: error.message });
          }
        }
      } catch (error) {
        results.errors.push({ type: 'categories', error: error.message });
      }
    }

    if (type === 'all' || type === 'videos') {
      try {
        const videos = await fetchWordPressData('videos?per_page=20&_embed').catch(() => []);
        results.counts.videos = videos.length;

        for (const video of videos.slice(0, 10)) {
          try {
            await res.revalidate(`/video/${video.slug}`);
            results.revalidated.push(`/video/${video.slug}`);
          } catch (error) {
            results.errors.push({ path: `/video/${video.slug}`, error: error.message });
          }
        }
      } catch (error) {
        results.errors.push({ type: 'videos', error: error.message });
      }
    }

    if (type === 'all' || type === 'podcasts') {
      try {
        const podcasts = await fetchWordPressData('podcasts?per_page=20&_embed').catch(() => []);
        results.counts.podcasts = podcasts.length;

        for (const podcast of podcasts.slice(0, 10)) {
          try {
            await res.revalidate(`/podcast/${podcast.slug}`);
            results.revalidated.push(`/podcast/${podcast.slug}`);
          } catch (error) {
            results.errors.push({ path: `/podcast/${podcast.slug}`, error: error.message });
          }
        }
      } catch (error) {
        results.errors.push({ type: 'podcasts', error: error.message });
      }
    }

    if (type === 'all' || type === 'pages') {
      try {
        const pages = await fetchWordPressData('pages?per_page=50').catch(() => []);
        results.counts.pages = pages.length;

        // Revalidate static pages
        const staticPages = ['about-us', 'magazine', 'subscribe', 'newsletter', 'store'];
        for (const slug of staticPages) {
          try {
            await res.revalidate(`/${slug}`);
            results.revalidated.push(`/${slug}`);
          } catch (error) {
            results.errors.push({ path: `/${slug}`, error: error.message });
          }
        }
      } catch (error) {
        results.errors.push({ type: 'pages', error: error.message });
      }
    }

    const message = type === 'all'
      ? `Full sync completed. Revalidated ${results.revalidated.length} paths.`
      : `${type.charAt(0).toUpperCase() + type.slice(1)} sync completed. Revalidated ${results.revalidated.length} paths.`;

    res.status(200).json({
      success: true,
      message,
      syncedAt: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Error syncing:', error);
    res.status(500).json({
      success: false,
      message: 'Sync failed',
      error: error.message
    });
  }
}
