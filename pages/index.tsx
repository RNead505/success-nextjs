import Layout from '../components/Layout';
import SEO from '../components/SEO';
import MagazineHero from '../components/MagazineHero';
import Bestsellers from '../components/Bestsellers';
import PostCard from '../components/PostCard';
import Trending from '../components/Trending';
import styles from './Home.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type HomePageProps = {
  featuredPost: any;
  allPosts: any[];
  trendingPosts: any[];
  latestMagazine: any;
  bestsellers: any[];
};

function HomePage({ featuredPost, allPosts, trendingPosts, latestMagazine, bestsellers }: HomePageProps) {
  if (!featuredPost) {
    return <Layout><p>Loading...</p></Layout>;
  }

  return (
    <Layout>
      <SEO
        title="SUCCESS - Your Trusted Guide to the Future of Work"
        description="SUCCESS is the leading source of inspiration, motivation, and practical advice for entrepreneurs, business leaders, and professionals seeking personal and professional growth."
        url="https://www.success.com"
        type="website"
      />

      {/* Hero Section with Featured Post */}
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <PostCard post={featuredPost} isFeatured={true} />
        </div>
      </div>

      {/* Main Feed Container */}
      <div className={styles.mainContainer}>
        {/* Feed Section */}
        <div className={styles.feedSection}>
          <div className={styles.feedGrid}>
            {allPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <Trending posts={trendingPosts} />

          {/* Newsletter Signup */}
          <div className={styles.sidebarNewsletter}>
            <h3 className={styles.sidebarTitle}>Stay Inspired</h3>
            <p className={styles.sidebarText}>Get SUCCESS stories in your inbox</p>
            <a href="/newsletter" className={styles.sidebarButton}>Subscribe</a>
          </div>

          {/* Magazine CTA */}
          {latestMagazine && (
            <div className={styles.sidebarMagazine}>
              <h3 className={styles.sidebarTitle}>Latest Magazine</h3>
              <a href="/magazine" className={styles.magazineLink}>
                <img
                  src={latestMagazine._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'}
                  alt={latestMagazine.title?.rendered || 'Magazine Cover'}
                  className={styles.magazineCover}
                />
                <span className={styles.magazineTitle}>{latestMagazine.title?.rendered}</span>
              </a>
            </div>
          )}
        </aside>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await fetchWordPressData('posts?_embed&per_page=50');

  const featuredPost = posts[0];
  const allPosts = posts.slice(1, 25); // Next 24 posts for the feed
  const trendingPosts = posts.slice(1, 6); // 5 trending posts

  // Fetch latest magazine issue
  const magazines = await fetchWordPressData('magazines?per_page=1&_embed');
  const latestMagazine = magazines?.[0] || null;

  // Fetch bestsellers
  const bestsellers = await fetchWordPressData('bestsellers?per_page=12&_embed');

  return {
    props: {
      featuredPost,
      allPosts,
      trendingPosts,
      latestMagazine,
      bestsellers: bestsellers || [],
    },
    revalidate: 86400, // Revalidate daily (24 hours = 86400 seconds)
  };
}

export default HomePage;