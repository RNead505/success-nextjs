import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';

export default function Layout({ children }) {
  return (
    <div>
      <Header />

      <main>
        {children}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}