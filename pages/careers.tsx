import Layout from '../components/Layout';
import styles from './Legal.module.css';

export default function CareersPage() {
  return (
    <Layout>
      <div className={styles.legal}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Careers</h1>
        </header>

        <section className={styles.content}>
          <div className={styles.body}>
            <p>
              Join the SUCCESS team and help millions of people achieve their goals and live their best lives.
            </p>

            <h2>Why Work at SUCCESS?</h2>
            <p>
              At SUCCESS, we're more than just a media company. We're a community of passionate individuals
              dedicated to helping people grow personally and professionally. Our team is made up of creative
              thinkers, innovative problem solvers, and dedicated professionals who are committed to excellence.
            </p>

            <h2>Current Opportunities</h2>
            <p>
              We're always looking for talented individuals to join our team. Please check back regularly
              for new opportunities or send your resume and cover letter to:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:careers@success.com">careers@success.com</a>
            </p>

            <h2>Our Culture</h2>
            <p>
              We believe in fostering a collaborative, inclusive environment where everyone can thrive.
              Our team members enjoy:
            </p>
            <ul>
              <li>Competitive compensation and benefits</li>
              <li>Professional development opportunities</li>
              <li>Flexible work arrangements</li>
              <li>A supportive, growth-oriented culture</li>
              <li>The chance to make a real impact</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              For career inquiries, please contact us at <a href="mailto:careers@success.com">careers@success.com</a>
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
