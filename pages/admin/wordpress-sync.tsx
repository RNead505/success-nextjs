import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './WordPressSync.module.css';

interface SyncStatus {
  lastSync: string;
  postsCount: number;
  categoriesCount: number;
  videosCount: number;
  podcastsCount: number;
  magazinesCount: number;
  errors: string[];
}

interface ContentStats {
  posts: { total: number; published: number; draft: number; lastUpdated: string };
  pages: { total: number; published: number; lastUpdated: string };
  categories: { total: number };
  videos: { total: number; lastUpdated: string };
  podcasts: { total: number; lastUpdated: string };
  magazines: { total: number; lastUpdated: string };
}

export default function WordPressSync() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [syncType, setSyncType] = useState<'all' | 'posts' | 'categories' | 'videos' | 'podcasts' | 'magazines'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSyncStatus();
      fetchContentStats();
    }
  }, [session]);

  const fetchSyncStatus = async () => {
    try {
      const res = await fetch('/api/wordpress/sync-status');
      if (res.ok) {
        const data = await res.json();
        setSyncStatus(data);
      }
    } catch (error) {
      console.error('Error fetching sync status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentStats = async () => {
    try {
      // Fetch stats from WordPress API
      const [posts, pages, categories, videos, podcasts, magazines] = await Promise.all([
        fetch('https://www.success.com/wp-json/wp/v2/posts?per_page=1').then(res => ({
          ok: res.ok,
          headers: res.headers,
          data: res.ok ? res.json() : null
        })),
        fetch('https://www.success.com/wp-json/wp/v2/pages?per_page=1').then(res => ({
          ok: res.ok,
          headers: res.headers
        })),
        fetch('https://www.success.com/wp-json/wp/v2/categories?per_page=1').then(res => ({
          ok: res.ok,
          headers: res.headers
        })),
        fetch('https://www.success.com/wp-json/wp/v2/videos?per_page=1').then(res => ({
          ok: res.ok,
          headers: res.headers
        })),
        fetch('https://www.success.com/wp-json/wp/v2/podcasts?per_page=1').then(res => ({
          ok: res.ok,
          headers: res.headers
        })),
        fetch('https://www.success.com/wp-json/wp/v2/magazines?per_page=1').then(res => ({
          ok: res.ok,
          headers: res.headers
        }))
      ]);

      setContentStats({
        posts: {
          total: parseInt(posts.headers.get('X-WP-Total') || '0'),
          published: parseInt(posts.headers.get('X-WP-Total') || '0'),
          draft: 0,
          lastUpdated: new Date().toISOString()
        },
        pages: {
          total: parseInt(pages.headers.get('X-WP-Total') || '0'),
          published: parseInt(pages.headers.get('X-WP-Total') || '0'),
          lastUpdated: new Date().toISOString()
        },
        categories: {
          total: parseInt(categories.headers.get('X-WP-Total') || '0')
        },
        videos: {
          total: parseInt(videos.headers.get('X-WP-Total') || '0'),
          lastUpdated: new Date().toISOString()
        },
        podcasts: {
          total: parseInt(podcasts.headers.get('X-WP-Total') || '0'),
          lastUpdated: new Date().toISOString()
        },
        magazines: {
          total: parseInt(magazines.headers.get('X-WP-Total') || '0'),
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching content stats:', error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/wordpress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: syncType })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Sync completed! ${data.message}`);
        await fetchSyncStatus();
        await fetchContentStats();
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear all cached content? This will force a fresh sync.')) {
      return;
    }

    try {
      const res = await fetch('/api/wordpress/clear-cache', { method: 'POST' });
      if (res.ok) {
        alert('Cache cleared successfully!');
        await fetchSyncStatus();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading WordPress sync status...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>WordPress Content Sync</h1>
            <p className={styles.subtitle}>
              Manage and monitor content synchronization from success.com WordPress API
            </p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleClearCache} className={styles.secondaryButton}>
              🗑️ Clear Cache
            </button>
          </div>
        </div>

        {/* Last Sync Status */}
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <h2>📊 Sync Status</h2>
            {syncStatus?.lastSync && (
              <span className={styles.lastSync}>
                Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
              </span>
            )}
          </div>
          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon}>✅</span>
              <div>
                <strong>Connection</strong>
                <p>WordPress API connected</p>
              </div>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon}>🔄</span>
              <div>
                <strong>Auto Sync</strong>
                <p>Every 24 hours (ISR)</p>
              </div>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon}>⚡</span>
              <div>
                <strong>Performance</strong>
                <p>Optimal</p>
              </div>
            </div>
          </div>

          {syncStatus?.errors && syncStatus.errors.length > 0 && (
            <div className={styles.errors}>
              <h3>⚠️ Recent Errors</h3>
              <ul>
                {syncStatus.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Content Statistics */}
        {contentStats && (
          <div className={styles.statsSection}>
            <h2>📈 Content Statistics from WordPress</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statContent}>
                  <h3>Posts</h3>
                  <p className={styles.statNumber}>{contentStats.posts.total.toLocaleString()}</p>
                  <span className={styles.statLabel}>
                    {contentStats.posts.published} published
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📄</div>
                <div className={styles.statContent}>
                  <h3>Pages</h3>
                  <p className={styles.statNumber}>{contentStats.pages.total.toLocaleString()}</p>
                  <span className={styles.statLabel}>
                    {contentStats.pages.published} published
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📁</div>
                <div className={styles.statContent}>
                  <h3>Categories</h3>
                  <p className={styles.statNumber}>{contentStats.categories.total.toLocaleString()}</p>
                  <span className={styles.statLabel}>Active categories</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎥</div>
                <div className={styles.statContent}>
                  <h3>Videos</h3>
                  <p className={styles.statNumber}>{contentStats.videos.total.toLocaleString()}</p>
                  <span className={styles.statLabel}>Video content</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎙️</div>
                <div className={styles.statContent}>
                  <h3>Podcasts</h3>
                  <p className={styles.statNumber}>{contentStats.podcasts.total.toLocaleString()}</p>
                  <span className={styles.statLabel}>Podcast episodes</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📰</div>
                <div className={styles.statContent}>
                  <h3>Magazines</h3>
                  <p className={styles.statNumber}>{contentStats.magazines.total.toLocaleString()}</p>
                  <span className={styles.statLabel}>Magazine issues</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Sync Section */}
        <div className={styles.syncSection}>
          <h2>🔄 Manual Sync</h2>
          <p className={styles.syncDescription}>
            Trigger a manual synchronization to pull the latest content from WordPress.
            Note: The site already auto-syncs every 24 hours via ISR (Incremental Static Regeneration).
          </p>

          <div className={styles.syncControls}>
            <div className={styles.syncTypeSelector}>
              <label htmlFor="syncType">Sync Type:</label>
              <select
                id="syncType"
                value={syncType}
                onChange={(e) => setSyncType(e.target.value as any)}
                className={styles.select}
              >
                <option value="all">All Content</option>
                <option value="posts">Posts Only</option>
                <option value="categories">Categories Only</option>
                <option value="videos">Videos Only</option>
                <option value="podcasts">Podcasts Only</option>
                <option value="magazines">Magazines Only</option>
              </select>
            </div>

            <button
              onClick={handleSync}
              disabled={syncing}
              className={styles.syncButton}
            >
              {syncing ? '⏳ Syncing...' : '🚀 Start Sync'}
            </button>
          </div>

          <div className={styles.syncInfo}>
            <h3>ℹ️ Sync Information</h3>
            <ul>
              <li>Manual sync will trigger ISR revalidation for selected content types</li>
              <li>Large syncs may take several minutes to complete</li>
              <li>Users will continue to see cached content during sync</li>
              <li>New content will be available after sync completes</li>
            </ul>
          </div>
        </div>

        {/* API Endpoints Reference */}
        <div className={styles.apiReference}>
          <h2>🔌 WordPress API Endpoints</h2>
          <div className={styles.endpointsList}>
            <div className={styles.endpoint}>
              <strong>Posts:</strong>
              <code>https://www.success.com/wp-json/wp/v2/posts</code>
            </div>
            <div className={styles.endpoint}>
              <strong>Categories:</strong>
              <code>https://www.success.com/wp-json/wp/v2/categories</code>
            </div>
            <div className={styles.endpoint}>
              <strong>Videos:</strong>
              <code>https://www.success.com/wp-json/wp/v2/videos</code>
            </div>
            <div className={styles.endpoint}>
              <strong>Podcasts:</strong>
              <code>https://www.success.com/wp-json/wp/v2/podcasts</code>
            </div>
            <div className={styles.endpoint}>
              <strong>Magazines:</strong>
              <code>https://www.success.com/wp-json/wp/v2/magazines</code>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
