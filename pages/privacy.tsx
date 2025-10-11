import Layout from '../components/Layout';
import styles from './Legal.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type PrivacyPageProps = {
  page: any;
};

export default function PrivacyPage({ page }: PrivacyPageProps) {
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
    const pages = await fetchWordPressData('pages?slug=privacy-policy');
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
    console.error('Error fetching privacy policy page:', error);
    return { notFound: true };
  }
}
