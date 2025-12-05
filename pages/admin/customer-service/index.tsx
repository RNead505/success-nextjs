import { withDepartmentAccess } from '@/lib/auth/withDepartmentAccess';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './CustomerService.module.css';
import { requireAdminAuth } from '@/lib/adminAuth';

function CustomerServiceDashboard() {
  const router = useRouter();

  const quickLinks = [
    {
      title: 'Sales & Transactions',
      description: 'View all sales, orders, and transaction history',
      href: '/admin/sales',
      icon: '💰',
    },
    {
      title: 'Members',
      description: 'Manage SUCCESS+ members and member accounts',
      href: '/admin/members',
      icon: '⭐',
    },
    {
      title: 'Subscribers',
      description: 'View and manage all newsletter subscribers',
      href: '/admin/subscribers',
      icon: '👥',
    },
    {
      title: 'Subscriptions',
      description: 'Manage SUCCESS+ and magazine subscriptions',
      href: '/admin/subscriptions',
      icon: '💳',
    },
    {
      title: 'Revenue Analytics',
      description: 'View revenue reports and financial analytics',
      href: '/admin/revenue',
      icon: '📊',
    },
    {
      title: 'User Management',
      description: 'Search users, reset passwords, update emails',
      href: '/admin/users',
      icon: '👤',
    },
  ];

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Sales & Customer Service Dashboard</h1>
          <p>Manage all customer interactions, sales, and subscriptions</p>
        </div>

        <div className={styles.grid}>
          {quickLinks.map((link) => (
            <div key={link.href} className={styles.card} onClick={() => router.push(link.href)}>
              <div className={styles.cardIcon}>{link.icon}</div>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <Link href={link.href} className={styles.cardButton}>
                Open →
              </Link>
            </div>
          ))}
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
          <div className={styles.stat}>
            <div className={styles.statValue}>$0</div>
            <div className={styles.statLabel}>Monthly Revenue</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withDepartmentAccess(CustomerServiceDashboard, {
  department: 'CUSTOMER_SERVICE',
});

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
