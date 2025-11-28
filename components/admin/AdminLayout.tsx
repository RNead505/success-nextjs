import { ReactNode, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './AdminLayout.module.css';

type Department =
  | 'SUPER_ADMIN'
  | 'CUSTOMER_SERVICE'
  | 'EDITORIAL'
  | 'SUCCESS_PLUS'
  | 'DEV'
  | 'MARKETING'
  | 'COACHING';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [userDepartments, setUserDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/admin/departments/user-departments');
          if (res.ok) {
            const data = await res.json();
            setUserDepartments(data.departments || []);
          }
        } catch (error) {
          console.error('Error fetching user departments:', error);
        } finally {
          setLoadingDepartments(false);
        }
      }
    }
    fetchDepartments();
  }, [session]);

  // Department links
  const departmentLinks = userDepartments.map((dept) => {
    const deptConfig: Record<Department, { name: string; href: string; icon: string }> = {
      SUPER_ADMIN: { name: 'Super Admin', href: '/admin/super', icon: '👑' },
      CUSTOMER_SERVICE: { name: 'Customer Service', href: '/admin/customer-service', icon: '🎧' },
      EDITORIAL: { name: 'Editorial', href: '/admin/editorial', icon: '✍️' },
      SUCCESS_PLUS: { name: 'SUCCESS+', href: '/admin/success-plus', icon: '✨' },
      DEV: { name: 'Dev', href: '/admin/dev', icon: '💻' },
      MARKETING: { name: 'Marketing', href: '/admin/marketing', icon: '📣' },
      COACHING: { name: 'Coaching', href: '/admin/coaching', icon: '🎯' },
    };
    return deptConfig[dept];
  });

  const navigationSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
      ]
    },
    {
      title: 'SUCCESS.com',
      items: [
        { name: 'Posts', href: '/admin/posts', icon: '📝' },
        { name: 'Pages', href: '/admin/pages', icon: '📄' },
        { name: 'Videos', href: '/admin/videos', icon: '🎥' },
        { name: 'Podcasts', href: '/admin/podcasts', icon: '🎙️' },
        { name: 'Comments', href: '/admin/comments', icon: '💬' },
        { name: 'Magazine Manager', href: '/admin/magazine-manager', icon: '📚' },
        { name: 'Categories', href: '/admin/categories', icon: '📁' },
        { name: 'Tags', href: '/admin/tags', icon: '🏷️' },
        { name: 'Media', href: '/admin/media', icon: '🖼️' },
      ]
    },
    {
      title: 'SUCCESS+',
      items: [
        { name: 'Content Hub', href: '/admin/success-plus', icon: '✨' },
        { name: 'Exclusive Articles', href: '/admin/success-plus/articles', icon: '📰' },
        { name: 'Members', href: '/admin/members', icon: '⭐' },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: '💳' },
        { name: 'Sales & Transactions', href: '/admin/sales', icon: '💰' },
        { name: 'Revenue Analytics', href: '/admin/revenue', icon: '📊' },
      ]
    },
    {
      title: 'CRM & Email',
      items: [
        { name: 'Contacts', href: '/admin/crm/contacts', icon: '👤' },
        { name: 'Campaigns', href: '/admin/crm/campaigns', icon: '📧' },
        { name: 'Email Templates', href: '/admin/crm/templates', icon: '📄' },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Editorial Calendar', href: '/admin/editorial-calendar', icon: '📅' },
        { name: 'Projects', href: '/admin/projects', icon: '📋' },
        { name: 'Staff Management', href: '/admin/staff', icon: '👥' },
        { name: 'Activity Log', href: '/admin/activity-log', icon: '📋' },
        { name: 'Site Monitor', href: '/admin/site-monitor', icon: '🔍' },
        { name: 'Content Viewer', href: '/admin/content-viewer', icon: '👁' },
        { name: 'Email Manager', href: '/admin/email-manager', icon: '✉️' },
        { name: 'Users', href: '/admin/users', icon: '👤' },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { name: 'SEO Manager', href: '/admin/seo', icon: '🎯' },
        { name: 'Plugins', href: '/admin/plugins', icon: '🔌' },
        { name: 'Cache Management', href: '/admin/cache', icon: '🚀' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>SUCCESS</h1>
          <p className={styles.subtitle}>Admin Dashboard</p>
        </div>

        <nav className={styles.nav}>
          {/* Department Dashboards */}
          {!loadingDepartments && departmentLinks.length > 0 && (
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>My Departments</div>
              {departmentLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {navigationSections.map((section) => (
            <div key={section.title} className={styles.navSection}>
              <div className={styles.navSectionTitle}>{section.title}</div>
              {section.items.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {session?.user && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {session.user.avatar ? (
                  <img src={session.user.avatar} alt={session.user.name || ''} />
                ) : (
                  <span>{session.user.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className={styles.userDetails}>
                <p className={styles.userName}>{session.user.name}</p>
                <p className={styles.userRole}>{session.user.role}</p>
              </div>
            </div>
          )}
          <button onClick={() => signOut()} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main} data-admin-layout="true">
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
