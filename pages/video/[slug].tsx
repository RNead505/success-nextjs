import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from './Video.module.css';
import { fetchWordPressData } from '../../lib/wordpress';

type VideoPageProps = {
  video: any;
  relatedVideos: any[];
};

export default function VideoPage({ video, relatedVideos }: VideoPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className={styles.error}>Video not found</div>
      </Layout>
    );
  }

  const featuredImageUrl = video._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <Layout>
      <article className={styles.videoArticle}>
        <div className={styles.videoHeader}>
          <h1 className={styles.title}>{video.title?.rendered || 'Video'}</h1>
          <div className={styles.meta}>
            <time className={styles.date}>
              {new Date(video.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>

        {featuredImageUrl && (
          <div className={styles.featuredImage}>
            <img src={featuredImageUrl} alt={video.title?.rendered || 'Video'} />
          </div>
        )}

        <div className={styles.videoContent}>
          {video.content?.rendered && (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: video.content.rendered }}
            />
          )}
        </div>

        {relatedVideos && relatedVideos.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>More Videos</h2>
            <div className={styles.relatedGrid}>
              {relatedVideos.map((relatedVideo: any) => (
                <a
                  key={relatedVideo.id}
                  href={`/video/${relatedVideo.slug}`}
                  className={styles.relatedCard}
                >
                  {relatedVideo._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <img
                      src={relatedVideo._embedded['wp:featuredmedia'][0].source_url}
                      alt={relatedVideo.title?.rendered || 'Video'}
                      className={styles.relatedImage}
                    />
                  )}
                  <h3 className={styles.relatedCardTitle}>
                    {relatedVideo.title?.rendered || 'Video'}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const videos = await fetchWordPressData('videos?per_page=50');
    const paths = videos.map((video: any) => ({
      params: { slug: video.slug },
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }: any) {
  try {
    const videos = await fetchWordPressData(`videos?slug=${params.slug}&_embed`);
    const video = videos[0];

    if (!video) {
      return {
        notFound: true,
      };
    }

    const relatedVideos = await fetchWordPressData('videos?_embed&per_page=3');

    return {
      props: {
        video,
        relatedVideos: relatedVideos.filter((v: any) => v.id !== video.id).slice(0, 3),
      },
      revalidate: 86400,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
