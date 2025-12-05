/**
 * Individual Transaction Detail View
 * Shows complete information about a subscription or order
 */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import styles from './TransactionDetail.module.css';
import { requireAdminAuth } from '@/lib/adminAuth';

interface TransactionDetail {
  id: string;
  type: 'subscription' | 'order';
  productName: string;
  customerName: string;
  customerEmail: string;
  userId?: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  provider?: string;
  // Subscription specific
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  // Order specific
  orderNumber?: string;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress?: any;
  billingAddress?: any;
  items?: any[];
}

export default function TransactionDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
        router.push('/admin');
      } else if (id) {
        fetchTransaction();
      }
    }
  }, [status, session, router, id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/sales/${id}`);
      if (!res.ok) throw new Error('Failed to fetch transaction');
      const data = await res.json();
      setTransaction(data);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading transaction...</div>
      </AdminLayout>
    );
  }

  if (!session || error || !transaction) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.error}>
            {error || 'Transaction not found'}
          </div>
          <Link href="/admin/sales" className={styles.backLink}>
            ← Back to Sales
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/admin/sales" className={styles.backLink}>
            ← Back to Sales
          </Link>
          <h1>Transaction Details</h1>
        </div>

        <div className={styles.grid}>
          {/* Main Info Card */}
          <div className={styles.card}>
            <h2>
              {transaction.type === 'subscription' ? '🔄 Subscription' : '🛍️ Order'}
            </h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Product</div>
                <div className={styles.infoValue}>{transaction.productName}</div>
              </div>
              {transaction.orderNumber && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Order Number</div>
                  <div className={styles.infoValue}>{transaction.orderNumber}</div>
                </div>
              )}
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Status</div>
                <div className={styles.infoValue}>
                  <span className={`${styles.statusBadge} ${styles[transaction.status.toLowerCase()]}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Amount</div>
                <div className={styles.infoValueLarge}>{formatCurrency(transaction.amount)}</div>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className={styles.card}>
            <h2>👤 Customer Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Name</div>
                <div className={styles.infoValue}>{transaction.customerName}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoValue}>{transaction.customerEmail}</div>
              </div>
              {transaction.userId && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>User ID</div>
                  <div className={styles.infoValue}>
                    <Link href={`/admin/users?id=${transaction.userId}`} className={styles.link}>
                      {transaction.userId}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subscription-specific details */}
        {transaction.type === 'subscription' && (
          <div className={styles.card}>
            <h2>📅 Subscription Details</h2>
            <div className={styles.infoGrid}>
              {transaction.currentPeriodStart && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Current Period Start</div>
                  <div className={styles.infoValue}>{formatDate(transaction.currentPeriodStart)}</div>
                </div>
              )}
              {transaction.currentPeriodEnd && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Current Period End</div>
                  <div className={styles.infoValue}>{formatDate(transaction.currentPeriodEnd)}</div>
                </div>
              )}
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Renews Automatically</div>
                <div className={styles.infoValue}>
                  {transaction.cancelAtPeriodEnd ? '❌ No (Cancels at period end)' : '✅ Yes'}
                </div>
              </div>
              {transaction.provider && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Payment Provider</div>
                  <div className={styles.infoValue}>{transaction.provider}</div>
                </div>
              )}
              {transaction.stripeCustomerId && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Stripe Customer ID</div>
                  <div className={styles.infoValue}>
                    <span className={styles.code}>{transaction.stripeCustomerId}</span>
                  </div>
                </div>
              )}
              {transaction.stripeSubscriptionId && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Stripe Subscription ID</div>
                  <div className={styles.infoValue}>
                    <span className={styles.code}>{transaction.stripeSubscriptionId}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order-specific details */}
        {transaction.type === 'order' && (
          <>
            <div className={styles.card}>
              <h2>💰 Order Breakdown</h2>
              <div className={styles.orderBreakdown}>
                {transaction.subtotal !== undefined && (
                  <div className={styles.breakdownRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(transaction.subtotal)}</span>
                  </div>
                )}
                {transaction.tax !== undefined && transaction.tax > 0 && (
                  <div className={styles.breakdownRow}>
                    <span>Tax</span>
                    <span>{formatCurrency(transaction.tax)}</span>
                  </div>
                )}
                {transaction.shipping !== undefined && transaction.shipping > 0 && (
                  <div className={styles.breakdownRow}>
                    <span>Shipping</span>
                    <span>{formatCurrency(transaction.shipping)}</span>
                  </div>
                )}
                {transaction.discount !== undefined && transaction.discount > 0 && (
                  <div className={styles.breakdownRow}>
                    <span>Discount</span>
                    <span className={styles.discount}>-{formatCurrency(transaction.discount)}</span>
                  </div>
                )}
                <div className={`${styles.breakdownRow} ${styles.total}`}>
                  <span>Total</span>
                  <span>{formatCurrency(transaction.amount)}</span>
                </div>
              </div>
            </div>

            {transaction.items && transaction.items.length > 0 && (
              <div className={styles.card}>
                <h2>📦 Order Items</h2>
                <div className={styles.itemsList}>
                  {transaction.items.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <div className={styles.itemName}>{item.productName}</div>
                      <div className={styles.itemDetails}>
                        <span>Qty: {item.quantity}</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Timeline */}
        <div className={styles.card}>
          <h2>📋 Timeline</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitle}>Created</div>
                <div className={styles.timelineDate}>{formatDate(transaction.createdAt)}</div>
              </div>
            </div>
            {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>Last Updated</div>
                  <div className={styles.timelineDate}>{formatDate(transaction.updatedAt)}</div>
                </div>
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
