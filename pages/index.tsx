import Layout from '../components/Layout';
import SEO from '../components/SEO';
import MagazineHero from '../components/MagazineHero';
import Bestsellers from '../components/Bestsellers';
import PostCard from '../components/PostCard';
import Trending from '../components/Trending';
import styles from './Home.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type HomePageProps = {
  posts: any[];
  trendingPosts: any[];
  latestMagazine: any;
  bestsellers: any[];
};

function HomePage({ posts, trendingPosts, latestMagazine, bestsellers }: HomePageProps) {
  if (!posts || posts.length === 0) {
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

      {/* Magazine Hero Section */}
      {latestMagazine && <MagazineHero magazine={latestMagazine} />}

      <div className={styles.container}>
        <div className={styles.mainGrid}>
          {/* Posts Feed */}
          <div className={styles.postsColumn}>
            {posts.map((post: any, index: number) => (
              <PostCard key={post.id} post={post} isFeatured={index === 0} />
            ))}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebarColumn}>
            <Trending posts={trendingPosts} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await fetchWordPressData('posts?_embed&per_page=25');
  const trendingPosts = posts.slice(0, 5); // First 5 as trending

  // Fetch latest magazine issue
  const magazines = await fetchWordPressData('magazines?per_page=1&_embed');
  const latestMagazine = magazines?.[0] || null;

  // Fetch bestsellers
  const bestsellers = await fetchWordPressData('bestsellers?per_page=12&_embed');

  return {
    props: {
      posts,
      trendingPosts,
      latestMagazine,
      bestsellers: bestsellers || [],
    },
    revalidate: 86400, // Revalidate daily (24 hours = 86400 seconds)
  };
}

export default HomePage;