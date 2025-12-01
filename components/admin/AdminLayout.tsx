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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

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

  // Load expanded state from localStorage and determine which section to auto-expand
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminNavExpanded');
      if (saved) {
        try {
          setExpandedSections(JSON.parse(saved));
        } catch (e) {
          // If parsing fails, determine active section
          determineActiveSection();
        }
      } else {
        // First load - determine which section should be expanded
        determineActiveSection();
      }
    }
  }, [router.pathname]);

  // Determine which section contains the current page
  const determineActiveSection = () => {
    const allSections = [
      { title: 'OVERVIEW', paths: ['/admin', '/admin/analytics'] },
      {
        title: 'SALES_CS',
        paths: ['/admin/sales-cs', '/admin/sales', '/admin/members', '/admin/subscribers', '/admin/subscriptions', '/admin/revenue', '/admin/orders', '/admin/refunds']
      },
      {
        title: 'SUCCESS_COM',
        paths: ['/admin/posts', '/admin/pages', '/admin/videos', '/admin/podcasts', '/admin/comments', '/admin/magazine-manager', '/admin/categories', '/admin/tags', '/admin/media']
      },
      { title: 'SUCCESS_PLUS', paths: ['/admin/success-plus'] },
      { title: 'CRM_EMAIL', paths: ['/admin/crm'] },
      {
        title: 'MANAGEMENT',
        paths: ['/admin/editorial-calendar', '/admin/projects', '/admin/staff', '/admin/activity-log', '/admin/site-monitor', '/admin/content-viewer', '/admin/email-manager', '/admin/users']
      },
      { title: 'CONFIGURATION', paths: ['/admin/seo', '/admin/plugins', '/admin/cache', '/admin/settings'] },
      {
        title: 'DEVOPS',
        paths: ['/admin/devops']
      },
    ];

    const newExpanded: Record<string, boolean> = {};

    for (const section of allSections) {
      const isActive = section.paths.some(path =>
        router.pathname === path || router.pathname.startsWith(path + '/')
      );
      newExpanded[section.title] = isActive;
    }

    setExpandedSections(newExpanded);
  };

  // Toggle section and save to localStorage
  const toggleSection = (sectionKey: string) => {
    const newExpanded = {
      ...expandedSections,
      [sectionKey]: !expandedSections[sectionKey],
    };
    setExpandedSections(newExpanded);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminNavExpanded', JSON.stringify(newExpanded));
    }
  };

  const navigationSections = [
    {
      key: 'OVERVIEW',
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
      ]
    },
    {
      key: 'SALES_CS',
      title: 'Sales & Customer Service',
      items: [
        { name: 'Sales & CS Dashboard', href: '/admin/sales-cs', icon: '🎯' },
        { name: 'Members', href: '/admin/members', icon: '➕' },
        { name: 'Subscribers', href: '/admin/subscribers', icon: '👥' },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: '💳' },
        { name: 'Revenue Analytics', href: '/admin/revenue', icon: '📊' },
        { name: 'Orders & Fulfillment', href: '/admin/orders', icon: '📦' },
        { name: 'Refunds & Disputes', href: '/admin/refunds', icon: '🔄' },
      ]
    },
    {
      key: 'SUCCESS_COM',
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
      key: 'SUCCESS_PLUS',
      title: 'SUCCESS+',
      items: [
        { name: 'Content Hub', href: '/admin/success-plus', icon: '✨' },
        { name: 'Exclusive Articles', href: '/admin/success-plus/articles', icon: '📰' },
        { name: 'SUCCESS+ Members', href: '/admin/members?tier=SUCCESSPlus', icon: '⭐' },
      ]
    },
    {
      key: 'CRM_EMAIL',
      title: 'CRM & Email',
      items: [
        { name: 'Contacts', href: '/admin/crm/contacts', icon: '👤' },
        { name: 'Campaigns', href: '/admin/crm/campaigns', icon: '📧' },
        { name: 'Email Templates', href: '/admin/crm/templates', icon: '📄' },
      ]
    },
    {
      key: 'MANAGEMENT',
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
      key: 'CONFIGURATION',
      title: 'Configuration',
      items: [
        { name: 'SEO Manager', href: '/admin/seo', icon: '🎯' },
        { name: 'Plugins', href: '/admin/plugins', icon: '🔌' },
        { name: 'Cache Management', href: '/admin/cache', icon: '🚀' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
      ]
    },
    {
      key: 'DEVOPS',
      title: 'DevOps & Developer',
      items: [
        { name: 'Deployments', href: '/admin/devops/deployments', icon: '🚀' },
        { name: 'Error Logs', href: '/admin/devops/error-logs', icon: '🐛' },
        { name: 'Cache Management', href: '/admin/devops/cache', icon: '💾' },
        { name: 'System Health', href: '/admin/devops/system-health', icon: '💚' },
        { name: 'Feature Flags', href: '/admin/devops/feature-flags', icon: '🚩' },
        { name: 'Documentation', href: '/admin/devops/documentation', icon: '📚' },
        { name: 'Safe Tools', href: '/admin/devops/safe-tools', icon: '🔧' },
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

          {navigationSections.map((section) => {
            const isExpanded = expandedSections[section.key] ?? false;
            return (
              <div key={section.title} className={styles.navSection}>
                <div
                  className={styles.navSectionTitle}
                  onClick={() => toggleSection(section.key)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span>{section.title}</span>
                  <span className={styles.chevron}>{isExpanded ? '▼' : '▶'}</span>
                </div>
                {isExpanded && section.items.map((item) => {
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
            );
          })}
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
