import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Department, UserRole } from '@prisma/client';
import {  getDepartmentName, getDepartmentPath, getAccessibleDepartments } from '@/lib/departmentAuth';
import styles from './DepartmentLayout.module.css';

interface DepartmentLayoutProps {
  children: ReactNode;
  currentDepartment: Department;
  pageTitle: string;
  description?: string;
}

interface DepartmentSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    primaryDepartment?: Department | null;
    avatar?: string;
  };
}

export default function DepartmentLayout({
  children,
  currentDepartment,
  pageTitle,
  description,
}: DepartmentLayoutProps) {
  const { data: session, status } = useSession() as { data: DepartmentSession | null; status: string };
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Fetch notification count
    fetch('/api/admin/notifications/count')
      .then(res => res.json())
      .then(data => setNotificationCount(data.count))
      .catch(() => setNotificationCount(0));
  }, []);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;
  const accessibleDepartments = getAccessibleDepartments(user.role, user.primaryDepartment);

  // Shared features available in all departments
  const sharedFeatures = [
    {
      icon: '📋',
      label: 'Kanban Board',
      href: `/admin/${currentDepartment.toLowerCase().replace('_', '-')}/kanban`,
    },
    {
      icon: '📰',
      label: 'Activity Feed',
      href: `/admin/${currentDepartment.toLowerCase().replace('_', '-')}/activity`,
    },
    {
      icon: '🔔',
      label: 'Notifications',
      href: `/admin/${currentDepartment.toLowerCase().replace('_', '-')}/notifications`,
      badge: notificationCount,
    },
    {
      icon: '📢',
      label: 'Announcements',
      href: `/admin/${currentDepartment.toLowerCase().replace('_', '-')}/announcements`,
    },
  ];

  // Department-specific navigation (will be passed as prop or defined per department)
  const departmentNav = getDepartmentNavigation(currentDepartment);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin">
            <div className={styles.logo}>
              <span className={styles.logoIcon}>✨</span>
              <span className={styles.logoText}>SUCCESS</span>
            </div>
          </Link>
        </div>

        {/* Department Indicator */}
        <div className={styles.departmentBadge}>
          <span className={styles.departmentIcon}>{getDepartmentIcon(currentDepartment)}</span>
          <span className={styles.departmentName}>{getDepartmentName(currentDepartment)}</span>
        </div>

        {/* Shared Features */}
        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Shared</div>
          <nav className={styles.nav}>
            {sharedFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className={`${styles.navItem} ${router.pathname === feature.href ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{feature.icon}</span>
                <span className={styles.navLabel}>{feature.label}</span>
                {feature.badge && feature.badge > 0 && (
                  <span className={styles.navBadge}>{feature.badge}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Department-Specific Features */}
        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Department Tools</div>
          <nav className={styles.nav}>
            {departmentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${router.pathname === item.href ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Department Switcher (for Super Admin and Admin) */}
        {accessibleDepartments.length > 1 && (
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Switch Department</div>
            <nav className={styles.nav}>
              {accessibleDepartments.map((dept) => (
                <Link
                  key={dept}
                  href={getDepartmentPath(dept)}
                  className={`${styles.navItem} ${dept === currentDepartment ? styles.navItemActive : ''}`}
                >
                  <span className={styles.navIcon}>{getDepartmentIcon(dept)}</span>
                  <span className={styles.navLabel}>{getDepartmentName(dept)}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* User Profile */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
            ) : (
              <div className={styles.userAvatarPlaceholder}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.role}</div>
            </div>
          </div>
          <Link href="/api/auth/signout" className={styles.signOutButton}>
            <span>🚪</span>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.sidebarToggle}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
              {description && <p className={styles.pageDescription}>{description}</p>}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

// Department navigation configurations
function getDepartmentNavigation(department: Department) {
  const navConfigs: Record<Department, Array<{ icon: string; label: string; href: string }>> = {
    SUPER_ADMIN: [
      { icon: '👥', label: 'User & Role Management', href: '/admin/super/users' },
      { icon: '🔐', label: 'Permissions', href: '/admin/super/permissions' },
      { icon: '⚙️', label: 'System Configuration', href: '/admin/super/config' },
      { icon: '📊', label: 'Audit Logs', href: '/admin/super/audit-logs' },
      { icon: '🎯', label: 'Cross-Dashboard Access', href: '/admin/super/access' },
    ],
    CUSTOMER_SERVICE: [
      { icon: '💳', label: 'Subscriptions', href: '/admin/customer-service/subscriptions' },
      { icon: '🛒', label: 'Orders & Billing', href: '/admin/customer-service/orders' },
      { icon: '👤', label: 'User Accounts', href: '/admin/customer-service/users' },
      { icon: '💬', label: 'Support Tools', href: '/admin/customer-service/support' },
      { icon: '⚠️', label: 'Error Resolution', href: '/admin/customer-service/errors' },
    ],
    EDITORIAL: [
      { icon: '📝', label: 'Articles', href: '/admin/editorial/articles' },
      { icon: '✍️', label: 'Authors', href: '/admin/editorial/authors' },
      { icon: '🏷️', label: 'Categories & Tags', href: '/admin/editorial/taxonomy' },
      { icon: '📁', label: 'Media Library', href: '/admin/editorial/media' },
      { icon: '🔍', label: 'SEO Controls', href: '/admin/editorial/seo' },
      { icon: '📅', label: 'Publishing Queue', href: '/admin/editorial/queue' },
    ],
    SUCCESS_PLUS: [
      { icon: '💎', label: 'Product Management', href: '/admin/success-plus/products' },
      { icon: '👥', label: 'Members', href: '/admin/success-plus/members' },
      { icon: '🔒', label: 'Content Access', href: '/admin/success-plus/access' },
      { icon: '📧', label: 'Communications', href: '/admin/success-plus/communications' },
      { icon: '📈', label: 'Analytics', href: '/admin/success-plus/analytics' },
    ],
    DEV: [
      { icon: '🛠️', label: 'Dev Board', href: '/admin/dev/board' },
      { icon: '📊', label: 'System Monitoring', href: '/admin/dev/monitoring' },
      { icon: '🚀', label: 'Deployments', href: '/admin/dev/deployments' },
      { icon: '🔧', label: 'Technical Tools', href: '/admin/dev/tools' },
      { icon: '📚', label: 'Documentation', href: '/admin/dev/docs' },
    ],
    MARKETING: [
      { icon: '📢', label: 'Campaigns', href: '/admin/marketing/campaigns' },
      { icon: '🎨', label: 'Landing Pages', href: '/admin/marketing/landing-pages' },
      { icon: '✉️', label: 'Email Marketing', href: '/admin/marketing/email' },
      { icon: '📊', label: 'Analytics', href: '/admin/marketing/analytics' },
      { icon: '🎁', label: 'Promotions', href: '/admin/marketing/promotions' },
    ],
    COACHING: [
      { icon: '🎓', label: 'Programs', href: '/admin/coaching/programs' },
      { icon: '👨‍🏫', label: 'Coaches', href: '/admin/coaching/coaches' },
      { icon: '👤', label: 'Clients', href: '/admin/coaching/clients' },
      { icon: '📅', label: 'Session Scheduling', href: '/admin/coaching/scheduling' },
      { icon: '📚', label: 'Content Management', href: '/admin/coaching/content' },
      { icon: '💬', label: 'Communications', href: '/admin/coaching/communications' },
    ],
  };

  return navConfigs[department] || [];
}

// Department icons
function getDepartmentIcon(department: Department): string {
  const icons: Record<Department, string> = {
    SUPER_ADMIN: '⚡',
    CUSTOMER_SERVICE: '🎧',
    EDITORIAL: '✍️',
    SUCCESS_PLUS: '💎',
    DEV: '⚙️',
    MARKETING: '📈',
    COACHING: '🎓',
  };
  return icons[department];
}
