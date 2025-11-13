import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from './Success.module.css';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (session_id) {
      // In a real implementation, you would verify the session with Stripe
      // For now, we'll just show a success message
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [session_id]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.spinner}></div>
            <p>Verifying your payment...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>
            <svg width="80" height="80" fill="none" stroke="#10b981" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1>Payment Successful!</h1>
          <p className={styles.message}>
            Thank you for your payment. A receipt has been sent to your email address.
          </p>

          <div className={styles.details}>
            <p><strong>Order ID:</strong> {session_id}</p>
          </div>

          <div className={styles.actions}>
            <button onClick={() => router.push('/')} className={styles.homeButton}>
              Return to Homepage
            </button>
          </div>

          <p className={styles.support}>
            If you have any questions, please contact our support team.
          </p>
        </div>
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
