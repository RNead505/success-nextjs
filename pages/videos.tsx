import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import styles from './Videos.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type VideosPageProps = {
  videos: any[];
};

export default function VideosPage({ videos }: VideosPageProps) {
  return (
    <Layout>
      <div className={styles.videosPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Videos</h1>
          <p className={styles.subtitle}>
            Inspiring conversations with thought leaders, entrepreneurs, and change-makers
          </p>
        </div>

        <div className={styles.videosGrid}>
          {videos.map((video: any) => (
            <PostCard key={video.id} post={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const videos = await fetchWordPressData('videos?per_page=20&_embed');

    return {
      props: {
        videos: videos || [],
      },
      revalidate: 86400,
    };
  } catch (error) {
    return {
      props: {
        videos: [],
      },
      revalidate: 86400,
    };
  }
}
