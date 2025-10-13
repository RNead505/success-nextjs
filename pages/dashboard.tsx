import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import styles from './Dashboard.module.css';

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Layout>
        <div className={styles.loading}>Loading your dashboard...</div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  // Check if user has active subscription
  const hasActiveSubscription = session.user.subscription?.status === 'ACTIVE';

  return (
    <Layout>
      <div className={styles.dashboard}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome Back{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}!</h1>
            <p>Your SUCCESS<span className={styles.plus}>+</span> Member Dashboard</p>
          </div>
        </div>

        <div className={styles.container}>
          {/* Subscription Status */}
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Membership Status</h2>
                {hasActiveSubscription ? (
                  <span className={styles.badgeActive}>Active</span>
                ) : (
                  <span className={styles.badgeInactive}>Inactive</span>
                )}
              </div>
              <div className={styles.cardBody}>
                {hasActiveSubscription ? (
                  <>
                    <p>Your SUCCESS+ membership is active and in good standing.</p>
                    <div className={styles.subscriptionDetails}>
                      <div className={styles.detail}>
                        <span className={styles.label}>Plan:</span>
                        <span className={styles.value}>SUCCESS+ Premium</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Next Billing:</span>
                        <span className={styles.value}>
                          {session.user.subscription?.currentPeriodEnd
                            ? new Date(session.user.subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <button className={styles.manageButton}>Manage Subscription</button>
                  </>
                ) : (
                  <>
                    <p>You don't have an active subscription. Subscribe to unlock all benefits!</p>
                    <button className={styles.subscribeButton} onClick={() => router.push('/subscribe')}>
                      Subscribe Now
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Account</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.accountInfo}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{session.user.email}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{session.user.name || 'Not set'}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Member Since:</span>
                    <span className={styles.value}>
                      {session.user.createdAt
                        ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <button className={styles.editButton}>Edit Profile</button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.quickLinks}>
            <h2>Quick Links</h2>
            <div className={styles.linksGrid}>
              <a href="/category/business" className={styles.linkCard}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Business</span>
              </a>

              <a href="/category/money" className={styles.linkCard}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Money</span>
              </a>

              <a href="/category/lifestyle" className={styles.linkCard}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lifestyle</span>
              </a>

              <a href="/magazine" className={styles.linkCard}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Magazine</span>
              </a>

              <a href="/podcasts" className={styles.linkCard}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Podcasts</span>
              </a>

              <a href="/videos" className={styles.linkCard}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Videos</span>
              </a>
            </div>
          </div>

          {/* Sign Out */}
          <div className={styles.actions}>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={styles.signOutButton}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
