/**
 * Orders & Fulfillment Management
 * Track and manage physical product orders
 */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './Orders.module.css';

interface Order {
  id: string;
  orderNumber: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress?: string;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
        router.push('/admin');
      } else {
        fetchOrders();
      }
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}&search=${searchTerm}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [statusFilter, searchTerm]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order Number', 'Customer', 'Email', 'Total', 'Status', 'Payment Method', 'Date'];
    const rows = orders.map(order => [
      order.orderNumber,
      order.userName,
      order.userEmail,
      `$${order.total}`,
      order.status,
      order.paymentMethod,
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'PROCESSING':
        return '#3b82f6';
      case 'CANCELLED':
        return '#ef4444';
      case 'RETURNED':
        return '#6b7280';
      default:
        return '#999';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading orders...</div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const processingCount = orders.filter(o => o.status === 'PROCESSING').length;
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length;

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Orders & Fulfillment</h1>
            <p>Manage physical product orders and shipping</p>
          </div>
          <button onClick={exportToCSV} className={styles.exportButton}>
            📥 Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f59e0b' }}>⏳</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{pendingCount}</div>
              <div className={styles.statLabel}>Pending</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#3b82f6' }}>⚙️</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{processingCount}</div>
              <div className={styles.statLabel}>Processing</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#10b981' }}>✅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{completedCount}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#8b5cf6' }}>📦</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{orders.length}</div>
              <div className={styles.statLabel}>Total Orders</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className={styles.tableContainer}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No orders found</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Tracking</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderNumber}>{order.orderNumber}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>{order.userName}</div>
                        <div className={styles.customerEmail}>{order.userEmail}</div>
                      </div>
                    </td>
                    <td className={styles.total}>${order.total.toFixed(2)}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {order.trackingNumber ? (
                        <span className={styles.tracking}>{order.trackingNumber}</span>
                      ) : (
                        <span className={styles.noTracking}>—</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className={styles.viewButton}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                            className={styles.processButton}
                            title="Mark as Processing"
                          >
                            ⚙️
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                            className={styles.completeButton}
                            title="Mark as Completed"
                          >
                            ✅
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
