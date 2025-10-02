import Layout from '../components/Layout';
import styles from './About.module.css';
import { fetchWordPressData } from '../lib/wordpress';

type TeamMember = {
  name: string;
  title: string;
  image: string;
  image2?: string;
  dreamCareer: string;
  bio: string;
  linkedin: string;
};

type AboutPageProps = {
  teamMembers: TeamMember[];
};

export default function AboutPage({ teamMembers }: AboutPageProps) {
  return (
    <Layout>
      <div className={styles.about}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About Us</h1>
            <p className={styles.heroSubtitle}>
              Your Trusted Guide to the Future of Work
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <iframe
              src="https://player.vimeo.com/video/1114343879?autoplay=1&playsinline=1&autopause=0&loop=1&muted=1&title=0&portrait=0&byline=0"
              className={styles.videoIframe}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="About SUCCESS"
            />
          </div>
        </section>

        {/* History Timeline */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our History</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <h3 className={styles.timelineYear}>1897</h3>
                <p className={styles.timelineText}>
                  Hotelier and author Orison Swett Marden sat in a small bedroom on Bowdoin Street in Boston churning out the very first issue of SUCCESS magazine.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <h3 className={styles.timelineYear}>1930s</h3>
                <p className={styles.timelineText}>
                  Think and Grow Rich by Napoleon Hill and How to Win Friends and Influence People by Dale Carnegie are published, which, along with SUCCESS, helped form the foundation of personal development.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <h3 className={styles.timelineYear}>1954-1980</h3>
                <p className={styles.timelineText}>
                  Napoleon Hill and W. Clement Stone, another writer and major personal development figure at the time, published the magazine as the rebranded SUCCESS Unlimited, eventually returning to its roots as SUCCESS.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <h3 className={styles.timelineYear}>2008</h3>
                <p className={styles.timelineText}>
                  After an acquisition by VideoPlus (later renamed SUCCESS Partners), the magazine was completely relaunched, bolstered for the first time by SUCCESS.com.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <h3 className={styles.timelineYear}>2020</h3>
                <p className={styles.timelineText}>
                  SUCCESS Enterprises was acquired by eXp World Holdings, the parent company of eXp Realty.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <h3 className={styles.timelineYear}>TODAY</h3>
                <p className={styles.timelineText}>
                  SUCCESS Enterprises continues to be the authority in personal and professional development with SUCCESS magazine, in addition to the recently launched The SUCCESS Magazine Podcast and SUCCESS+, a digital-only magazine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className={styles.teamSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <div className={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  <div className={styles.teamMemberImages}>
                    <img src={member.image} alt={member.name} className={styles.teamImage1} />
                    {member.image2 && (
                      <img src={member.image2} alt={member.name} className={styles.teamImage2} />
                    )}
                  </div>
                  <div className={styles.teamMemberContent}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberTitle}>{member.title}</p>
                    <div className={styles.memberDetails}>
                      <p className={styles.dreamCareer}><strong>Dream Career:</strong> {member.dreamCareer}</p>
                      <p className={styles.memberBio}>{member.bio}</p>
                      {member.linkedin && (
                        <a href={member.linkedin} className={styles.linkedinLink} target="_blank" rel="noopener noreferrer">
                          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Join the SUCCESS Community</h2>
            <p className={styles.ctaText}>
              Subscribe to get the latest insights, stories, and strategies delivered straight to your inbox.
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

export async function getStaticProps() {
  // Team members data extracted from WordPress
  const teamMembers: TeamMember[] = [
    {
      name: 'Kerrie Lee Brown',
      title: 'Vice President of Publishing, Editor-in-Chief',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_kerrie-lee-brown-2023.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-101.png',
      dreamCareer: 'Doing what I\'m doing',
      bio: 'Kerrie Lee Brown is an award-winning writer, editor and speaker who has worked in media and communications for three decades. She is published in 150 magazines worldwide, has interviewed some of the biggest names in Hollywood and business, and is the author of the book "My Heart, My Self: A Heartfelt Guide for Women Who Do Too Much" (Amazon), which has received various recognitions in the self-help category.',
      linkedin: 'https://www.linkedin.com/in/kerrieleebrown/'
    },
    {
      name: 'Rachel Nead',
      title: 'Vice President of Innovations',
      image: 'https://www.success.com/wp-content/uploads/2025/09/Rachel-Nead.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/09/Rachel-Nead-2.jpg',
      dreamCareer: 'Living it!',
      bio: 'Rachel is a mentor, coach, and AI builder helping unlock growth using the tools of tomorrow. With a decade in real estate, social media marketing, and public speaking, she brings tech, heart, and systems together to help people scale with ease.',
      linkedin: 'https://www.linkedin.com/in/rachel-nead-662a91117'
    },
    {
      name: 'Tyler Clayton',
      title: 'Platform Steward — Digital Content Ecosystem',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Tyler-Clayton.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Tyler-Clayton-1.jpg',
      dreamCareer: 'Screenwriter / director',
      bio: 'Tyler has over 10 years of marketing and content experience, spanning roles from strategist and producer to writer and creative lead. As Platform Steward at SUCCESS®, he drives the digital content ecosystem—scaling personal growth through AI innovation and collective impact.',
      linkedin: 'https://www.linkedin.com/in/tyler-clayton-09848a8/'
    },
    {
      name: 'Crysten Cornish',
      title: 'Social Media Community Coordinator',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Cryster-Cornish.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Cryster-Cornish-1.jpg',
      dreamCareer: 'French cafe owner',
      bio: 'With over eight years of experience, Crysten is a brand strategist and marketing expert who has led nationwide workshops to help businesses refine their messaging. As the social media community coordinator for SUCCESS®, she leverages her expertise in brand consulting to craft high-impact content and drive audience engagement.',
      linkedin: 'https://www.linkedin.com/in/crystencornish/'
    },
    {
      name: 'Shawana Crayton',
      title: 'Business Admin & Customer Support Specialist',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_shawana-crayton.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-90.png',
      dreamCareer: 'TV show host',
      bio: 'Shawana is a dynamic business administrator and customer support specialist with a proven track record of optimizing operations and delivering exceptional service. With years of experience in business administration, she ensures seamless workflows and fosters strong client relationships.',
      linkedin: ''
    }
  ];

  return {
    props: {
      teamMembers,
    },
    revalidate: 600,
  };
}
