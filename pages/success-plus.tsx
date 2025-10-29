import Layout from '../components/Layout';
import styles from './SuccessPlus.module.css';

export default function SuccessPlusPage() {
  return (
    <Layout>
      <div className={styles.successPlus}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Online Learning That Plays to Your Strengths</h1>
            <p className={styles.heroSubtitle}>
              Curated resources and expert insights based on your DISC profile to help you stay relevant in the modern working world
            </p>
            <a href="#plans" className={styles.heroCTA}>JOIN SUCCESS+ NOW</a>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>98,000+</div>
                <div className={styles.statLabel}>People using courses</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>120+</div>
                <div className={styles.statLabel}>Years of growth system</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>80+</div>
                <div className={styles.statLabel}>Hours of on-demand training</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>30-Day</div>
                <div className={styles.statLabel}>Risk-free trial</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You Can Achieve With SUCCESS+</h2>
            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Find clarity on your career goals</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Multiply your earning potential</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Enable a "digital nomad" lifestyle</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Protect yourself against inflation</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Land your dream job</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Build 6-7 figure income</p>
              </div>
              <div className={styles.benefit}>
                <span className={styles.bulletIcon}>✓</span>
                <p>Develop professional relationships</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.plansSection} id="plans">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Choose Your Membership</h2>
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
