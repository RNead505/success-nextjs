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
  latestPosts: any[];
  businessPosts: any[];
  lifestylePosts: any[];
  moneyPosts: any[];
  futureOfWorkPosts: any[];
  healthPosts: any[];
  entertainmentPosts: any[];
  videos: any[];
  podcasts: any[];
  latestMagazine: any;
  bestsellers: any[];
};

function HomePage({ featuredPost, secondaryPosts, trendingPosts, latestPosts, businessPosts, lifestylePosts, moneyPosts, futureOfWorkPosts, healthPosts, entertainmentPosts, videos, podcasts, latestMagazine, bestsellers }: HomePageProps) {
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
      <MagazineHero magazine={latestMagazine} />

      {/* Speakers Bureau Section */}
      <section className={styles.speakersSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.speakersTitle}>Speakers For Every Event</h2>
          <p className={styles.speakersSubtitle}>
            Get exclusive access to world-class speakers<br />
            through the SUCCESS Speakers Bureau.
          </p>
          <div className={styles.speakersGrid}>
            <div className={styles.speakerCard}>
              <div className={styles.speakerImagePlaceholder}>GC</div>
              <h3 className={styles.speakerName}>GRANT<br />CARDONE</h3>
            </div>
            <div className={styles.speakerCard}>
              <div className={styles.speakerImagePlaceholder}>DJ</div>
              <h3 className={styles.speakerName}>DAYMOND<br />JOHN</h3>
            </div>
            <div className={styles.speakerCard}>
              <div className={styles.speakerImagePlaceholder}>MR</div>
              <h3 className={styles.speakerName}>MEL<br />ROBBINS</h3>
            </div>
            <div className={styles.speakerCard}>
              <div className={styles.speakerImagePlaceholder}>JS</div>
              <h3 className={styles.speakerName}>JAY<br />SHETTY</h3>
            </div>
            <div className={styles.speakerCard}>
              <div className={styles.speakerImagePlaceholder}>RH</div>
              <h3 className={styles.speakerName}>ROBERT<br />HERJAVEC</h3>
            </div>
            <div className={styles.speakerCard}>
              <div className={styles.speakerImagePlaceholder}>SA</div>
              <h3 className={styles.speakerName}>SHAWN<br />ACHOR</h3>
            </div>
          </div>
          <div className={styles.viewMoreWrapper}>
            <a href="https://www.success.com/speakers/" target="_blank" rel="noopener noreferrer" className={styles.viewMore}>Learn More</a>
          </div>
        </div>
      </section>

      {/* Join the Inner Circle CTA */}
      <section className={styles.innerCircleCTA}>
        <div className={styles.innerCircleContent}>
          <h2 className={styles.innerCircleTitle}>Join the Inner Circle</h2>
          <p className={styles.innerCircleText}>
            Get exclusive access to SUCCESS+ content, live events, masterclasses, and a community of achievers who are building their best lives.
          </p>
          <a href="/subscribe" className={styles.innerCircleButton}>Learn More</a>
        </div>
      </section>

      {/* Bestsellers Section */}
      <Bestsellers books={bestsellers} />

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
      <section className={styles.categorySectionGray}>
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

      {/* Money Section */}
      <section className={styles.categorySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Money</h2>
            <a href="/category/money" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {moneyPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Future of Work Section */}
      <section className={styles.categorySectionGray}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Future of Work</h2>
            <a href="/category/future-of-work" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {futureOfWorkPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Health & Wellness Section */}
      <section className={styles.categorySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Health & Wellness</h2>
            <a href="/category/health" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {healthPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Entertainment Section */}
      <section className={styles.categorySectionGray}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Entertainment</h2>
            <a href="/category/entertainment" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {entertainmentPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className={styles.categorySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Videos</h2>
            <a href="/videos" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {videos.slice(0, 3).map((video: any) => (
              <PostCard key={video.id} post={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section className={styles.categorySectionGray}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Podcasts</h2>
            <a href="/podcasts" className={styles.viewAllLink}>View All →</a>
          </div>
          <div className={styles.postsGrid}>
            {podcasts.slice(0, 3).map((podcast: any) => (
              <PostCard key={podcast.id} post={podcast} />
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
  const secondaryPosts = posts.slice(1, 5); // 4 posts for 2x2 grid
  const trendingPosts = posts.slice(5, 8);
  const latestPosts = posts.slice(8, 14); // 6 more posts

  // Fetch category-specific posts
  const businessPosts = await fetchWordPressData('posts?categories=4&_embed&per_page=3');
  const lifestylePosts = await fetchWordPressData('posts?categories=14056&_embed&per_page=3');
  const moneyPosts = await fetchWordPressData('posts?categories=14060&_embed&per_page=3');
  const futureOfWorkPosts = await fetchWordPressData('posts?categories=14061&_embed&per_page=3');
  const healthPosts = await fetchWordPressData('posts?categories=14059&_embed&per_page=3');
  const entertainmentPosts = await fetchWordPressData('posts?categories=14382&_embed&per_page=3');

  // Fetch custom post types
  const videos = await fetchWordPressData('videos?_embed&per_page=3');
  const podcasts = await fetchWordPressData('podcasts?_embed&per_page=3');

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
      latestPosts,
      businessPosts,
      lifestylePosts,
      moneyPosts,
      futureOfWorkPosts,
      healthPosts,
      entertainmentPosts,
      videos: videos || [],
      podcasts: podcasts || [],
      latestMagazine,
      bestsellers: bestsellers || [],
    },
    revalidate: 600, // Revalidate every 10 minutes
  };
}

export default HomePage;
