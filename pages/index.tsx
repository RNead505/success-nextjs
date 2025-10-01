import Layout from '../components/Layout';
import MagazineHero from '../components/MagazineHero';
import PostCard from '../components/PostCard';
import Trending from '../components/Trending';
import styles from './Home.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type HomePageProps = {
  featuredPost: any;
  secondaryPosts: any[];
  trendingPosts: any[];
  latestPosts: any[];
  businessPosts: any[];
  lifestylePosts: any[];
};

function HomePage({ featuredPost, secondaryPosts, trendingPosts, latestPosts, businessPosts, lifestylePosts }: HomePageProps) {
  if (!featuredPost) {
    return <Layout><p>Loading...</p></Layout>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        {/* Main content grid comes first */}
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

      {/* "Inside the Magazine" hero */}
      <MagazineHero />

      {/* Latest Articles Section */}
      <section className={styles.latestSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <div className={styles.postsGrid}>
            {latestPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className={styles.viewMoreWrapper}>
            <a href="/category/business" className={styles.viewMore}>View All Articles</a>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className={styles.categorySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Business</h2>
            <a href="/category/business" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {businessPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className={styles.categorySection} style={{ backgroundColor: '#f9f9f9' }}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Lifestyle</h2>
            <a href="/category/lifestyle" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {lifestylePosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className={styles.newsletterCTA}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Stay Inspired</h2>
          <p className={styles.ctaText}>
            Get the latest SUCCESS stories delivered straight to your inbox
          </p>
          <a href="/newsletter" className={styles.ctaButton}>Subscribe Now</a>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await fetchWordPressData('posts?_embed&per_page=30');

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);
  const trendingPosts = posts.slice(4, 7);
  const latestPosts = posts.slice(7, 13); // 6 more posts

  // Fetch category-specific posts
  const businessPosts = await fetchWordPressData('posts?categories=4&_embed&per_page=3');
  const lifestylePosts = await fetchWordPressData('posts?categories=14056&_embed&per_page=3');

  return {
    props: {
      featuredPost,
      secondaryPosts,
      trendingPosts,
      latestPosts,
      businessPosts,
      lifestylePosts,
    },
    revalidate: 600,
  };
}

export default HomePage;