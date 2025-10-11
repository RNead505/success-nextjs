import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from './Podcast.module.css';
import { fetchWordPressData } from '../../lib/wordpress';

type PodcastPageProps = {
  podcast: any;
  relatedPodcasts: any[];
};

export default function PodcastPage({ podcast, relatedPodcasts }: PodcastPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }

  if (!podcast) {
    return (
      <Layout>
        <div className={styles.error}>Podcast not found</div>
      </Layout>
    );
  }

  const featuredImageUrl = podcast._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <Layout>
      <article className={styles.podcastArticle}>
        <div className={styles.podcastHeader}>
          <h1 className={styles.title}>{podcast.title?.rendered || 'Podcast'}</h1>
          <div className={styles.meta}>
            <time className={styles.date}>
              {new Date(podcast.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>

        {featuredImageUrl && (
          <div className={styles.featuredImage}>
            <img src={featuredImageUrl} alt={podcast.title?.rendered || 'Podcast'} />
          </div>
        )}

        <div className={styles.podcastContent}>
          {podcast.content?.rendered && (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: podcast.content.rendered }}
            />
          )}
        </div>

        {relatedPodcasts && relatedPodcasts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>More Episodes</h2>
            <div className={styles.relatedGrid}>
              {relatedPodcasts.map((relatedPodcast: any) => (
                <a
                  key={relatedPodcast.id}
                  href={`/podcast/${relatedPodcast.slug}`}
                  className={styles.relatedCard}
                >
                  {relatedPodcast._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <img
                      src={relatedPodcast._embedded['wp:featuredmedia'][0].source_url}
                      alt={relatedPodcast.title?.rendered || 'Podcast'}
                      className={styles.relatedImage}
                    />
                  )}
                  <h3 className={styles.relatedCardTitle}>
                    {relatedPodcast.title?.rendered || 'Podcast'}
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
    const podcasts = await fetchWordPressData('podcasts?per_page=50');
    const paths = podcasts.map((podcast: any) => ({
      params: { slug: podcast.slug },
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
    const podcasts = await fetchWordPressData(`podcasts?slug=${params.slug}&_embed`);
    const podcast = podcasts[0];

    if (!podcast) {
      return {
        notFound: true,
      };
    }

    const relatedPodcasts = await fetchWordPressData('podcasts?_embed&per_page=3');

    return {
      props: {
        podcast,
        relatedPodcasts: relatedPodcasts.filter((p: any) => p.id !== podcast.id).slice(0, 3),
      },
      revalidate: 86400,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
