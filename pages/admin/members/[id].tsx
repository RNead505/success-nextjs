import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import styles from './MemberDetail.module.css';

interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    stripePriceId?: string;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    cancelAtPeriodEnd: boolean;
  };
}

export default function MemberDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && id) {
      fetchMember();
    }
  }, [session, id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/members/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else {
        console.error('Failed to fetch member');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading member details...</div>
      </AdminLayout>
    );
  }

  if (!session || !member) {
    return (
      <AdminLayout>
        <div className={styles.error}>Member not found</div>
      </AdminLayout>
    );
  }

  const hasActiveSubscription = member.subscription?.status === 'ACTIVE';

  return (
    <AdminLayout>
      <div className={styles.memberDetail}>
        <div className={styles.header}>
          <Link href="/admin/members" className={styles.backButton}>
            ← Back to Members
          </Link>
        </div>

        <div className={styles.memberHeader}>
          <div className={styles.memberAvatar}>
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.memberInfo}>
            <h1>{member.name}</h1>
            <p className={styles.email}>{member.email}</p>
            {hasActiveSubscription ? (
              <span className={styles.badgeActive}>Active Subscriber</span>
            ) : (
              <span className={styles.badgeInactive}>Inactive</span>
            )}
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Account Information */}
          <div className={styles.card}>
            <h2>Account Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Member ID</span>
                <span className={styles.value}>{member.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{member.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{member.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Member Since</span>
                <span className={styles.value}>
                  {new Date(member.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Last Updated</span>
                <span className={styles.value}>
                  {new Date(member.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className={styles.card}>
            <h2>Subscription Details</h2>
            {member.subscription ? (
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>
                    {member.subscription.status === 'ACTIVE' && (
                      <span className={styles.statusActive}>Active</span>
                    )}
                    {member.subscription.status === 'PAST_DUE' && (
                      <span className={styles.statusPastDue}>Past Due</span>
                    )}
                    {member.subscription.status === 'CANCELED' && (
                      <span className={styles.statusCanceled}>Canceled</span>
                    )}
                    {member.subscription.status === 'INACTIVE' && (
                      <span className={styles.statusInactive}>Inactive</span>
                    )}
                  </span>
                </div>
                {member.subscription.currentPeriodStart && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Current Period Start</span>
                    <span className={styles.value}>
                      {new Date(member.subscription.currentPeriodStart).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )}
                {member.subscription.currentPeriodEnd && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Next Billing Date</span>
                    <span className={styles.value}>
                      {new Date(member.subscription.currentPeriodEnd).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )}
                {member.subscription.cancelAtPeriodEnd && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Cancel at Period End</span>
                    <span className={styles.valueWarning}>
                      Yes - Will cancel on{' '}
                      {member.subscription.currentPeriodEnd
                        ? new Date(member.subscription.currentPeriodEnd).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                )}
                {member.subscription.stripeSubscriptionId && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Stripe Subscription ID</span>
                    <span className={styles.valueCode}>
                      {member.subscription.stripeSubscriptionId}
                    </span>
                  </div>
                )}
                {member.subscription.stripeCustomerId && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Stripe Customer ID</span>
                    <span className={styles.valueCode}>
                      {member.subscription.stripeCustomerId}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className={styles.noSubscription}>
                No active subscription found
              </p>
            )}

            {member.subscription?.stripeCustomerId && (
              <div className={styles.actions}>
                <a
                  href={`https://dashboard.stripe.com/customers/${member.subscription.stripeCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stripeButton}
                >
                  View in Stripe Dashboard →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsSection}>
          <h2>Actions</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>
              Send Email
            </button>
            <button className={styles.actionButton}>
              Reset Password
            </button>
            <button className={styles.actionButtonDanger}>
              Delete Member
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Force SSR to prevent NextRouter errors during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}
