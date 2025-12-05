import { useState, useEffect } from 'react';
import { Department } from '@prisma/client';
import DepartmentLayout from '@/components/admin/shared/DepartmentLayout';
import { requireDepartmentAuth } from '@/lib/departmentAuth';
import Link from 'next/link';
import styles from './Subscriptions.module.css';

interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  status: string;
  nextBillingDate?: string;
  amount: number;
  interval: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubscriptions();
  }, [search, statusFilter, page]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '20');

      const res = await fetch(`/api/admin/customer-service/subscriptions?${params}`);
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      active: styles.statusActive,
      paused: styles.statusPaused,
      cancelled: styles.statusCancelled,
      past_due: styles.statusPastDue,
    };

    return (
      <span className={`${styles.statusBadge} ${statusClasses[status.toLowerCase()] || ''}`}>
        {status}
      </span>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubscriptions();
  };

  return (
    <DepartmentLayout
      currentDepartment={Department.CUSTOMER_SERVICE}
      pageTitle="Subscription Management"
      description="Manage user subscriptions and billing"
    >
      <div className={styles.container}>
        {/* Search Bar */}
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, name, or subscription ID..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
        </div>

        {/* Status Filter Tabs */}
        <div className={styles.filterTabs}>
          {['all', 'active', 'paused', 'cancelled', 'past_due'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`${styles.filterTab} ${
                statusFilter === status ? styles.filterTabActive : ''
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Subscriptions Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>Loading subscriptions...</div>
          ) : subscriptions.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>=³</div>
              <div>No subscriptions found</div>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Next Billing</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.userName}</td>
                    <td>{sub.userEmail}</td>
                    <td>{sub.planName}</td>
                    <td>{getStatusBadge(sub.status)}</td>
                    <td>
                      {sub.nextBillingDate
                        ? new Date(sub.nextBillingDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      ${sub.amount.toFixed(2)}/{sub.interval}
                    </td>
                    <td>
                      <Link
                        href={`/admin/customer-service/subscriptions/${sub.id}`}
                        className={styles.actionButton}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DepartmentLayout>
  );
}

export const getServerSideProps = requireDepartmentAuth(Department.CUSTOMER_SERVICE);
