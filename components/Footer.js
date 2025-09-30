import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div className={styles.column}>
            <h4>Resources</h4>
            <Link href="/articles">Articles</Link>
            <Link href="/podcasts">Podcasts</Link>
            <Link href="/store">Store</Link>
          </div>
          <div className={styles.column}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
          <div className={styles.column}>
            <h4>Follow Us</h4>
            {/* We can add social media icons here later */}
            <Link href="https://facebook.com">Facebook</Link>
            <Link href="https://twitter.com">Twitter</Link>
            <Link href="https://instagram.com">Instagram</Link>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} SUCCESS Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}