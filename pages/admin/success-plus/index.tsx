import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import styles from '../Dashboard.module.css';
import { requireAdminAuth } from '@/lib/adminAuth';

export default function SuccessPlusHub() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const contentSections = [
    {
      title: 'Exclusive Articles',
      description: 'Manage SUCCESS+ exclusive articles and premium content',
      icon: '📰',
      color: '#c41e3a',
      href: '/admin/success-plus/articles',
      actions: [
        { label: 'View All Articles', href: '/admin/success-plus/articles' },
        { label: 'New Exclusive Article', href: '/admin/success-plus/articles/new' },
      ]
    },
    {
      title: 'Special Stories',
      description: 'Exclusive member-only stories and in-depth features',
      icon: '⭐',
      color: '#f59e0b',
      href: '/admin/success-plus/stories',
      actions: [
        { label: 'View All Stories', href: '/admin/success-plus/stories' },
        { label: 'New Special Story', href: '/admin/success-plus/stories/new' },
      ]
    },
    {
      title: 'Exclusive Videos',
      description: 'Member-only video content, training, and interviews',
      icon: '🎥',
      color: '#ec4899',
      href: '/admin/success-plus/videos',
      actions: [
        { label: 'View All Videos', href: '/admin/success-plus/videos' },
        { label: 'Upload New Video', href: '/admin/success-plus/videos/new' },
      ]
    },
    {
      title: 'Content Library',
      description: 'Curated library of courses, e-books, and resources',
      icon: '📚',
      color: '#10b981',
      href: '/admin/success-plus/library',
      actions: [
        { label: 'Browse Library', href: '/admin/success-plus/library' },
        { label: 'Add to Library', href: '/admin/success-plus/library/new' },
        { label: 'Organize Collections', href: '/admin/success-plus/library/collections' },
      ]
    },
    {
      title: 'Member Updates',
      description: 'Platform updates, announcements, and member communications',
      icon: '📢',
      color: '#667eea',
      href: '/admin/success-plus/updates',
      actions: [
        { label: 'View All Updates', href: '/admin/success-plus/updates' },
        { label: 'Post New Update', href: '/admin/success-plus/updates/new' },
        { label: 'Scheduled Posts', href: '/admin/success-plus/updates/scheduled' },
      ]
    },
    {
      title: 'Quick Links',
      description: 'Member resources, tools, and curated external links',
      icon: '🔗',
      color: '#8b5cf6',
      href: '/admin/success-plus/links',
      actions: [
        { label: 'Manage Links', href: '/admin/success-plus/links' },
        { label: 'Add New Link', href: '/admin/success-plus/links/new' },
        { label: 'Link Categories', href: '/admin/success-plus/links/categories' },
      ]
    },
    {
      title: 'Insider Newsletters',
      description: 'Monthly newsletters from SUCCESS leadership team',
      icon: '✉️',
      color: '#06b6d4',
      href: '/admin/success-plus/newsletters',
      actions: [
        { label: 'View Newsletters', href: '/admin/success-plus/newsletters' },
        { label: 'New Newsletter', href: '/admin/success-plus/newsletters/new' },
        { label: 'Schedule Delivery', href: '/admin/success-plus/newsletters/schedule' },
      ]
    },
    {
      title: 'Legacy Content',
      description: 'Historical SUCCESS video training and archived materials',
      icon: '🎞️',
      color: '#84cc16',
      href: '/admin/success-plus/legacy',
      actions: [
        { label: 'View Legacy Library', href: '/admin/success-plus/legacy' },
        { label: 'Upload Legacy Video', href: '/admin/success-plus/legacy/new' },
      ]
    },
  ];

  const membershipStats = [
    { label: 'Active Members', value: '---', color: '#c41e3a' },
    { label: 'Monthly Subscribers', value: '---', color: '#667eea' },
    { label: 'Annual Subscribers', value: '---', color: '#10b981' },
    { label: 'Exclusive Content', value: '---', color: '#f59e0b' },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1>SUCCESS+ Content Management</h1>
            <p className={styles.subtitle}>Manage exclusive content for SUCCESS+ Insider members</p>
          </div>
        </div>

        {/* Membership Stats */}
        <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
          {membershipStats.map((stat) => (
            <div key={stat.label} className={styles.statCard} style={{ borderTopColor: stat.color }}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className={styles.contentGrid}>
          {contentSections.map((section) => (
            <div key={section.title} className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{section.icon}</span>
                  <div>
                    <h2>{section.title}</h2>
                    <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.sectionActions} style={{ marginTop: '1rem' }}>
                {section.actions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={styles.actionButton}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f3f4f6',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#374151',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      display: 'inline-block',
                      marginRight: '0.5rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className={styles.quickTips} style={{ marginTop: '2rem', padding: '1.5rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>💡</span> SUCCESS+ Content Guidelines
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>Exclusive Articles:</strong> Tag with "success-plus" or "insider" to trigger paywall</li>
            <li><strong>Courses:</strong> Set member pricing vs. non-member pricing for discounts</li>
            <li><strong>Resources:</strong> E-books and guides should be downloadable PDFs or ePubs</li>
            <li><strong>Interviews:</strong> Video/audio content with cover talent - use high quality files</li>
            <li><strong>Newsletters:</strong> Sent 4x per month from leadership team (Glenn, Kerrie, Courtland, Rachel)</li>
            <li><strong>Legacy Content:</strong> Historical SUCCESS video training - categorize by topic/year</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

// Force SSR to prevent NextRouter errors during build

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
