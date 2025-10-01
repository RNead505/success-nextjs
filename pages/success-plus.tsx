import Layout from '../components/Layout';
import styles from './SuccessPlus.module.css';

export default function SuccessPlusPage() {
  return (
    <Layout>
      <div className={styles.successPlus}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Keep Your Access to SUCCESS+™</h1>
            <p className={styles.heroSubtitle}>
              It's easy to keep the insights, connections, and tools that enhance your daily life
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Here's What You Get With SUCCESS+</h2>
            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <span className={styles.bullet}>•</span>
                <p><strong>Expert-Led Content:</strong> Access practical articles, videos, and guides from industry leaders on topics that matter to you.</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bullet}>•</span>
                <p><strong>Digital Magazine Subscriptions:</strong> Read new and past issues of <em>SUCCESS®</em> and <em>SUCCESS+</em> magazines. Anytime. Anywhere.</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bullet}>•</span>
                <p><strong>Personalized Resources Built on DISC:</strong> From health to personal projects, SUCCESS+ offers tools that provide support for all areas of life.</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bullet}>•</span>
                <p><strong>Live Events & Workshops:</strong> Join exclusive live sessions where you can connect with speakers, learn new skills, and explore fresh ideas.</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bullet}>•</span>
                <p><strong>And more!</strong></p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.plansSection}>
          <div className={styles.container}>
            <div className={styles.plansGrid}>
              {/* Collective Membership */}
              <div className={styles.plan}>
                <div className={styles.planBadge}>YOUR CURRENT PLAN</div>
                <h3 className={styles.planName}>SUCCESS+ Collective Membership</h3>
                <p className={styles.planDescription}>
                  Stay on your growth journey and relevant in the modern working world with your current Collective Membership.
                </p>

                <div className={styles.planFeatures}>
                  <div className={styles.feature}>
                    <div className={styles.value}>$1,000+ VALUE</div>
                    <div><strong>On-demand training library</strong> with 80+ hours of upskilling content</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$24.99 VALUE</div>
                    <div>Digital subscription to our new <strong><em>SUCCESS+</em> magazine and historic <em>SUCCESS®</em> magazine</strong></div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$95+ VALUE</div>
                    <div><strong>SUCCESS+ app</strong> to keep momentum anytime, anywhere</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$99+ VALUE</div>
                    <div><strong>Daily inspiration texts</strong> to keep you fired up</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$499+ VALUE</div>
                    <div>NEW weekly articles, e-books, and <strong>exclusive content releases</strong></div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$60+ VALUE</div>
                    <div><strong>Members-only newsletter</strong> to supplement your daily progress</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$199 VALUE</div>
                    <div><strong>Jim Rohn's Timeless Wisdom, Powered By AI</strong></div>
                  </div>
                </div>

                <div className={styles.pricing}>
                  <div className={styles.totalValue}>Total value of $2,100+/year</div>
                  <div className={styles.price}>$209</div>
                  <div className={styles.billed}>billed annually</div>
                  <a href="#" className={styles.joinButton}>Join Now</a>
                  <div className={styles.monthly}>Or $24.99/month</div>
                </div>
              </div>

              {/* Insider Membership */}
              <div className={`${styles.plan} ${styles.recommended}`}>
                <div className={`${styles.planBadge} ${styles.recommendedBadge}`}>RECOMMENDED</div>
                <h3 className={styles.planName}>SUCCESS+ Insider Membership</h3>
                <p className={styles.planDescription}>
                  Upgrade to our all-inclusive Insider Membership and reach your goals faster! A $3,500 value, all yours for less than $1.50 per day.
                </p>

                <div className={styles.planFeatures}>
                  <div className={styles.feature}>
                    <div><strong>Everything in Collective, PLUS:</strong></div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$599 VALUE</div>
                    <div><strong>LIVE weekly Accountability Workshops</strong></div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$299 VALUE</div>
                    <div><strong>Monthly growth challenges</strong> to ensure you're consistently hitting your goals month after month</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$49+ VALUE</div>
                    <div><strong>Exclusive <em>SUCCESS®</em> magazine cover talent video interviews</strong> on cutting-edge industry insights</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$499 VALUE</div>
                    <div><strong>LIVE training webinars</strong> with top industry experts to accelerate your career, business, and financial growth</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$24.99 VALUE</div>
                    <div>Print edition of <strong><em>SUCCESS®</em> magazine</strong> delivered right to your door</div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$50+ VALUE</div>
                    <div><strong>Exclusive SUCCESS Store discounts</strong></div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.value}>$999+ VALUE</div>
                    <div><strong>Exclusive members-only event pricing and access</strong></div>
                  </div>
                </div>

                <div className={styles.pricing}>
                  <div className={styles.totalValue}>Total value of $3,500+/year</div>
                  <div className={styles.price}>$545</div>
                  <div className={styles.billed}>billed annually</div>
                  <a href="#" className={`${styles.joinButton} ${styles.joinButtonPrimary}`}>Join Now</a>
                  <div className={styles.monthly}>Or $64.99/month</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.whySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Keep Your Membership?</h2>
            <p className={styles.whyText}>
              Think of it as a steady source of connection and growth. SUCCESS+ is here to help you engage with what matters, stay informed, and seize new opportunities.
            </p>
            <p className={styles.whyText}>
              <strong>Don't Miss What's Coming Up:</strong> Get back to the people, resources, and ideas that support your goals.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
