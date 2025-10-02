import Layout from '../components/Layout';
import styles from './About.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type AboutPageProps = {
  content: string;
  title: string;
};

export default function AboutPage({ content, title }: AboutPageProps) {
  return (
    <Layout>
      <div className={styles.about}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSubtitle}>
              Your Trusted Guide to the Future of Work
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Join the SUCCESS Community</h2>
            <p className={styles.ctaText}>
              Subscribe to get the latest insights, stories, and strategies delivered
              straight to your inbox.
            </p>
            <a href="/subscribe" className={styles.ctaButton}>
              Subscribe Now
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const pages = await fetchWordPressData('pages?slug=about');
    const page = pages[0];

    if (!page) {
      return {
        props: {
          content: '<p>About page content coming soon.</p>',
          title: 'About SUCCESS',
        },
      };
    }

    return {
      props: {
        content: page.content?.rendered || '<p>Content coming soon.</p>',
        title: page.title?.rendered || 'About SUCCESS',
      },
      revalidate: 600,
    };
  } catch (error) {
    return {
      props: {
        content: '<p>About page content coming soon.</p>',
        title: 'About SUCCESS',
      },
    };
  }
}
