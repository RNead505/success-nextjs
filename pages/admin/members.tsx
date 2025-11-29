import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import RoleBadges from '../../components/admin/RoleBadges';
import styles from './Members.module.css';

type MembershipTier = 'Free' | 'Customer' | 'SUCCESSPlus' | 'VIP' | 'Enterprise';
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'STAFF';

interface Member {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipTier: MembershipTier;
  membershipStatus: string;
  totalSpent: number;
  lifetimeValue: number;
  createdAt: string;
  joinDate: string;
  subscription?: {
    status: string;
    currentPeriodEnd?: string;
    stripePriceId?: string;
    provider?: string;
  } | null;
  platformRole?: UserRole | null;
  isPlatformUser: boolean;
}

export default function MembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchMembers();
    }
  }, [session]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      } else {
        console.error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading members...</div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  // Filter members based on membership status and search term
  const filteredMembers = members.filter((member) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && (member.membershipStatus === 'Active' || member.subscription?.status === 'ACTIVE')) ||
      (filter === 'inactive' && member.membershipStatus !== 'Active' && member.subscription?.status !== 'ACTIVE');

    const matchesSearch =
      searchTerm === '' ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeCount = members.filter(
    (m) => m.membershipStatus === 'Active' || m.subscription?.status === 'ACTIVE'
  ).length;
  const inactiveCount = members.length - activeCount;

  return (
    <AdminLayout>
      <div className={styles.membersPage}>
        <div className={styles.header}>
          <div>
            <h1>Customers</h1>
            <p className={styles.subtitle}>
              Members who have purchased products or subscriptions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <h3>Total Members</h3>
              <p className={styles.statNumber}>{members.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3>Active Subscriptions</h3>
              <p className={styles.statNumber}>{activeCount}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏸️</div>
            <div className={styles.statContent}>
              <h3>Inactive/Pending</h3>
              <p className={styles.statNumber}>{inactiveCount}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <h3>MRR Estimate</h3>
              <p className={styles.statNumber}>${activeCount * 9.99}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={styles.controls}>
          <div className={styles.filters}>
            <button
              className={filter === 'all' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('all')}
            >
              All ({members.length})
            </button>
            <button
              className={filter === 'active' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('active')}
            >
              Active ({activeCount})
            </button>
            <button
              className={filter === 'inactive' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('inactive')}
            >
              Inactive ({inactiveCount})
            </button>
          </div>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Members Table */}
        <div className={styles.tableContainer}>
          {filteredMembers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No members found</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Membership</th>
                  <th>Total Spent</th>
                  <th>Customer Since</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberAvatar}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{member.name}</strong>
                          {member.isPlatformUser && (
                            <div className={styles.platformIndicator}>
                              (Also has platform access)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <RoleBadges
                        memberTier={member.membershipTier}
                        platformRole={member.platformRole}
                      />
                    </td>
                    <td>${member.totalSpent.toFixed(2)}</td>
                    <td>
                      {new Date(member.joinDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/members/${member.id}`}
                          className={styles.actionButton}
                        >
                          View
                        </Link>
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

// Force SSR to prevent NextRouter errors during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}
