import Layout from '../components/Layout';
import styles from './Legal.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type AdvertisePageProps = {
  page: any;
};

export default function AdvertisePage({ page }: AdvertisePageProps) {
  return (
    <Layout>
      <div className={styles.legal}>
        <header className={styles.hero}>
          <h1 className={styles.title}>{page.title.rendered}</h1>
        </header>

        <section className={styles.content}>
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const pages = await fetchWordPressData('pages?slug=advertise');
    const page = pages[0];

    if (!page) {
      return { notFound: true };
    }

    return {
      props: {
        page,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error fetching advertise page:', error);
    return { notFound: true };
  }
}
