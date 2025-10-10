import { useEffect } from 'react';

export default function StorePage() {
  useEffect(() => {
    // Redirect to external SUCCESS+ shop
    window.location.href = 'https://mysuccessplus.com/shop';
  }, []);

  return (
    <Layout>
      <SEO
        title="Store | SUCCESS"
        description="Shop SUCCESS Magazine products, subscriptions, and exclusive SUCCESS+ content"
        url="https://www.success.com/store"
      />
      <div className={styles.store}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>SUCCESS Store</h1>
            <p className={styles.heroSubtitle}>
              Shop magazines, subscriptions, and exclusive products
            </p>
          </div>
        </section>

        {/* Store Options */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.storeGrid}>
              {/* Magazine Subscription */}
              <div className={styles.storeCard}>
                <div className={styles.cardIcon}>📚</div>
                <h2 className={styles.cardTitle}>Magazine Subscription</h2>
                <p className={styles.cardText}>
                  Get SUCCESS Magazine delivered to your door. Print and digital access included.
                </p>
                <a href="/magazine" className={styles.cardButton}>
                  View Magazine
                </a>
              </div>

              {/* SUCCESS+ Membership */}
              <div className={styles.storeCard}>
                <div className={styles.cardIcon}>⭐</div>
                <h2 className={styles.cardTitle}>SUCCESS+ Membership</h2>
                <p className={styles.cardText}>
                  Access exclusive content, videos, podcasts, and digital magazines.
                </p>
                <a href="/success-plus" className={styles.cardButton}>
                  Learn More
                </a>
              </div>

              {/* Shop Products */}
              <div className={styles.storeCard}>
                <div className={styles.cardIcon}>🛍️</div>
                <h2 className={styles.cardTitle}>Shop Products</h2>
                <p className={styles.cardText}>
                  Browse our full selection of products, books, and exclusive merchandise.
                </p>
                <a
                  href="https://mysuccessplus.com/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardButton}
                >
                  Visit Store
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your SUCCESS Journey?</h2>
            <p className={styles.ctaText}>
              Join thousands of entrepreneurs, business leaders, and achievers who trust SUCCESS for guidance and inspiration.
            </p>
            <div className={styles.ctaButtons}>
              <a href="/subscribe" className={styles.ctaPrimaryButton}>
                Subscribe Now
              </a>
              <a href="/newsletter" className={styles.ctaSecondaryButton}>
                Get Newsletter
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
