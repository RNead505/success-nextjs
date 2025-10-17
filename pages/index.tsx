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
  secondaryPosts: any[];
  trendingPosts: any[];
  latestMagazine: any;
  bestsellers: any[];
};

function HomePage({ featuredPost, secondaryPosts, trendingPosts, latestMagazine, bestsellers }: HomePageProps) {
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
      <div className={styles.container}>
        {/* Main content grid */}
        <div className={styles.homeLayout}>
          <div className={styles.featuredSection}>
            <PostCard post={featuredPost} isFeatured={true} />
          </div>
          <div className={styles.secondarySection}>
            {secondaryPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className={styles.trendingSection}>
            <Trending posts={trendingPosts} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await fetchWordPressData('posts?_embed&per_page=30');

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 5); // 4 posts for 2x2 grid
  const trendingPosts = posts.slice(5, 10); // 5 trending posts

  // Fetch latest magazine issue
  const magazines = await fetchWordPressData('magazines?per_page=1&_embed');
  const latestMagazine = magazines?.[0] || null;

  // Fetch bestsellers
  const bestsellers = await fetchWordPressData('bestsellers?per_page=12&_embed');

  return {
    props: {
      featuredPost,
      secondaryPosts,
      trendingPosts,
      latestMagazine,
      bestsellers: bestsellers || [],
    },
    revalidate: 86400, // Revalidate daily (24 hours = 86400 seconds)
  };
}

export default HomePage;