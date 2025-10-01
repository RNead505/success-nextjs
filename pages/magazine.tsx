import Layout from '../components/Layout';
import styles from './Magazine.module.css';

export default function MagazinePage() {
  return (
    <Layout>
      <div className={styles.magazine}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>SUCCESS Magazine</h1>
            <p className={styles.heroSubtitle}>
              125+ Years of Inspiration and Guidance
            </p>
          </div>
        </section>

        {/* Current Issue */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Current Issue</h2>
            <div className={styles.currentIssue}>
              <div className={styles.coverImage}>
                <img
                  src="https://www.success.com/wp-content/uploads/2023/09/Jesse-Itzler-SUCCESS-Magazine-Cover-Story.jpg"
                  alt="Current Issue Cover"
                  className={styles.cover}
                />
              </div>
              <div className={styles.issueDetails}>
                <span className={styles.issueDate}>September 2025</span>
                <h3 className={styles.issueTitle}>The Entrepreneurial Mindset</h3>
                <p className={styles.issueDescription}>
                  Discover the secrets of successful entrepreneurs and learn how to
                  develop the mindset that drives innovation, resilience, and growth
                  in today's competitive business landscape.
                </p>
                <div className={styles.features}>
                  <h4 className={styles.featuresTitle}>Featured Articles</h4>
                  <ul className={styles.featuresList}>
                    <li>The Future of Remote Work and Hybrid Teams</li>
                    <li>Building Wealth Through Strategic Investing</li>
                    <li>Leadership in Times of Change</li>
                    <li>Balancing Ambition with Well-Being</li>
                  </ul>
                </div>
                <a href="/subscribe" className={styles.subscribeButton}>
                  Subscribe Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Subscribe */}
        <section className={styles.section} style={{ backgroundColor: '#f9f9f9' }}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Subscribe?</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>📰</div>
                <h3 className={styles.benefitTitle}>Print & Digital Access</h3>
                <p className={styles.benefitText}>
                  Get the magazine delivered to your door and enjoy unlimited digital access
                </p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>🎯</div>
                <h3 className={styles.benefitTitle}>Exclusive Content</h3>
                <p className={styles.benefitText}>
                  Access subscriber-only articles, interviews, and resources
                </p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>🎓</div>
                <h3 className={styles.benefitTitle}>Expert Insights</h3>
                <p className={styles.benefitText}>
                  Learn from industry leaders and successful entrepreneurs
                </p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>🌟</div>
                <h3 className={styles.benefitTitle}>Actionable Strategies</h3>
                <p className={styles.benefitText}>
                  Practical advice you can implement in your business and life
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Archive */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Past Issues</h2>
            <div className={styles.archiveGrid}>
              {[
                { month: 'August 2025', title: 'Leadership Excellence' },
                { month: 'July 2025', title: 'Digital Transformation' },
                { month: 'June 2025', title: 'Wellness & Success' },
                { month: 'May 2025', title: 'The Future of AI' },
                { month: 'April 2025', title: 'Financial Freedom' },
                { month: 'March 2025', title: 'Personal Branding' },
              ].map((issue, index) => (
                <div key={index} className={styles.archiveItem}>
                  <div className={styles.archiveCover}>
                    <span className={styles.archiveMonth}>{issue.month}</span>
                  </div>
                  <h4 className={styles.archiveTitle}>{issue.title}</h4>
                </div>
              ))}
            </div>
            <div className={styles.viewMore}>
              <a href="/magazine/archive" className={styles.viewMoreButton}>
                View Full Archive
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
