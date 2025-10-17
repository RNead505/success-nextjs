import Link from 'next/link';
import styles from './Breadcrumb.module.css';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <span className={styles.separator}>›</span>
        </li>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.href && index < items.length - 1 ? (
              <>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
                <span className={styles.separator}>›</span>
              </>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
