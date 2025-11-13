import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Error.module.css';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error | SUCCESS</title>
        <meta name="description" content="Something went wrong on our end." />
      </Head>
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h1 className={styles.errorCode}>500</h1>
          <h2 className={styles.errorTitle}>Server Error</h2>
          <p className={styles.errorMessage}>
            Oops! Something went wrong on our end. We're working to fix it.
          </p>
          <div className={styles.errorActions}>
            <Link href="/" className={styles.primaryButton}>
              Go Home
            </Link>
            <button 
              onClick={() => typeof window !== 'undefined' && window.location.reload()} 
              className={styles.secondaryButton}
            >
              Try Again
            </button>
          </div>
          <div className={styles.supportInfo}>
            <p>If this problem persists, please contact our support team:</p>
            <p>
              <strong>Email:</strong> <a href="mailto:customerservice@success.com">customerservice@success.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

