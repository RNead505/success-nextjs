import Layout from '../components/Layout';
import styles from './Advertise.module.css';
import Head from 'next/head';

export default function AdvertisePage() {
  return (
    <Layout>
      <Head>
        <title>Advertise with SUCCESS Magazine | Reach Ambitious Professionals</title>
        <meta name="description" content="Partner with SUCCESS Magazine to reach millions of ambitious, growth-minded professionals. Multi-platform advertising opportunities for 2025." />
      </Head>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1>Advertise with SUCCESS</h1>
          <p>
            Reach millions of ambitious, growth-minded professionals across print, digital, and social media platforms
          </p>
        </section>

        {/* Stats Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Reach in 2025</h2>
          <p className={styles.sectionSubtitle}>
            SUCCESS connects you with the most engaged audience of entrepreneurs, executives, and high-achievers
          </p>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>10M+</p>
              <p className={styles.statLabel}>Monthly Readers</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>2.5M+</p>
              <p className={styles.statLabel}>Social Media Followers</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>500K+</p>
              <p className={styles.statLabel}>Magazine Subscribers</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>85%</p>
              <p className={styles.statLabel}>College Educated</p>
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className={styles.sectionAlt}>
          <h2 className={styles.sectionTitle}>Our Audience</h2>
          <p className={styles.sectionSubtitle}>
            Connect with decision-makers who are actively seeking solutions for business growth and personal development
          </p>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <h3>🎯 Demographics</h3>
              <p>
                • Average Age: 35-54<br />
                • 60% Male, 40% Female<br />
                • Average Income: $125,000+<br />
                • 65% in Management Roles
              </p>
            </div>
            <div className={styles.audienceCard}>
              <h3>💼 Professional Profile</h3>
              <p>
                • Entrepreneurs & Business Owners<br />
                • C-Suite Executives<br />
                • Sales & Marketing Leaders<br />
                • Self-Employed Professionals
              </p>
            </div>
            <div className={styles.audienceCard}>
              <h3>📈 Engagement</h3>
              <p>
                • 8+ minutes average time on site<br />
                • 42% return visitors<br />
                • 3.5 pages per session<br />
                • Highly responsive to premium offers
              </p>
            </div>
          </div>
        </section>

        {/* Advertising Opportunities */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Advertising Opportunities</h2>
          <p className={styles.sectionSubtitle}>
            Multi-platform solutions designed to maximize your brand's visibility and impact
          </p>
          <div className={styles.opportunitiesGrid}>
            <div className={styles.opportunityCard}>
              <h3>📰 Print Magazine</h3>
              <ul>
                <li>Full-page, half-page, and custom placements</li>
                <li>Premium positioning options</li>
                <li>Insert and bind-in opportunities</li>
                <li>Guaranteed circulation of 500,000+</li>
                <li>Pass-along rate of 3.2 readers per copy</li>
              </ul>
            </div>

            <div className={styles.opportunityCard}>
              <h3>💻 Digital Media</h3>
              <ul>
                <li>Display advertising & native content</li>
                <li>Sponsored articles & thought leadership</li>
                <li>Email newsletter sponsorships</li>
                <li>Video pre-roll & mid-roll ads</li>
                <li>Podcast sponsorships</li>
              </ul>
            </div>

            <div className={styles.opportunityCard}>
              <h3>📱 Social Media</h3>
              <ul>
                <li>Sponsored posts across all platforms</li>
                <li>Instagram & Facebook Stories</li>
                <li>LinkedIn promoted content</li>
                <li>Twitter/X sponsored tweets</li>
                <li>TikTok brand partnerships</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Ready to Grow Your Brand?</h2>
          <p>
            Partner with SUCCESS Magazine and reach the audience that matters most to your business
          </p>
          <div className={styles.ctaButtons}>
            <a href="mailto:advertising@success.com" className={styles.primaryButton}>
              Request Media Kit
            </a>
            <a href="mailto:advertising@success.com" className={styles.secondaryButton}>
              Schedule a Call
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section className={styles.contactSection}>
          <div className={styles.contactInfo}>
            <h3>Get in Touch</h3>
            <p>
              <a href="mailto:advertising@success.com">advertising@success.com</a>
            </p>
            <div className={styles.contactDetails}>
              <p><strong>SUCCESS Enterprises</strong></p>
              <p>200 Swisher Road</p>
              <p>Lake Dallas, TX 75065</p>
              <p>Phone: (940) 497-9700</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400, // Revalidate daily
  };
}
