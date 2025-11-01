import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './dashboard.module.css';

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    router.push('/signin?redirect=/dashboard');
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>My Dashboard - SUCCESS+</title>
      </Head>

      <div className={styles.dashboardLayout}>
        {/* Sidebar Navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <img src="/success-logo.png" alt="SUCCESS" />
          </div>

          <nav className={styles.nav}>
            <button
              className={activeSection === 'dashboard' ? styles.active : ''}
              onClick={() => setActiveSection('dashboard')}
            >
              <span className={styles.icon}>📊</span>
              Dashboard
            </button>

            <button
              className={activeSection === 'courses' ? styles.active : ''}
              onClick={() => router.push('/dashboard/courses')}
            >
              <span className={styles.icon}>🎓</span>
              Courses
            </button>

            <button
              className={activeSection === 'disc' ? styles.active : ''}
              onClick={() => router.push('/dashboard/disc-profile')}
            >
              <span className={styles.icon}>📋</span>
              My DISC Profile
            </button>

            <button
              className={activeSection === 'resources' ? styles.active : ''}
              onClick={() => router.push('/dashboard/resources')}
            >
              <span className={styles.icon}>📚</span>
              Resource Library
            </button>

            <button
              className={activeSection === 'community' ? styles.active : ''}
              onClick={() => router.push('/dashboard/community')}
            >
              <span className={styles.icon}>👥</span>
              Community
            </button>

            <button
              className={activeSection === 'events' ? styles.active : ''}
              onClick={() => router.push('/dashboard/events')}
            >
              <span className={styles.icon}>📅</span>
              Events Calendar
            </button>

            <button
              className={activeSection === 'magazine' ? styles.active : ''}
              onClick={() => router.push('/magazine')}
            >
              <span className={styles.icon}>📖</span>
              Magazine
            </button>

            <button
              className={activeSection === 'podcast' ? styles.active : ''}
              onClick={() => router.push('/podcasts')}
            >
              <span className={styles.icon}>🎙️</span>
              Podcast
            </button>

            <button
              className={activeSection === 'shop' ? styles.active : ''}
              onClick={() => router.push('/store')}
            >
              <span className={styles.icon}>🛒</span>
              Shop
            </button>

            <button
              className={activeSection === 'help' ? styles.active : ''}
              onClick={() => router.push('/dashboard/help')}
            >
              <span className={styles.icon}>❓</span>
              Help Center
            </button>

            <button
              className={activeSection === 'billing' ? styles.active : ''}
              onClick={() => router.push('/dashboard/billing')}
            >
              <span className={styles.icon}>💳</span>
              Billing & Orders
            </button>

            <button
              className={activeSection === 'settings' ? styles.active : ''}
              onClick={() => router.push('/dashboard/settings')}
            >
              <span className={styles.icon}>⚙️</span>
              Settings
            </button>

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <span className={styles.icon}>🚪</span>
              Log Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Welcome back, {session.user?.name}!</h1>
            <p className={styles.subtitle}>Continue your journey to success</p>
          </div>

          {/* Quick Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎓</div>
              <div className={styles.statInfo}>
                <h3>Courses in Progress</h3>
                <p className={styles.statNumber}>3</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statInfo}>
                <h3>Completed Courses</h3>
                <p className={styles.statNumber}>12</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏱️</div>
              <div className={styles.statInfo}>
                <h3>Learning Hours</h3>
                <p className={styles.statNumber}>47</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statInfo}>
                <h3>Certificates Earned</h3>
                <p className={styles.statNumber}>8</p>
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          <section className={styles.section}>
            <h2>Continue Learning</h2>
            <div className={styles.coursesGrid}>
              <div className={styles.courseCard}>
                <div className={styles.courseImage}>
                  <img src="/placeholder-course.jpg" alt="Course" />
                  <div className={styles.progressBadge}>45% Complete</div>
                </div>
                <div className={styles.courseInfo}>
                  <h3>Jim Rohn's Foundations for Success</h3>
                  <p>Module 5 of 10</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '45%' }}></div>
                  </div>
                  <button className={styles.continueBtn}>Continue Course</button>
                </div>
              </div>

              <div className={styles.courseCard}>
                <div className={styles.courseImage}>
                  <img src="/placeholder-course.jpg" alt="Course" />
                  <div className={styles.progressBadge}>20% Complete</div>
                </div>
                <div className={styles.courseInfo}>
                  <h3>Leadership Masterclass</h3>
                  <p>Lesson 3 of 15</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '20%' }}></div>
                  </div>
                  <button className={styles.continueBtn}>Continue Course</button>
                </div>
              </div>

              <div className={styles.courseCard}>
                <div className={styles.courseImage}>
                  <img src="/placeholder-course.jpg" alt="Course" />
                  <div className={styles.progressBadge}>80% Complete</div>
                </div>
                <div className={styles.courseInfo}>
                  <h3>Time Management Mastery</h3>
                  <p>Almost done!</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '80%' }}></div>
                  </div>
                  <button className={styles.continueBtn}>Finish Course</button>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className={styles.section}>
            <h2>Upcoming Events</h2>
            <div className={styles.eventsList}>
              <div className={styles.eventCard}>
                <div className={styles.eventDate}>
                  <div className={styles.month}>JAN</div>
                  <div className={styles.day}>15</div>
                </div>
                <div className={styles.eventInfo}>
                  <h3>Live Q&A with SUCCESS Experts</h3>
                  <p>2:00 PM EST • Online</p>
                </div>
                <button className={styles.eventBtn}>Register</button>
              </div>

              <div className={styles.eventCard}>
                <div className={styles.eventDate}>
                  <div className={styles.month}>JAN</div>
                  <div className={styles.day}>22</div>
                </div>
                <div className={styles.eventInfo}>
                  <h3>Goal Setting Workshop</h3>
                  <p>6:00 PM EST • Virtual</p>
                </div>
                <button className={styles.eventBtn}>Register</button>
              </div>
            </div>
          </section>

          {/* Latest Magazine */}
          <section className={styles.section}>
            <h2>Latest Magazine Issue</h2>
            <div className={styles.magazineCard}>
              <div className={styles.magazineCover}>
                <img src="/magazine-cover.jpg" alt="SUCCESS Magazine" />
              </div>
              <div className={styles.magazineInfo}>
                <h3>November/December 2025</h3>
                <p className={styles.featured}>Featuring: Russell Brunson</p>
                <p>Discover the secrets to building a thriving business and living your best life.</p>
                <button className={styles.readBtn}>Read Now</button>
              </div>
            </div>
          </section>

          {/* Recommended Courses */}
          <section className={styles.section}>
            <h2>Recommended for You</h2>
            <div className={styles.recommendedGrid}>
              <div className={styles.recommendCard}>
                <img src="/placeholder-course.jpg" alt="Course" />
                <h4>Personal Development Blueprint</h4>
                <p>8 modules • Beginner</p>
                <button className={styles.startBtn}>Start Course</button>
              </div>

              <div className={styles.recommendCard}>
                <img src="/placeholder-course.jpg" alt="Course" />
                <h4>Communication Skills Bootcamp</h4>
                <p>12 lessons • Intermediate</p>
                <button className={styles.startBtn}>Start Course</button>
              </div>

              <div className={styles.recommendCard}>
                <img src="/placeholder-course.jpg" alt="Course" />
                <h4>Goal Setting for Success</h4>
                <p>6 modules • All Levels</p>
                <button className={styles.startBtn}>Start Course</button>
              </div>

              <div className={styles.recommendCard}>
                <img src="/placeholder-course.jpg" alt="Course" />
                <h4>Financial Freedom Fundamentals</h4>
                <p>10 modules • Beginner</p>
                <button className={styles.startBtn}>Start Course</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
