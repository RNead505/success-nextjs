import Layout from '../components/Layout';
import styles from './Subscribe.module.css';

export default function SubscribePage() {
  return (
    <Layout>
      <div className={styles.subscribe}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Subscribe to SUCCESS</h1>
            <p className={styles.heroSubtitle}>
              Join millions of readers on their journey to success
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.plansGrid}>
              {/* SUCCESS+ Insider - Monthly Plan */}
              <div className={styles.plan}>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>SUCCESS+ Insider</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>$7.99</span>
                    <span className={styles.period}>/month</span>
                  </div>
                  <p className={styles.billingNote}>Billed monthly ($95.88/year)</p>
                </div>
                <ul className={styles.features}>
                  <li>✓ 6 Print + 6 Digital magazine editions/year</li>
                  <li>✓ Digital access to each print issue</li>
                  <li>✓ Exclusive interviews with cover talent</li>
                  <li>✓ Discounted access to paid courses</li>
                  <li>✓ Free course library (select titles)</li>
                  <li>✓ E-books, guides & worksheets</li>
                  <li>✓ Insider Newsletter (4/month)</li>
                  <li>✓ Legacy SUCCESS video training</li>
                  <li>✓ Additional member discounts</li>
                </ul>
                <button className={styles.planButton}>Subscribe Monthly</button>
              </div>

              {/* SUCCESS+ Insider - Annual Plan (Featured) */}
              <div className={`${styles.plan} ${styles.featured}`}>
                <div className={styles.badge}>Save 22% - Best Value!</div>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>SUCCESS+ Insider</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>$75</span>
                    <span className={styles.period}>/year</span>
                  </div>
                  <p className={styles.savings}>Save over $20 compared to monthly!</p>
                </div>
                <ul className={styles.features}>
                  <li>✓ 6 Print + 6 Digital magazine editions/year</li>
                  <li>✓ Digital access to each print issue</li>
                  <li>✓ Exclusive interviews with cover talent</li>
                  <li>✓ Discounted access to paid courses</li>
                  <li>✓ Free course library (select titles)</li>
                  <li>✓ E-books, guides & worksheets</li>
                  <li>✓ Insider Newsletter (4/month)</li>
                  <li>✓ Legacy SUCCESS video training</li>
                  <li>✓ Additional member discounts</li>
                </ul>
                <button className={styles.planButtonFeatured}>Subscribe Annually</button>
              </div>
            </div>

            <div className={styles.guarantee}>
              <p className={styles.guaranteeText}>
                💯 30-Day Money-Back Guarantee • Cancel Anytime
              </p>
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faq}>
                <h3 className={styles.faqQuestion}>Can I cancel anytime?</h3>
                <p className={styles.faqAnswer}>
                  Yes! You can cancel your subscription at any time with no penalties or fees.
                </p>
              </div>
              <div className={styles.faq}>
                <h3 className={styles.faqQuestion}>What payment methods do you accept?</h3>
                <p className={styles.faqAnswer}>
                  We accept all major credit cards, PayPal, and Apple Pay.
                </p>
              </div>
              <div className={styles.faq}>
                <h3 className={styles.faqQuestion}>How does the print delivery work?</h3>
                <p className={styles.faqAnswer}>
                  Print magazines are shipped monthly to your address. Expect delivery within 5-7 business days.
                </p>
              </div>
              <div className={styles.faq}>
                <h3 className={styles.faqQuestion}>Is there a student discount?</h3>
                <p className={styles.faqAnswer}>
                  Yes! Students can get 50% off any plan with a valid student ID.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
