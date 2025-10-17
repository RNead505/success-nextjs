import Layout from '../components/Layout';
import styles from './Legal.module.css';
import { fetchWordPressData } from '../lib/wordpress';
import { decodeHtmlEntities, decodeHtmlContent } from '../lib/htmlDecode';

type TermsPageProps = {
  page: any;
};

export default function TermsPage({ page }: TermsPageProps) {
  return (
    <Layout>
      <div className={styles.legal}>
        <header className={styles.hero}>
          <h1 className={styles.title}>{decodeHtmlEntities(page.title.rendered)}</h1>
        </header>

        <section className={styles.content}>
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: decodeHtmlContent(page.content.rendered) }}
          />
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const pages = await fetchWordPressData('pages?slug=terms-of-use');
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
    console.error('Error fetching terms of use page:', error);
    return { notFound: true };
  }
}
