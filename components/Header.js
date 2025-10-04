import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const navItems = [
  { label: 'MAGAZINE', path: '/magazine' },
  { label: 'SUCCESS+', path: '/success-plus' },
  { label: 'BUSINESS', path: '/category/business' },
  { label: 'MONEY', path: '/category/money' },
  { label: 'LIFESTYLE', path: '/category/lifestyle' },
  { label: 'FUTURE OF WORK', path: '/category/future-of-work' },
  { label: 'PODCASTS', path: '/podcasts' },
  { label: 'STORE', path: '/store' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <Link href="/newsletter" className={styles.newsletterLink}>
            SIGN UP FOR NEWSLETTER
          </Link>
          <div className={styles.topBarButtons}>
            <Link href="/signin" className={styles.signInButton}>
              SIGN IN
            </Link>
            <Link href="/subscribe" className={styles.subscribeButton}>
              SUBSCRIBE
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={styles.navBar}>
        <div className={styles.container}>
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link href="/" className={styles.logo}>
            SUCCESS
          </Link>

          <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.path} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.path}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/search" className={styles.searchButton} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
