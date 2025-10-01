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
};

function HomePage({ featuredPost, secondaryPosts, trendingPosts }: HomePageProps) {
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

      {/* "Inside the Magazine" hero is lower on the page */}
      <MagazineHero />
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await fetchWordPressData('posts?_embed&per_page=10');
  
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);
  const trendingPosts = posts.slice(4, 7);

  return {
    props: {
      featuredPost,
      secondaryPosts,
      trendingPosts,
    },
    revalidate: 600,
  };
}

export default HomePage;