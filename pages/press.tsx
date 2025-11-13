import Layout from '../components/Layout';
import styles from './Legal.module.css';

export default function PressPage() {
  return (
    <Layout>
      <div className={styles.legal}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Press</h1>
        </header>

        <section className={styles.content}>
          <div className={styles.body}>
            <h2>Media Inquiries</h2>
            <p>
              For press inquiries, interviews, or media requests, please contact our communications team:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:press@success.com">press@success.com</a>
            </p>

            <h2>About SUCCESS</h2>
            <p>
              SUCCESS is your trusted guide to the future of work. For over 125 years, SUCCESS has been
              the leading source of inspiration, motivation, and practical advice for entrepreneurs,
              business leaders, and professionals seeking personal and professional growth.
            </p>

            <h2>SUCCESS Magazine</h2>
            <p>
              SUCCESS magazine reaches millions of ambitious, growth-oriented readers through our print
              publication, digital platforms, and SUCCESS+ membership community. Our content features
              interviews with world-class achievers, practical business strategies, and insights on
              leadership, entrepreneurship, and personal development.
            </p>

            <h2>Brand Assets</h2>
            <p>
              For official SUCCESS logos, brand guidelines, and media assets, please contact our press team
              at <a href="mailto:press@success.com">press@success.com</a>.
            </p>

            <h2>Recent News</h2>
            <p>
              Stay updated on the latest SUCCESS news, partnerships, and announcements by following us
              on our social media channels or subscribing to our newsletter.
            </p>

            <h2>Contact Information</h2>
            <p>
              <strong>SUCCESS Enterprises LLC</strong><br />
              5473 Blair Rd., Suite 100, PMB 30053<br />
              Dallas, TX 75231<br />
              <a href="mailto:press@success.com">press@success.com</a>
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Force SSR for AWS Amplify deployment compatibility
export async function getServerSideProps() {
  return {
    props: {},
  };
}
