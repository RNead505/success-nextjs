import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Content Viewer', href: '/admin/content-viewer', icon: '👁' },
    { name: 'Magazine Manager', href: '/admin/magazine-manager', icon: '📚' },
    { name: 'Posts', href: '/admin/posts', icon: '📝' },
    { name: 'Categories', href: '/admin/categories', icon: '📁' },
    { name: 'Tags', href: '/admin/tags', icon: '🏷️' },
    { name: 'Media', href: '/admin/media', icon: '🖼️' },
    { name: 'Videos', href: '/admin/videos', icon: '🎥' },
    { name: 'Podcasts', href: '/admin/podcasts', icon: '🎙️' },
    { name: 'Pages', href: '/admin/pages', icon: '📄' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
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
          {navigation.map((item) => {
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
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
