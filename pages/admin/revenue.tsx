import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './Revenue.module.css';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  monthlyData: {
    month: string;
    revenue: number;
    subscriptions: number;
  }[];
}

export default function AdminRevenue() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchRevenueData();
    }
  }, [session, timeRange]);

  const fetchRevenueData = async () => {
    try {
      const res = await fetch(`/api/revenue?range=${timeRange}`);
      const data = await res.json();
      setRevenueData(data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading revenue data...</div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Revenue Analytics</h1>
            <p className={styles.subtitle}>SUCCESS+ subscription revenue and metrics</p>
          </div>
          <div className={styles.timeRangeSelector}>
            <button
              onClick={() => setTimeRange('month')}
              className={`${styles.timeButton} ${timeRange === 'month' ? styles.timeButtonActive : ''}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`${styles.timeButton} ${timeRange === 'quarter' ? styles.timeButtonActive : ''}`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`${styles.timeButton} ${timeRange === 'year' ? styles.timeButtonActive : ''}`}
            >
              Year
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#667eea' }}>💰</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Revenue</div>
              <div className={styles.statValue}>
                {revenueData ? formatCurrency(revenueData.totalRevenue) : '$0.00'}
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#43e97b' }}>📈</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Monthly Recurring Revenue</div>
              <div className={styles.statValue}>
                {revenueData ? formatCurrency(revenueData.monthlyRevenue) : '$0.00'}
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#4facfe' }}>👥</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Active Subscriptions</div>
              <div className={styles.statValue}>
                {revenueData?.activeSubscriptions || 0}
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f093fb' }}>📊</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Avg Revenue Per User</div>
              <div className={styles.statValue}>
                {revenueData ? formatCurrency(revenueData.averageRevenuePerUser) : '$0.00'}
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fa709a' }}>📉</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Churn Rate</div>
              <div className={styles.statValue}>
                {revenueData ? `${revenueData.churnRate.toFixed(1)}%` : '0%'}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartSection}>
          <h2>Revenue Trend</h2>
          <div className={styles.chartCard}>
            {revenueData && revenueData.monthlyData.length > 0 ? (
              <div className={styles.simpleChart}>
                {revenueData.monthlyData.map((data, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div
                      className={styles.chartBarFill}
                      style={{
                        height: `${(data.revenue / Math.max(...revenueData.monthlyData.map(d => d.revenue))) * 100}%`
                      }}
                    >
                      <div className={styles.chartBarValue}>
                        {formatCurrency(data.revenue)}
                      </div>
                    </div>
                    <div className={styles.chartBarLabel}>{data.month}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyChart}>
                <p>No revenue data available yet</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.insights}>
          <h2>Key Insights</h2>
          <div className={styles.insightCards}>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>💡</div>
              <div className={styles.insightContent}>
                <h3>Revenue Growth</h3>
                <p>
                  {revenueData && revenueData.monthlyRevenue > 0
                    ? `Your monthly recurring revenue is ${formatCurrency(revenueData.monthlyRevenue)}`
                    : 'Start acquiring subscribers to track revenue growth'}
                </p>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🎯</div>
              <div className={styles.insightContent}>
                <h3>Subscriber Retention</h3>
                <p>
                  {revenueData && revenueData.churnRate > 0
                    ? `Your current churn rate is ${revenueData.churnRate.toFixed(1)}%. Focus on retention strategies.`
                    : 'Monitor churn rate to maintain healthy subscriber base'}
                </p>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🚀</div>
              <div className={styles.insightContent}>
                <h3>Growth Opportunities</h3>
                <p>
                  Consider implementing annual plans and referral programs to increase revenue and reduce churn.
                </p>
              </div>
            </div>
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
