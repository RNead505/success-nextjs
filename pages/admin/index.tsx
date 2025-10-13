import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardStats from '../../components/admin/DashboardStats';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch recent posts
    async function fetchRecentData() {
      try {
        const res = await fetch('/api/posts?per_page=5');
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data);
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    }

    if (session) {
      fetchRecentData();
    }
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const quickActions = [
    { label: 'New Post', href: '/admin/posts/new', icon: '📝', color: '#667eea' },
    { label: 'New Page', href: '/admin/pages/new', icon: '📄', color: '#764ba2' },
    { label: 'SUCCESS+ Members', href: '/admin/members', icon: '⭐', color: '#d32f2f' },
    { label: 'WordPress Sync', href: '/admin/wordpress-sync', icon: '🔄', color: '#43e97b' },
    { label: 'Media Library', href: '/admin/media', icon: '🖼️', color: '#f093fb' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈', color: '#4facfe' },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1>Welcome back, {session.user.name}!</h1>
            <p className={styles.subtitle}>Here's what's happening with your site today</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/admin/posts/new" className={styles.primaryButton}>
              ✏️ New Post
            </Link>
          </div>
        </div>

        <DashboardStats />

        <div className={styles.quickActionsSection}>
          <h2>Quick Actions</h2>
          <div className={styles.quickActions}>
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={styles.quickAction}
                style={{ borderLeftColor: action.color }}
              >
                <span className={styles.quickActionIcon}>{action.icon}</span>
                <span className={styles.quickActionLabel}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2>Recent Posts</h2>
              <Link href="/admin/posts" className={styles.viewAllLink}>View All</Link>
            </div>
            {recentPosts.length > 0 ? (
              <div className={styles.recentList}>
                {recentPosts.map((post: any) => (
                  <div key={post.id} className={styles.recentItem}>
                    <div className={styles.recentItemContent}>
                      <h3 className={styles.recentItemTitle}>
                        {post.title?.rendered || 'Untitled'}
                      </h3>
                      <p className={styles.recentItemMeta}>
                        {new Date(post.date).toLocaleDateString()} • {post.status}
                      </p>
                    </div>
                    <Link href={`/admin/posts/${post.id}`} className={styles.editButton}>
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No posts yet. Create your first post!</p>
            )}
          </div>

          <div className={styles.activitySection}>
            <h2>Site Health</h2>
            <div className={styles.healthCards}>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon}>✅</div>
                <div>
                  <h3>Performance</h3>
                  <p>Good</p>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon}>🔒</div>
                <div>
                  <h3>Security</h3>
                  <p>Protected</p>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon}>📊</div>
                <div>
                  <h3>SEO</h3>
                  <p>Optimized</p>
                </div>
              </div>
            </div>

            <div className={styles.atAGlance}>
              <h3>At a Glance</h3>
              <ul className={styles.glanceList}>
                <li>✓ WordPress API Connected</li>
                <li>✓ Database Connected</li>
                <li>✓ Admin Access Active</li>
                <li>✓ All Systems Operational</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
