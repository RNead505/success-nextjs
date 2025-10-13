import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="SUCCESS Magazine RSS Feed"
          href="/api/rss"
        />
      </Head>
      <div>
        <Header />

        <main>
          {children}
        </main>

        <Footer />
        <BackToTop />
      </div>
    </>
  );
}