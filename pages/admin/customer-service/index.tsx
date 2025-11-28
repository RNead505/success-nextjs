import { withDepartmentAccess } from '@/lib/auth/withDepartmentAccess';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './CustomerService.module.css';

function CustomerServiceDashboard() {
  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Customer Service Dashboard</h1>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Subscription Management</h3>
            <p>Search and manage user subscriptions, cancel, pause, or change tiers</p>
            <button className={styles.cardButton}>Manage Subscriptions</button>
          </div>

          <div className={styles.card}>
            <h3>Purchase & Billing</h3>
            <p>Process refunds, view purchase history, handle billing issues</p>
            <button className={styles.cardButton}>View Billing</button>
          </div>

          <div className={styles.card}>
            <h3>User Account Management</h3>
            <p>Search users, reset passwords, update emails, merge accounts</p>
            <button className={styles.cardButton}>Manage Users</button>
          </div>

          <div className={styles.card}>
            <h3>Support Tools</h3>
            <p>Log customer interactions, escalation flags, common fixes</p>
            <button className={styles.cardButton}>Support Tools</button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Open Tickets</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Active Subscriptions</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Pending Refunds</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withDepartmentAccess(CustomerServiceDashboard, {
  department: 'CUSTOMER_SERVICE',
});

export async function getServerSideProps() {
  return {
    props: {},
  };
}
