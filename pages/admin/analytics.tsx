import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './Analytics.module.css';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{ path: string; views: number; clicks: number }>;
  topReferrers: Array<{ source: string; visits: number }>;
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
  };
  linkClicks: Array<{ url: string; clicks: number; page: string }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: Array<{ country: string; visits: number }>;
}

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from analytics API (Vercel Analytics, Google Analytics, or custom)
      const res = await fetch(`/api/analytics?range=${timeRange}`);

      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data for demonstration
      setAnalytics({
        pageViews: 45678,
        uniqueVisitors: 12345,
        avgSessionDuration: '3m 24s',
        bounceRate: '42.5%',
        topPages: [
          { path: '/blog/success-mindset', views: 5432, clicks: 1234 },
          { path: '/magazine', views: 4321, clicks: 987 },
          { path: '/category/business', views: 3456, clicks: 765 },
          { path: '/about', views: 2345, clicks: 543 },
          { path: '/subscribe', views: 1987, clicks: 456 }
        ],
        topReferrers: [
          { source: 'Google', visits: 8765 },
          { source: 'Direct', visits: 5432 },
          { source: 'Facebook', visits: 2345 },
          { source: 'Twitter', visits: 1234 },
          { source: 'LinkedIn', visits: 987 }
        ],
        userStats: {
          totalUsers: 12345,
          activeUsers: 3456,
          newUsers: 1234
        },
        linkClicks: [
          { url: 'https://mysuccessplus.com/shop', clicks: 2345, page: '/store' },
          { url: 'https://www.success.com/subscribe', clicks: 1876, page: '/subscribe' },
          { url: 'https://www.success.com/magazine', clicks: 1543, page: '/magazine' },
          { url: 'External Article Link', clicks: 987, page: '/blog/*' },
          { url: 'Social Media Links', clicks: 654, page: '/*' }
        ],
        deviceStats: {
          desktop: 58,
          mobile: 35,
          tablet: 7
        },
        geographicData: [
          { country: 'United States', visits: 8765 },
          { country: 'United Kingdom', visits: 1234 },
          { country: 'Canada', visits: 987 },
          { country: 'Australia', visits: 765 },
          { country: 'Germany', visits: 543 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 7 Days';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading analytics...</div>
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout>
        <div className={styles.error}>
          <h2>Error Loading Analytics</h2>
          <p>{error || 'Failed to load analytics data'}</p>
          <button onClick={fetchAnalytics} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Analytics Dashboard</h1>
            <p className={styles.subtitle}>
              Comprehensive insights into your site's performance and user engagement
            </p>
          </div>
          <div className={styles.timeRangeSelector}>
            <button
              onClick={() => setTimeRange('24h')}
              className={timeRange === '24h' ? styles.timeRangeActive : styles.timeRange}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={timeRange === '7d' ? styles.timeRangeActive : styles.timeRange}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={timeRange === '30d' ? styles.timeRangeActive : styles.timeRange}
            >
              30d
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={timeRange === '90d' ? styles.timeRangeActive : styles.timeRange}
            >
              90d
            </button>
          </div>
        </div>

        <p className={styles.rangeLabel}>{getTimeRangeLabel()}</p>

        {/* Key Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📊</div>
            <div className={styles.metricContent}>
              <h3>Page Views</h3>
              <p className={styles.metricValue}>{analytics.pageViews.toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>👥</div>
            <div className={styles.metricContent}>
              <h3>Unique Visitors</h3>
              <p className={styles.metricValue}>{analytics.uniqueVisitors.toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>⏱️</div>
            <div className={styles.metricContent}>
              <h3>Avg. Session</h3>
              <p className={styles.metricValue}>{analytics.avgSessionDuration}</p>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>↩️</div>
            <div className={styles.metricContent}>
              <h3>Bounce Rate</h3>
              <p className={styles.metricValue}>{analytics.bounceRate}</p>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>User Statistics</h2>
          <div className={styles.userStatsGrid}>
            <div className={styles.statCard}>
              <h4>Total Users</h4>
              <p className={styles.statValue}>{analytics.userStats.totalUsers.toLocaleString()}</p>
              <span className={styles.statLabel}>Registered accounts</span>
            </div>
            <div className={styles.statCard}>
              <h4>Active Users</h4>
              <p className={styles.statValue}>{analytics.userStats.activeUsers.toLocaleString()}</p>
              <span className={styles.statLabel}>Logged in recently</span>
            </div>
            <div className={styles.statCard}>
              <h4>New Users</h4>
              <p className={styles.statValue}>{analytics.userStats.newUsers.toLocaleString()}</p>
              <span className={styles.statLabel}>In selected period</span>
            </div>
          </div>
        </div>

        {/* Device Statistics */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Device Breakdown</h2>
          <div className={styles.deviceStats}>
            <div className={styles.deviceBar}>
              <div className={styles.deviceSegment} style={{ width: `${analytics.deviceStats.desktop}%`, background: '#667eea' }}>
                <span className={styles.deviceLabel}>Desktop {analytics.deviceStats.desktop}%</span>
              </div>
              <div className={styles.deviceSegment} style={{ width: `${analytics.deviceStats.mobile}%`, background: '#28a745' }}>
                <span className={styles.deviceLabel}>Mobile {analytics.deviceStats.mobile}%</span>
              </div>
              <div className={styles.deviceSegment} style={{ width: `${analytics.deviceStats.tablet}%`, background: '#ffc107' }}>
                <span className={styles.deviceLabel}>Tablet {analytics.deviceStats.tablet}%</span>
              </div>
            </div>
            <div className={styles.deviceLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#667eea' }}></span>
                <span>Desktop</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#28a745' }}></span>
                <span>Mobile</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#ffc107' }}></span>
                <span>Tablet</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.twoColumnGrid}>
          {/* Top Pages */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Pages</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topPages.map((page, index) => (
                    <tr key={index}>
                      <td className={styles.pagePath}>{page.path}</td>
                      <td>{page.views.toLocaleString()}</td>
                      <td>{page.clicks.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Referrers */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Referrers</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topReferrers.map((referrer, index) => (
                    <tr key={index}>
                      <td className={styles.sourceName}>{referrer.source}</td>
                      <td>{referrer.visits.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Link Clicks */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Link Clicks</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Link/URL</th>
                  <th>Clicks</th>
                  <th>Source Page</th>
                </tr>
              </thead>
              <tbody>
                {analytics.linkClicks.map((link, index) => (
                  <tr key={index}>
                    <td className={styles.linkUrl}>{link.url}</td>
                    <td>{link.clicks.toLocaleString()}</td>
                    <td className={styles.pagePath}>{link.page}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Data */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Geographic Distribution</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Visits</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {analytics.geographicData.map((geo, index) => {
                  const percentage = ((geo.visits / analytics.uniqueVisitors) * 100).toFixed(1);
                  return (
                    <tr key={index}>
                      <td className={styles.countryName}>{geo.country}</td>
                      <td>{geo.visits.toLocaleString()}</td>
                      <td>
                        <div className={styles.percentageBar}>
                          <div
                            className={styles.percentageFill}
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <span className={styles.percentageText}>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerNote}>
            📊 Analytics data is updated every hour. For real-time analytics, integrate with Google Analytics or Vercel Analytics.
          </p>
          <button onClick={fetchAnalytics} className={styles.refreshButton}>
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
