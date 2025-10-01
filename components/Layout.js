import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>SUCCESS Magazine</title>
        <meta name="description" content="Mirroring SUCCESS Magazine with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  );
}