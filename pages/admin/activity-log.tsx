import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './ActivityLog.module.css';

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export default function ActivityLogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchLogs();
    }
  }, [status, session, page, filterAction, filterEntity]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '50',
      });
      if (filterAction) params.append('action', filterAction);
      if (filterEntity) params.append('entity', filterEntity);

      const res = await fetch(`/api/activity-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colors: { [key: string]: string } = {
      CREATE: '#10b981',
      UPDATE: '#3b82f6',
      DELETE: '#ef4444',
      LOGIN: '#8b5cf6',
      LOGOUT: '#6b7280',
      SYNC: '#f59e0b',
      PUBLISH: '#10b981',
      DRAFT: '#9ca3af',
    };
    return colors[action] || '#666';
  };

  const formatDetails = (details?: string) => {
    if (!details) return null;
    try {
      const parsed = JSON.parse(details);
      return (
        <pre className={styles.details}>
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <span className={styles.details}>{details}</span>;
    }
  };

  if (status === 'loading' || loading) {
    return <AdminLayout><div className={styles.loading}>Loading...</div></AdminLayout>;
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Activity Log</h1>
            <p className={styles.subtitle}>Track all admin actions and system events</p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Filter by Action:</label>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="SYNC">Sync</option>
              <option value="PUBLISH">Publish</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Filter by Entity:</label>
            <select value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)}>
              <option value="">All Entities</option>
              <option value="post">Post</option>
              <option value="page">Page</option>
              <option value="user">User</option>
              <option value="settings">Settings</option>
              <option value="media">Media</option>
              <option value="category">Category</option>
              <option value="tag">Tag</option>
            </select>
          </div>

          <button onClick={() => { setFilterAction(''); setFilterEntity(''); }} className={styles.clearButton}>
            Clear Filters
          </button>
        </div>

        {/* Activity Log Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    No activity logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.timestamp}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <div className={styles.userCell}>
                        {log.user.avatar ? (
                          <img src={log.user.avatar} alt={log.user.name} className={styles.avatar} />
                        ) : (
                          <div className={styles.avatarPlaceholder}>{log.user.name[0]}</div>
                        )}
                        <div>
                          <div className={styles.userName}>{log.user.name}</div>
                          <div className={styles.userRole}>{log.user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.actionBadge}
                        style={{ backgroundColor: getActionBadgeColor(log.action) }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className={styles.entity}>{log.entity}</td>
                    <td className={styles.entityId}>{log.entityId || '-'}</td>
                    <td className={styles.detailsCell}>
                      {log.details && (
                        <details>
                          <summary>View Details</summary>
                          {formatDetails(log.details)}
                        </details>
                      )}
                    </td>
                    <td className={styles.ipAddress}>{log.ipAddress || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 50 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {page} of {Math.ceil(total / 50)} ({total} total)
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 50)}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
