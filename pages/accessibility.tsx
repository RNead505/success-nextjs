import Layout from '../components/Layout';
import styles from './Legal.module.css';

export default function AccessibilityPage() {
  return (
    <Layout>
      <div className={styles.legal}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Accessibility</h1>
        </header>

        <section className={styles.content}>
          <div className={styles.body}>
            <h2>Accessibility Statement</h2>
            <p>
              SUCCESS is committed to ensuring digital accessibility for people with disabilities.
              We are continually improving the user experience for everyone and applying the relevant
              accessibility standards.
            </p>

            <h2>Conformance Status</h2>
            <p>
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
              These guidelines explain how to make web content more accessible for people with disabilities
              and user-friendly for everyone.
            </p>

            <h2>Measures to Support Accessibility</h2>
            <p>SUCCESS takes the following measures to ensure accessibility:</p>
            <ul>
              <li>Include accessibility as part of our mission statement</li>
              <li>Integrate accessibility into our procurement practices</li>
              <li>Provide continual accessibility training for our staff</li>
              <li>Employ formal accessibility quality assurance methods</li>
            </ul>

            <h2>Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of SUCCESS. Please let us know if you
              encounter accessibility barriers:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:customerservice@success.com">customerservice@success.com</a><br />
              <strong>Address:</strong> SUCCESS Enterprises LLC<br />
              5473 Blair Rd., Suite 100, PMB 30053<br />
              Dallas, TX 75231
            </p>
            <p>
              We try to respond to feedback within 5 business days.
            </p>

            <h2>Technical Specifications</h2>
            <p>
              Accessibility of SUCCESS relies on the following technologies to work with the particular
              combination of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul>
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>

            <h2>Limitations and Alternatives</h2>
            <p>
              Despite our best efforts to ensure accessibility of SUCCESS, there may be some limitations.
              Below is a description of known limitations and potential solutions. Please contact us if
              you observe an issue not listed below.
            </p>
            <p>
              <strong>Known limitations:</strong>
            </p>
            <ul>
              <li><strong>Third-party content:</strong> Some content from third parties may not be fully accessible. We are working with our partners to improve accessibility.</li>
              <li><strong>Legacy content:</strong> Older content may not meet current accessibility standards. We are actively working to update this content.</li>
            </ul>

            <h2>Assessment Approach</h2>
            <p>
              SUCCESS assessed the accessibility of our website by the following approaches:
            </p>
            <ul>
              <li>Self-evaluation</li>
              <li>External evaluation</li>
            </ul>

            <p>
              <em>This statement was last updated on October 2, 2025.</em>
            </p>
          </div>
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
