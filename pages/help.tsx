import Layout from '../components/Layout';
import styles from './Legal.module.css';

export default function HelpPage() {
  return (
    <Layout>
      <div className={styles.legal}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Help Center</h1>
        </header>

        <section className={styles.content}>
          <div className={styles.body}>
            <h2>How Can We Help?</h2>
            <p>
              Welcome to the SUCCESS Help Center. We're here to assist you with any questions or issues
              you may have.
            </p>

            <h2>Frequently Asked Questions</h2>

            <h3>Subscription & Account</h3>
            <ul>
              <li><strong>How do I subscribe to SUCCESS magazine?</strong> Visit our magazine page to choose from our available subscription options.</li>
              <li><strong>How do I manage my account?</strong> Sign in to your account and navigate to your profile settings to update your information.</li>
              <li><strong>How do I cancel my subscription?</strong> Contact our customer service team at customerservice@success.com.</li>
            </ul>

            <h3>SUCCESS+ Membership</h3>
            <ul>
              <li><strong>What is SUCCESS+?</strong> SUCCESS+ is our premium membership offering exclusive content, courses, and community access.</li>
              <li><strong>How do I access SUCCESS+ content?</strong> Sign in to your account and navigate to the SUCCESS+ section.</li>
              <li><strong>What's included in SUCCESS+?</strong> Members get access to exclusive videos, courses, live events, and our community platform.</li>
            </ul>

            <h3>Technical Issues</h3>
            <ul>
              <li><strong>I'm having trouble signing in</strong> - Try resetting your password or contact support if the issue persists.</li>
              <li><strong>Videos won't play</strong> - Ensure you have a stable internet connection and try refreshing the page.</li>
              <li><strong>I can't access my content</strong> - Verify your subscription is active and you're signed in with the correct account.</li>
            </ul>

            <h2>Contact Customer Service</h2>
            <p>
              If you need additional assistance, our customer service team is ready to help:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:customerservice@success.com">customerservice@success.com</a><br />
              <strong>Address:</strong> SUCCESS Enterprises LLC<br />
              5473 Blair Rd., Suite 100, PMB 30053<br />
              Dallas, TX 75231
            </p>

            <h2>Report a Technical Issue</h2>
            <p>
              Experiencing a technical problem? Please email us at <a href="mailto:customerservice@success.com">customerservice@success.com</a> with
              details about the issue, including:
            </p>
            <ul>
              <li>Your browser and device type</li>
              <li>Steps to reproduce the issue</li>
              <li>Any error messages you received</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
}
