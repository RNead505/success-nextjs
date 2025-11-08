import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './Sync.module.css';

interface SyncLog {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  entity: string;
  timestamp: string;
  details: {
    created: number;
    updated: number;
    errors: number;
    total: number;
  } | null;
}

interface SyncStats {
  posts: number;
  categories: number;
  tags: number;
  users: number;
}

export default function WordPressSync() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);
  const [syncEntity, setSyncEntity] = useState('posts');
  const [syncLimit, setSyncLimit] = useState(100);
  const [dryRun, setDryRun] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (
      session?.user?.role !== 'ADMIN' &&
      session?.user?.role !== 'SUPER_ADMIN'
    ) {
      router.push('/admin');
    }
  }, [session, status, router]);

  // Load sync status on mount
  useEffect(() => {
    loadSyncStatus();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/status');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const runSync = async () => {
    if (loading) return;

    setLoading(true);
    setSyncProgress(`Starting ${syncEntity} sync...`);

    try {
      const response = await fetch('/api/sync/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: syncEntity,
          limit: syncLimit,
          offset: 0,
          dryRun,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSyncProgress(
          `Sync complete! Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors.length}`
        );

        if (result.errors.length > 0) {
          console.error('Sync errors:', result.errors);
        }

        // Reload status
        await loadSyncStatus();

        // Clear progress after 5 seconds
        setTimeout(() => {
          setSyncProgress(null);
        }, 5000);
      } else {
        setSyncProgress(`Error: ${result.message || 'Sync failed'}`);
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncProgress(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>WordPress Sync</h1>
          <p className={styles.subtitle}>
            Sync content from WordPress REST API to Supabase database
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.posts}</div>
                <div className={styles.statLabel}>Posts</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📁</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.categories}</div>
                <div className={styles.statLabel}>Categories</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏷️</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.tags}</div>
                <div className={styles.statLabel}>Tags</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👤</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.users}</div>
                <div className={styles.statLabel}>Authors</div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Controls */}
        <div className={styles.syncSection}>
          <h2>Run Sync</h2>
          <div className={styles.syncForm}>
            <div className={styles.formGroup}>
              <label>Entity Type</label>
              <select
                value={syncEntity}
                onChange={(e) => setSyncEntity(e.target.value)}
                disabled={loading}
              >
                <option value="posts">Posts</option>
                <option value="categories">Categories</option>
                <option value="tags">Tags</option>
                <option value="users">Users (Authors)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Limit (per batch)</label>
              <input
                type="number"
                value={syncLimit}
                onChange={(e) => setSyncLimit(parseInt(e.target.value))}
                min="1"
                max="100"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  disabled={loading}
                />
                <span>Dry Run (preview only)</span>
              </label>
            </div>

            <button
              onClick={runSync}
              disabled={loading}
              className={styles.syncButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Syncing...
                </>
              ) : (
                <>
                  🔄 {dryRun ? 'Preview Sync' : 'Run Sync'}
                </>
              )}
            </button>
          </div>

          {syncProgress && (
            <div className={loading ? styles.progressActive : styles.progressComplete}>
              {syncProgress}
            </div>
          )}

          <div className={styles.helpText}>
            <p><strong>Note:</strong> Syncing will:</p>
            <ul>
              <li>Fetch published content from WordPress REST API</li>
              <li>Create new records or update existing ones in Supabase</li>
              <li>Preserve WordPress images via CDN URLs (no local downloads)</li>
              <li>Skip records that fail validation (won't break entire sync)</li>
              <li>Log all sync activity for tracking</li>
            </ul>
            <p>Use <strong>Dry Run</strong> to preview changes without saving to database.</p>
          </div>
        </div>

        {/* Sync History */}
        <div className={styles.historySection}>
          <h2>Sync History</h2>
          {logs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No sync history yet. Run your first sync above!</p>
            </div>
          ) : (
            <div className={styles.logsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Entity</th>
                    <th>User</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Errors</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>
                        <span className={styles.entityBadge}>{log.entity}</span>
                      </td>
                      <td>{log.user.name}</td>
                      <td className={styles.numberCell}>
                        {log.details?.created || 0}
                      </td>
                      <td className={styles.numberCell}>
                        {log.details?.updated || 0}
                      </td>
                      <td className={styles.numberCell}>
                        {log.details?.errors || 0 > 0 ? (
                          <span className={styles.errorCount}>
                            {log.details?.errors || 0}
                          </span>
                        ) : (
                          <span className={styles.successCount}>0</span>
                        )}
                      </td>
                      <td className={styles.numberCell}>
                        {log.details?.total || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
