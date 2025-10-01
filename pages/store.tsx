import Layout from '../components/Layout';
import styles from './Store.module.css';

export default function StorePage() {
  return (
    <Layout>
      <div className={styles.store}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>SUCCESS Store</h1>
            <p className={styles.heroSubtitle}>
              Tools and resources for your success journey
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.comingSoon}>
              <div className={styles.icon}>🏪</div>
              <h2 className={styles.comingSoonTitle}>Coming Soon</h2>
              <p className={styles.comingSoonText}>
                We're building something amazing! Our store will feature exclusive
                SUCCESS merchandise, books, courses, and resources to help you
                achieve your goals.
              </p>
              <div className={styles.notify}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.emailInput}
                />
                <button className={styles.notifyButton}>Notify Me</button>
              </div>
            </div>

            <div className={styles.categories}>
              <h3 className={styles.categoriesTitle}>What to Expect</h3>
              <div className={styles.categoriesGrid}>
                <div className={styles.category}>
                  <h4>📚 Books & Guides</h4>
                  <p>Curated collection of success literature</p>
                </div>
                <div className={styles.category}>
                  <h4>🎓 Online Courses</h4>
                  <p>Expert-led video training programs</p>
                </div>
                <div className={styles.category}>
                  <h4>👕 Merchandise</h4>
                  <p>Branded apparel and accessories</p>
                </div>
                <div className={styles.category}>
                  <h4>🎯 Resources</h4>
                  <p>Templates, tools, and worksheets</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
