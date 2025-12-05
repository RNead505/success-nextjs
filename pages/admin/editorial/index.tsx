import { withDepartmentAccess } from '@/lib/auth/withDepartmentAccess';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import styles from './Editorial.module.css';
import { requireAdminAuth } from '@/lib/adminAuth';

function EditorialDashboard() {
  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Editorial Dashboard</h1>
        </div>

        <div className={styles.grid}>
          <Link href="/admin/posts" className={styles.card}>
            <h3>Article Management</h3>
            <p>Create, edit, publish articles and manage drafts</p>
            <span className={styles.cardButton}>Manage Articles</span>
          </Link>

          <Link href="/admin/categories" className={styles.card}>
            <h3>Categories & Tags</h3>
            <p>Organize content with categories and tags</p>
            <span className={styles.cardButton}>Manage Categories</span>
          </Link>

          <Link href="/admin/media" className={styles.card}>
            <h3>Media Library</h3>
            <p>Upload and manage images, videos, documents</p>
            <span className={styles.cardButton}>Media Library</span>
          </Link>

          <Link href="/admin/editorial-calendar" className={styles.card}>
            <h3>Editorial Calendar</h3>
            <p>Schedule content and manage publishing workflow</p>
            <span className={styles.cardButton}>View Calendar</span>
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Draft Articles</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Scheduled</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Published This Month</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withDepartmentAccess(EditorialDashboard, {
  department: 'EDITORIAL',
});

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
