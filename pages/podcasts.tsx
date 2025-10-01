import Layout from '../components/Layout';
import styles from './Podcasts.module.css';

export default function PodcastsPage() {
  const podcasts = [
    {
      title: "The Daily Coach",
      description: "Quick daily insights from top coaches and mentors",
      image: "https://via.placeholder.com/400x400/000/fff?text=Daily+Coach"
    },
    {
      title: "SUCCESS Stories",
      description: "In-depth interviews with successful entrepreneurs",
      image: "https://via.placeholder.com/400x400/000/fff?text=SUCCESS+Stories"
    },
    {
      title: "Future of Work",
      description: "Exploring trends shaping tomorrow's workplace",
      image: "https://via.placeholder.com/400x400/000/fff?text=Future+of+Work"
    }
  ];

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
            <h2 className={styles.sectionTitle}>Featured Shows</h2>
            <div className={styles.podcastsGrid}>
              {podcasts.map((podcast, index) => (
                <div key={index} className={styles.podcastCard}>
                  <img src={podcast.image} alt={podcast.title} className={styles.podcastImage} />
                  <h3 className={styles.podcastTitle}>{podcast.title}</h3>
                  <p className={styles.podcastDescription}>{podcast.description}</p>
                  <a href="#" className={styles.listenButton}>Listen Now</a>
                </div>
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
