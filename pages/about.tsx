import Layout from '../components/Layout';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <Layout>
      <div className={styles.about}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About SUCCESS</h1>
            <p className={styles.heroSubtitle}>
              Your Trusted Guide to the Future of Work
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.missionGrid}>
              <div className={styles.missionContent}>
                <h2 className={styles.sectionTitle}>Our Mission</h2>
                <p className={styles.text}>
                  SUCCESS is your guide for personal and professional development through
                  inspiration, motivation and training. We believe that everyone has the
                  potential to achieve extraordinary things, and we're here to help you
                  unlock that potential.
                </p>
                <p className={styles.text}>
                  For over 125 years, SUCCESS has been a leading voice in personal and
                  professional development, providing content and resources to help people
                  live their best lives.
                </p>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>125+</div>
                  <div className={styles.statLabel}>Years of Excellence</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>10M+</div>
                  <div className={styles.statLabel}>Readers Worldwide</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>1000+</div>
                  <div className={styles.statLabel}>Expert Contributors</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>50K+</div>
                  <div className={styles.statLabel}>Success Stories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Cover */}
        <section className={styles.section} style={{ backgroundColor: '#f9f9f9' }}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What We Cover</h2>
            <div className={styles.topicsGrid}>
              <div className={styles.topic}>
                <h3 className={styles.topicTitle}>Business</h3>
                <p className={styles.topicDescription}>
                  Strategies, insights, and best practices for building and growing
                  successful businesses in today's competitive landscape.
                </p>
              </div>
              <div className={styles.topic}>
                <h3 className={styles.topicTitle}>Money</h3>
                <p className={styles.topicDescription}>
                  Financial wisdom, investment strategies, and wealth-building advice
                  to help you achieve financial freedom.
                </p>
              </div>
              <div className={styles.topic}>
                <h3 className={styles.topicTitle}>Lifestyle</h3>
                <p className={styles.topicDescription}>
                  Tips for work-life balance, health, wellness, and creating a
                  fulfilling life beyond professional success.
                </p>
              </div>
              <div className={styles.topic}>
                <h3 className={styles.topicTitle}>Future of Work</h3>
                <p className={styles.topicDescription}>
                  Exploring emerging trends, technologies, and skills shaping the
                  modern workplace and careers of tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our History</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1897</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>The Beginning</h3>
                  <p className={styles.timelineText}>
                    SUCCESS Magazine was founded by Orison Swett Marden with a mission
                    to inspire and guide people toward achievement.
                  </p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1990s</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>Evolution</h3>
                  <p className={styles.timelineText}>
                    Expanded into multimedia content, becoming a comprehensive resource
                    for personal and professional development.
                  </p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2020s</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>Digital Transformation</h3>
                  <p className={styles.timelineText}>
                    Launched SUCCESS+ and enhanced digital offerings to serve the
                    modern professional in the evolving world of work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Join the SUCCESS Community</h2>
            <p className={styles.ctaText}>
              Subscribe to get the latest insights, stories, and strategies delivered
              straight to your inbox.
            </p>
            <a href="/subscribe" className={styles.ctaButton}>
              Subscribe Now
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
