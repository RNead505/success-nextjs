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
                  After an acquisition by VideoPlus (later renamed SUCCESS Partners), the magazine was completely relaunched, bolstered for the first time by <em>SUCCESS.com</em>.
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
      title: 'Chief Content Officer & Editor-in-Chief',
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
      dreamCareer: 'News Anchor',
      bio: 'Shawana has been with Success Enterprises for three years. With over 20 years of customer service experience, she finds joy in assisting others.',
      linkedin: ''
    },
    {
      name: 'Brianna Diaz',
      title: 'Social Media Assistant',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Brianna-Diaz.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Brianna-Diaz-1.jpg',
      dreamCareer: 'A director, bringing stories to life through compelling visuals and storytelling',
      bio: 'Brianna is a creative professional with experience in production assistance, script reading, video editing, and social media management. She brings strong organizational and creative skills to support projects across preproduction, production, and postproduction.',
      linkedin: ''
    },
    {
      name: 'Kathryn Giuffrida',
      title: 'Marketing Content & SEO Manager',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Kathryn-Giuffrida.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Kathryn-Giuffrida-1.jpg',
      dreamCareer: 'Homesteading mom of many',
      bio: 'As associate marketing editor at SUCCESS®, Kathryn oversees and assists with all SEO and partner content initiatives. She collaborates closely with our talented team of writers, editors, fact-checkers, uploaders, and SEO strategists to produce high-quality content that resonates with our audience. She has over six years of experience in SEO content production and has achieved multiple first-page rankings on Google, demonstrating her ability to create content that is both engaging and highly discoverable.',
      linkedin: ''
    },
    {
      name: 'Emily Holombek',
      title: 'E-Learning & Enrichment Content Specialist',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Emily-Holombek.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Emily-Holombek-1.jpg',
      dreamCareer: 'Therapy dog handler',
      bio: 'Emily has a diverse background in startups, teaching, coaching, and curriculum development, with a strong focus on course design and implementation. Passionate about innovation, she thrives on creating engaging learning experiences and enhancing educational content that drives success and makes a meaningful impact.',
      linkedin: ''
    },
    {
      name: 'Elly Kang',
      title: 'Marketing Operations Assistant',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Elly-Kang.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Elly-Kang-1.jpg',
      dreamCareer: 'Kindergarten teacher',
      bio: 'Driven by a passion for visual communication, Elly, who grew up in Korea, studied studio art at the University of Texas at Austin. With a strong interest in design and storytelling, she joined SUCCESS® as a marketing operations assistant, where she contributes to creative projects and brand engagement.',
      linkedin: ''
    },
    {
      name: 'Lauren Kerrigan',
      title: 'Creative Director',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_lauren-kerrigan-2023.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-96.png',
      dreamCareer: 'Touring master sommelier',
      bio: 'Lauren is the wrangler and creator of branding and graphic assets for all business divisions across SUCCESS® Enterprises. She is driven to make SUCCESS beautiful!',
      linkedin: ''
    },
    {
      name: 'Maya Korogodsky',
      title: 'Senior Marketing Manager',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_maya-korogodsky.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-102.png',
      dreamCareer: 'Fashion Designer',
      bio: 'Maya, a driven professional with a BBA in Marketing from the University of Michigan, has gained experience at SoulCycle, HBO, and Meta. Thriving in diverse global environments, Maya excels in collaboration and growth, possessing proficiency in English, Russian, and Hebrew. She is eager to contribute her skills and passion for driving results to dynamic teams.',
      linkedin: ''
    },
    {
      name: 'Virginia Le',
      title: 'Senior Production Manager',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_virginia-le-2023.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-97.png',
      dreamCareer: 'Chocolate consultant who travels the world',
      bio: 'Virginia is a detail-oriented individual responsible for overseeing numerous aspects, both significant and minor, in her role. Joining SUCCESS magazine\'s print production team in 2018, she ensures the Editorial Team stays on track, coordinates with printers, bulk customers, advertisers, vendors, and consultants to ensure timely magazine production.',
      linkedin: ''
    },
    {
      name: 'Ava Leach',
      title: 'Social Media Manager',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_ava-leach.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-103.png',
      dreamCareer: 'Formula 1 Driver',
      bio: 'Ava is a seasoned social media manager with over six years of industry experience. She specializes in driving engagement and brand visibility across diverse platforms, leveraging her expertise to create impactful digital strategies.',
      linkedin: ''
    },
    {
      name: 'Denise Long',
      title: 'QC and Fact Checker',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Denise-Long.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Denise-Long-1.jpg',
      dreamCareer: 'Book reviewer',
      bio: 'With over 20 years of professional experience in copy editing, writing, and fact-checking, Denise has worked with a variety of industries from news media and tech startups to academic institutions and nonprofits. At SUCCESS®, she is a vigilant extra set of eyes for style and accuracy.',
      linkedin: ''
    },
    {
      name: 'Jamie Lyons',
      title: 'Executive & Team Assistant',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Jamie-Lyons.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Jamie-Lyons-1.jpg',
      dreamCareer: 'Operate my own bed and breakfast',
      bio: 'Jamie has a wealth of experience in executive support, operations, and project management with a strong background in startup environments, where she\'s worn many hats beyond the traditional executive assistant role.',
      linkedin: ''
    },
    {
      name: 'Rena Machani',
      title: 'Editorial Assistant',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_rena-machani.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-104.png',
      dreamCareer: 'Author',
      bio: 'Rena grew up in Colorado, graduated from The University of Colorado Boulder in English, and pursed media and journalism. She recently joined SUCCESS magazine as their editorial assistant.',
      linkedin: ''
    },
    {
      name: 'Hugh Murphy',
      title: 'Product Development & Marketing Manager',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_hugh-murphy-2023.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-98.png',
      dreamCareer: 'Leftfielder for the Texas Rangers',
      bio: 'Hugh is a marketing professional with extensive career experience in the publishing and advertising industries.',
      linkedin: ''
    },
    {
      name: 'Shannon Nigut',
      title: 'Social Media Specialist',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Shannon-Nigut.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Shannon-Nigut-1.jpg',
      dreamCareer: 'Artist',
      bio: 'Shannon has nearly a decade of experience in social media, having worked both in agencies and in-house for clients. She specializes in content ideation, strategy, production, and reporting. As a freelancer and consultant, she partners with brands to elevate their digital presence and achieve measurable results.',
      linkedin: ''
    },
    {
      name: 'Emily O\'Brien',
      title: 'Print Managing Editor',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_emily-obrien.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-99.png',
      dreamCareer: 'THIS.',
      bio: 'Emily is the associate editor of SUCCESS magazine. She has contributed to more than 30 print and digital publications, focusing on architecture, wellness, travel, and lifestyle topics. She resides in Raleigh, North Carolina.',
      linkedin: ''
    },
    {
      name: 'Beth Shea',
      title: 'Online Managing Editor',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Beth-Shea.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Beth-Shea-1.jpg',
      dreamCareer: 'To be a wildlife warrior for the Steve Irwin Wildlife Reserve',
      bio: 'Beth has over 20 years of experience as a writer and editor of digital content and has worked with online publications including Hearst Newspapers, Forbes, Business Insider and American Express. She is the digital associate editor at SUCCESS®, where she sources the most engaging and inspiring stories to keep readers informed about current events.',
      linkedin: ''
    },
    {
      name: 'Kristen Tribe',
      title: 'Digital Magazine Editor',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Kristen-Tribe.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Kristen-Tribe-1.jpg',
      dreamCareer: 'Novelist with an antique/vintage store side hustle',
      bio: 'Kristen is a multitalented journalist with more than 20 years of experience writing and editing for award-winning newspapers and magazines. She\'s happiest when chasing a good story.',
      linkedin: ''
    },
    {
      name: 'Emily Tvelia',
      title: 'Marketing Operations Specialist',
      image: 'https://www.success.com/wp-content/uploads/2025/03/Emily-Tvelia.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2025/03/Emily-Tvelia-1.jpg',
      dreamCareer: 'Professional chef',
      bio: 'Emily has diverse marketing and project management knowledge with experience using various platforms to build brands, improve engagement, and optimize marketing technology. She\'s passionate about learning something new every day and eager to help solve problems that increase marketing efficiency.',
      linkedin: ''
    },
    {
      name: 'Pablo Urdiales Antelo',
      title: 'News Writer',
      image: 'https://www.success.com/wp-content/uploads/2024/03/staff_pablo-urdiales-antelo.jpg',
      image2: 'https://www.success.com/wp-content/uploads/2024/04/image-105.png',
      dreamCareer: 'Rock Star',
      bio: 'As news writer at SUCCESS®, Pablo explores how AI, emerging technologies, and today\'s strategic choices are shaping the way we live, work, and build the future. He translates complex innovations into clear insights that help leaders and professionals anticipate tomorrow\'s opportunities.',
      linkedin: ''
    }
  ];

  return {
    props: {
      teamMembers,
    },
    revalidate: 86400,
  };
}
