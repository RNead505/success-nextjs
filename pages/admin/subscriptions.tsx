import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './Subscriptions.module.css';

interface Subscription {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  stripePriceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSubscriptions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSubscriptions();
    }
  }, [session, filter]);

  const fetchSubscriptions = async () => {
    try {
      const url = filter === 'all' ? '/api/subscriptions' : `/api/subscriptions?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSubscriptions();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      ACTIVE: styles.statusActive,
      INACTIVE: styles.statusInactive,
      PAST_DUE: styles.statusPastDue,
      CANCELED: styles.statusCanceled,
      TRIALING: styles.statusTrialing,
    };

    return (
      <span className={`${styles.statusBadge} ${statusClasses[status] || ''}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading subscriptions...</div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'ACTIVE').length,
    trialing: subscriptions.filter(s => s.status === 'TRIALING').length,
    canceled: subscriptions.filter(s => s.status === 'CANCELED').length,
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>SUCCESS+ Subscriptions</h1>
            <p className={styles.subtitle}>Manage member subscriptions and billing</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Subscriptions</div>
            <div className={styles.statValue}>{stats.total}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Active</div>
            <div className={styles.statValue}>{stats.active}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Trialing</div>
            <div className={styles.statValue}>{stats.trialing}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Canceled</div>
            <div className={styles.statValue}>{stats.canceled}</div>
          </div>
        </div>

        <div className={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`${styles.filterButton} ${filter === 'ACTIVE' ? styles.filterButtonActive : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('TRIALING')}
            className={`${styles.filterButton} ${filter === 'TRIALING' ? styles.filterButtonActive : ''}`}
          >
            Trialing
          </button>
          <button
            onClick={() => setFilter('PAST_DUE')}
            className={`${styles.filterButton} ${filter === 'PAST_DUE' ? styles.filterButtonActive : ''}`}
          >
            Past Due
          </button>
          <button
            onClick={() => setFilter('CANCELED')}
            className={`${styles.filterButton} ${filter === 'CANCELED' ? styles.filterButtonActive : ''}`}
          >
            Canceled
          </button>
        </div>

        <div className={styles.tableCard}>
          {subscriptions.length === 0 ? (
            <div className={styles.empty}>
              <p>No subscriptions found.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Current Period</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className={styles.nameCell}>{subscription.user.name}</td>
                    <td>{subscription.user.email}</td>
                    <td>{getStatusBadge(subscription.status)}</td>
                    <td>
                      {subscription.currentPeriodStart && subscription.currentPeriodEnd ? (
                        <span>
                          {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{' '}
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{new Date(subscription.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      {subscription.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCancelSubscription(subscription.id)}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
