import Link from 'next/link';
import styles from './Header.module.css';

const navItems = [
  { label: 'Mindset', path: '/category/mindset' },
  { label: 'Money', path: '/category/money' },
  { label: 'People', path: '/category/people' },
  { label: 'Well-Being', path: '/category/well-being' },
  { label: 'Impact', path: '/category/impact' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          SUCCESS
        </Link>
        <nav className={styles.nav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* We can add a search bar or social links here later */}
      </div>
    </header>
  );
}