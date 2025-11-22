import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import styles from './success-plus.module.css';

export default function SuccessPlusOffer() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleCheckout = async (tier: 'collective' | 'insider', cycle: 'monthly' | 'annual') => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          billingCycle: cycle,
          successUrl: `${window.location.origin}/success-plus/welcome`,
          cancelUrl: window.location.href,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your request. Please try again.');
    }
  };

  return (
    <Layout>
      <Head>
        <title>SUCCESS+ Membership - Unlock Your Full Potential</title>
        <meta name="description" content="Join SUCCESS+ for exclusive magazine access, member-only resources, and insider content. Only $7.99/month." />
      </Head>

      <div className={styles.successPlusPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Online Learning That Plays to Your Strengths</h1>
            <p className={styles.heroSubtitle}>
              Build the skills to multiply your earning potential, work flexibly,
              bulletproof yourself against inflation, land your dream job, build a
              consistent 6-7 figure income and develop the relationships that help
              you get there.
            </p>
            <button
              className={styles.ctaPrimary}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              JOIN SUCCESS+ NOW
            </button>
          </div>
        </section>

        {/* What's Included */}
        <section className={styles.whatsIncluded}>
          <h2>What's Included in Your Membership</h2>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>📚</div>
              <h3>On-Demand Training Library</h3>
              <p>Access 100+ courses on leadership, entrepreneurship, personal development, and more. New content added weekly.</p>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>📱</div>
              <h3>Mobile App Access</h3>
              <p>Learn on the go with our iOS and Android apps. Download courses for offline viewing.</p>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>📖</div>
              <h3>SUCCESS Magazine</h3>
              <p>Digital and print editions delivered monthly. Exclusive interviews with industry leaders.</p>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>👥</div>
              <h3>Insider Community</h3>
              <p>Connect with like-minded achievers. Network, collaborate, and grow together.</p>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎯</div>
              <h3>Expert-Led Courses</h3>
              <p>Learn from top entrepreneurs, thought leaders, and industry experts.</p>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🏆</div>
              <h3>Certificates & Recognition</h3>
              <p>Earn certificates of completion to showcase your professional development.</p>
            </div>
          </div>
        </section>

        {/* Does This Sound Like You */}
        <section className={styles.audience}>
          <h2>Does This Sound Like You?</h2>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <h4>Aspiring Entrepreneur</h4>
              <p>You want to start your own business but need the knowledge and confidence to take the leap.</p>
            </div>
            <div className={styles.audienceCard}>
              <h4>Career Climber</h4>
              <p>You're ready to level up in your career and need the skills to stand out.</p>
            </div>
            <div className={styles.audienceCard}>
              <h4>Side Hustler</h4>
              <p>You want to build additional income streams while keeping your day job.</p>
            </div>
            <div className={styles.audienceCard}>
              <h4>Business Owner</h4>
              <p>You're growing your business and need strategies to scale sustainably.</p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className={styles.pricing} id="pricing">
          <h2>Choose Your Membership Level</h2>

          <div className={styles.billingToggle}>
            <button
              className={billingCycle === 'monthly' ? styles.active : ''}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={billingCycle === 'annual' ? styles.active : ''}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className={styles.saveBadge}>SAVE 30%</span>
            </button>
          </div>

          <div className={styles.pricingGrid}>
            {/* Collective Tier */}
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>SUCCESS+ Collective</h3>
                <p className={styles.valueTag}>$2,100+ Value/Year</p>
              </div>

              <div className={styles.pricingPrice}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>
                  {billingCycle === 'annual' ? '75' : '7.99'}
                </span>
                <span className={styles.period}>
                  /{billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>

              <ul className={styles.featureList}>
                <li>✓ 100+ On-Demand Training Courses</li>
                <li>✓ Digital Magazine Access</li>
                <li>✓ Mobile App (iOS & Android)</li>
                <li>✓ Weekly New Content</li>
                <li>✓ Community Forum Access</li>
                <li>✓ Course Certificates</li>
                <li>✓ 30-Day Money-Back Guarantee</li>
              </ul>

              <button
                className={styles.ctaSecondary}
                onClick={() => handleCheckout('collective', billingCycle)}
              >
                Join Collective
              </button>
            </div>

            {/* Insider Tier */}
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.popularBadge}>MOST POPULAR</div>

              <div className={styles.pricingHeader}>
                <h3>SUCCESS+ Insider</h3>
                <p className={styles.valueTag}>$3,500+ Value/Year</p>
              </div>

              <div className={styles.pricingPrice}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>
                  {billingCycle === 'annual' ? '75' : '7.99'}
                </span>
                <span className={styles.period}>
                  /{billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>

              <ul className={styles.featureList}>
                <li>✓ <strong>Everything in Collective, plus:</strong></li>
                <li>✓ Print Magazine Delivered Monthly</li>
                <li>✓ Exclusive Insider-Only Content</li>
                <li>✓ Live Monthly Q&A Sessions</li>
                <li>✓ Priority Support</li>
                <li>✓ Early Access to New Courses</li>
                <li>✓ Private Networking Events</li>
                <li>✓ 1-on-1 Coaching Session (Annual)</li>
              </ul>

              <button
                className={styles.ctaPrimary}
                onClick={() => handleCheckout('insider', billingCycle)}
              >
                Join Insider
              </button>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className={styles.guarantee}>
          <h2>30-Day Risk-Free Guarantee</h2>
          <p>
            Try SUCCESS+ completely risk-free for 30 days. If you're not completely
            satisfied, we'll refund your membership—no questions asked.
          </p>
        </section>

        {/* FAQ */}
        <section className={styles.faq}>
          <h2>Frequently Asked Questions</h2>

          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>Can I cancel anytime?</h4>
              <p>Yes, you can cancel your membership at any time. No long-term contracts or commitments.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>What's the difference between tiers?</h4>
              <p>Collective gives you digital access to our training library and magazine. Insider adds print magazine delivery, exclusive content, live events, and coaching.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>How often is new content added?</h4>
              <p>We add new courses, articles, and training materials every week to keep you learning and growing.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>Is there a mobile app?</h4>
              <p>Yes! Our iOS and Android apps let you learn on the go. Download courses for offline viewing.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>What if I'm not satisfied?</h4>
              <p>We offer a 30-day money-back guarantee. If SUCCESS+ isn't right for you, we'll refund your purchase.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>Can I upgrade my membership?</h4>
              <p>Absolutely! You can upgrade from Collective to Insider anytime from your account settings.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <h2>Ready to Unlock Your Full Potential?</h2>
          <p>Join thousands of achievers building the skills for success.</p>
          <button
            className={styles.ctaPrimary}
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            GET STARTED NOW
          </button>
        </section>
      </div>
    </Layout>
  );
}

// Force SSR for AWS Amplify deployment compatibility
export async function getServerSideProps() {
  return {
    props: {},
  };
}
