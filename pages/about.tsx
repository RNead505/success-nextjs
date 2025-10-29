import Layout from '../components/Layout';
import SEO from '../components/SEO';
import styles from './About.module.css';

type AboutPageProps = {
  content: string;
  title: string;
};

export default function AboutPage({ content, title }: AboutPageProps) {
  return (
    <Layout>
      <SEO
        title="About Us | SUCCESS"
        description="Unlike any other time in human history, people need to continually keep up with expanding knowledge and perpetually develop new skills to stay relevant"
        url="https://www.success.com/about"
      />

      <div className={styles.about}>
        <div className={styles.container}>
          <h1 className={styles.title}>{title}</h1>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  // Static data from WordPress API (page ID: 32809)
  // This mirrors the exact content from success.com/about
  const content = `
<figure class="wp-block-image size-large"><img decoding="async" width="1024" height="465" src="https://www.success.com/wp-content/uploads/2021/09/241415086_868466037124331_6403472925494844943_n-1024x465.jpg" alt="" srcset="https://www.success.com/wp-content/uploads/2021/09/241415086_868466037124331_6403472925494844943_n-1024x465.jpg 1024w, https://www.success.com/wp-content/uploads/2021/09/241415086_868466037124331_6403472925494844943_n-300x136.jpg 300w, https://www.success.com/wp-content/uploads/2021/09/241415086_868466037124331_6403472925494844943_n-768x349.jpg 768w, https://www.success.com/wp-content/uploads/2021/09/241415086_868466037124331_6403472925494844943_n.jpg 1100w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>

<p>Unlike any other time in human history, people need to continually keep up with expanding knowledge and perpetually develop new skills to stay relevant and sustain their lifestyles. In every issue of&nbsp;<em>SUCCESS</em>&nbsp;magazine we will strive to bring you the thought leaders and success experts, both past and present, and reveal their key ideas and strategies to help you excel in every area of your personal and professional life. You also will be provided a unique window into the lives, practices and philosophies of today's greatest achievers-top CEOs, revolutionary entrepreneurs and other extraordinary leaders.</p>

<p><em>SUCCESS</em>&nbsp;is the only magazine that focuses on people who take full responsibility for their own development and income.&nbsp;<em>SUCCESS</em>&nbsp;readers understand that the world has changed and the classic employer-to-employee relationship has changed from a patriarchal to a transactional one. No longer can you expect a corporate training program and a predictable growth track. Our readers understand and embrace that they are responsible for their own long-term success and happiness, and need to be proactive in finding the inspiration, motivation and training to achieve their goals. Some may choose to start their own business but will prefer to keep it small-what some would call a micro business-so they will always have total control and visibility over its growth, spirit and contributions to society.&nbsp;<em>SUCCESS</em>&nbsp;readers desire the freedom and control to make all meaningful business decisions.</p>

<p><em>SUCCESS</em>&nbsp;magazine, established in 1897 by&nbsp;philosopher&nbsp;<a href="https://www.success.com/article/orison-swett-marden-an-original-thinker">Orison Swett Marden</a>,&nbsp;offers advice on best business practices, inspiration from major personalities in business and entertainment, and motivation to improve their mind and body so that our readers are in the best possible mental and physical shape to compete and reach their goals.</p>

<p>SUCCESS.com's mission is the same, but also addresses the needs of a generation who have entered the workforce after the rules changed. This generation lives in a highly competitive world where immediate performance is critical and most of the skills needed to succeed are self-generated. SUCCESS.com offers a more individualized approach to inspiration, motivation and training by delivering the content in a faster, immediate and topical way through multimedia platforms. Designed for those who work, learn and leisure on the go, our digital products deliver customized information based upon the user's needs and can be accessed at the exact time our users need the information, whether it is on our mobile app, shared socially in their social media feeds, delivered straight to their inbox or found as morning inspiration when they sit down to their desk and type www.success.com to start the day. Our users take SUCCESS.com with them into their jobs and use it as their own career coach while competing to improve personally and professionally.</p>

<p>Both&nbsp;<em>SUCCESS</em>&nbsp;magazine and SUCCESS.com readers understand and value the fact that they are empowered to control their own destiny. Our products are a key resource in their continued growth, leadership and motivation.</p>

<p><em>SUCCESS</em> magazine is published by SUCCESS Enterprises LLC, a subsidiary of eXp World Holdings.</p>
  `;

  return {
    props: {
      content,
      title: 'About Us',
    },
    revalidate: 86400, // 24 hours
  };
}
