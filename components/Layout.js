import Head from 'next/head';
import styles from './Layout.module.css';
import Header from './Header';
import Footer from './Footer'; // 1. Import the new Footer

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>SUCCESS Magazine</title>
        <meta name="description" content="Mirroring SUCCESS Magazine with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.mainContent}>
        {children}
      </main>

      <Footer /> {/* 2. Use the Footer component */}
    </div>
  );
}