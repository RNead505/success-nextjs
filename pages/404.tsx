import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Error.module.css';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | SUCCESS</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Page Not Found</h2>
          <p className={styles.errorMessage}>
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className={styles.errorActions}>
            <Link href="/" className={styles.primaryButton}>
              Go Home
            </Link>
            <Link href="/contact" className={styles.secondaryButton}>
              Contact Support
            </Link>
          </div>
          <div className={styles.suggestions}>
            <h3>You might be interested in:</h3>
            <ul>
              <li><Link href="/magazine">Latest Magazine Issue</Link></li>
              <li><Link href="/success-plus">SUCCESS+ Membership</Link></li>
              <li><Link href="/podcasts">Podcasts</Link></li>
              <li><Link href="/videos">Videos</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

