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
              {/* Digital Plan */}
              <div className={styles.plan}>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>Digital</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>$9.99</span>
                    <span className={styles.period}>/month</span>
                  </div>
                </div>
                <ul className={styles.features}>
                  <li>✓ Unlimited digital magazine access</li>
                  <li>✓ Mobile & tablet apps</li>
                  <li>✓ Exclusive online content</li>
                  <li>✓ Archive access</li>
                </ul>
                <button className={styles.planButton}>Choose Digital</button>
              </div>

              {/* Print + Digital Plan */}
              <div className={`${styles.plan} ${styles.featured}`}>
                <div className={styles.badge}>Most Popular</div>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>Print + Digital</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>$19.99</span>
                    <span className={styles.period}>/month</span>
                  </div>
                </div>
                <ul className={styles.features}>
                  <li>✓ Everything in Digital</li>
                  <li>✓ Print magazine delivery</li>
                  <li>✓ Collector's editions</li>
                  <li>✓ Early access to content</li>
                  <li>✓ Members-only events</li>
                </ul>
                <button className={styles.planButtonFeatured}>Choose Print + Digital</button>
              </div>

              {/* SUCCESS+ Plan */}
              <div className={styles.plan}>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>SUCCESS+</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>$29.99</span>
                    <span className={styles.period}>/month</span>
                  </div>
                </div>
                <ul className={styles.features}>
                  <li>✓ Everything in Print + Digital</li>
                  <li>✓ Video courses & workshops</li>
                  <li>✓ 1-on-1 coaching sessions</li>
                  <li>✓ Premium community access</li>
                  <li>✓ VIP event invitations</li>
                </ul>
                <button className={styles.planButton}>Choose SUCCESS+</button>
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
