/**
 * Sales & Subscriptions Dashboard
 * Unified tracking for all revenue streams:
 * - SUCCESS+ Digital Subscriptions
 * - Print Magazine Subscriptions
 * - Store Orders
 * - Coaching Sessions
 * - One-time purchases
 */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './Sales.module.css';
import { requireAdminAuth } from '@/lib/adminAuth';

interface SalesStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface Transaction {
  id: string;
  type: 'subscription' | 'order' | 'coaching';
  productName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  createdAt: string;
  provider?: string;
}

interface RevenueByType {
  successPlus: number;
  magazine: number;
  store: number;
  coaching: number;
}

export default function SalesAndSubscriptions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenueByType, setRevenueByType] = useState<RevenueByType | null>(null);
  const [filter, setFilter] = useState('all'); // all, subscriptions, orders, coaching
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, 365
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // Only ADMIN and SUPER_ADMIN can access sales
      if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
        router.push('/admin');
      } else {
        fetchSalesData();
      }
    }
  }, [status, session, router, filter, dateRange]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/sales?filter=${filter}&days=${dateRange}`);
      if (!res.ok) throw new Error('Failed to fetch sales data');
      const data = await res.json();

      setStats(data.stats);
      setTransactions(data.transactions);
      setRevenueByType(data.revenueByType);
    } catch (err: any) {
      setError(err.message);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#10b981',
      completed: '#10b981',
      pending: '#f59e0b',
      processing: '#3b82f6',
      canceled: '#ef4444',
      cancelled: '#ef4444',
      failed: '#991b1b',
      refunded: '#6b7280',
    };
    return colors[status.toLowerCase()] || '#6b7280';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      subscription: '🔄',
      order: '🛍️',
      coaching: '🎯',
    };
    return icons[type] || '💰';
  };

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Type', 'Product', 'Customer', 'Email', 'Amount', 'Status'].join(','),
      ...transactions.map(t => [
        formatDate(t.createdAt),
        t.type,
        t.productName,
        t.customerName,
        t.customerEmail,
        t.amount,
        t.status,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading sales data...</div>
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
            <h1>Sales & Subscriptions</h1>
            <p className={styles.subtitle}>
              Track all revenue streams and customer transactions
            </p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={exportToCSV} className={styles.exportButton}>
              📊 Export CSV
            </button>
            <button onClick={() => router.push('/admin/revenue')} className={styles.secondaryButton}>
              📈 Revenue Analytics
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Stats Grid */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#d1fae5' }}>
                <span style={{ color: '#065f46' }}>💰</span>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Revenue</div>
                <div className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
                <span style={{ color: '#1e40af' }}>📅</span>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Monthly Revenue</div>
                <div className={styles.statValue}>{formatCurrency(stats.monthlyRevenue)}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
                <span style={{ color: '#92400e' }}>🔄</span>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Active Subscriptions</div>
                <div className={styles.statValue}>{stats.activeSubscriptions}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#f3e8ff' }}>
                <span style={{ color: '#6b21a8' }}>🛍️</span>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Orders</div>
                <div className={styles.statValue}>{stats.totalOrders}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#fee2e2' }}>
                <span style={{ color: '#991b1b' }}>📊</span>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Avg Order Value</div>
                <div className={styles.statValue}>{formatCurrency(stats.averageOrderValue)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue by Type */}
        {revenueByType && (
          <div className={styles.revenueBreakdown}>
            <h2>Revenue by Product Type</h2>
            <div className={styles.revenueGrid}>
              <div className={styles.revenueCard}>
                <div className={styles.revenueLabel}>✨ SUCCESS+</div>
                <div className={styles.revenueAmount}>{formatCurrency(revenueByType.successPlus)}</div>
              </div>
              <div className={styles.revenueCard}>
                <div className={styles.revenueLabel}>📚 Magazine</div>
                <div className={styles.revenueAmount}>{formatCurrency(revenueByType.magazine)}</div>
              </div>
              <div className={styles.revenueCard}>
                <div className={styles.revenueLabel}>🛍️ Store</div>
                <div className={styles.revenueAmount}>{formatCurrency(revenueByType.store)}</div>
              </div>
              <div className={styles.revenueCard}>
                <div className={styles.revenueLabel}>🎯 Coaching</div>
                <div className={styles.revenueAmount}>{formatCurrency(revenueByType.coaching)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Filter by Type:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={styles.select}>
              <option value="all">All Transactions</option>
              <option value="subscriptions">Subscriptions Only</option>
              <option value="orders">Orders Only</option>
              <option value="coaching">Coaching Only</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Date Range:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={styles.select}>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={styles.tableCard}>
          <h2>Recent Transactions</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.createdAt)}</td>
                    <td>
                      <span className={styles.typeTag}>
                        {getTypeIcon(transaction.type)} {transaction.type}
                      </span>
                    </td>
                    <td className={styles.productName}>{transaction.productName}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>{transaction.customerName}</div>
                        <div className={styles.customerEmail}>{transaction.customerEmail}</div>
                      </div>
                    </td>
                    <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: getStatusColor(transaction.status) }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => router.push(`/admin/sales/${transaction.id}`)}
                        className={styles.viewButton}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length === 0 && (
              <div className={styles.emptyState}>
                <p>No transactions found for the selected filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
