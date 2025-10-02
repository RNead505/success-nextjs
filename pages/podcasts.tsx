import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import styles from './Podcasts.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type PodcastsPageProps = {
  podcasts: any[];
};

export default function PodcastsPage({ podcasts }: PodcastsPageProps) {

  return (
    <Layout>
      <div className={styles.podcasts}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>SUCCESS Podcasts</h1>
            <p className={styles.heroSubtitle}>
              Inspiration and insights for your success journey
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Latest Episodes</h2>
            <div className={styles.podcastsGrid}>
              {podcasts.map((podcast: any) => (
                <PostCard key={podcast.id} post={podcast} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.platformsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Listen On Your Favorite Platform</h2>
            <div className={styles.platforms}>
              <a href="#" className={styles.platform}>Apple Podcasts</a>
              <a href="#" className={styles.platform}>Spotify</a>
              <a href="#" className={styles.platform}>Google Podcasts</a>
              <a href="#" className={styles.platform}>YouTube</a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const podcasts = await fetchWordPressData('podcasts?per_page=20&_embed');

    return {
      props: {
        podcasts: podcasts || [],
      },
      revalidate: 600,
    };
  } catch (error) {
    return {
      props: {
        podcasts: [],
      },
      revalidate: 600,
    };
  }
}
