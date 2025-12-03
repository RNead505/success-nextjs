import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../Dashboard.module.css';
import { requireAdminAuth } from '../../lib/adminAuth';

export default function AdminEvents() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Manage Events - SUCCESS+ Admin</title>
      </Head>

      <div className={styles.adminLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <h2>SUCCESS Admin</h2>
          </div>
          <nav className={styles.nav}>
            <Link href="/admin">
              <button>📊 Dashboard</button>
            </Link>
            <Link href="/admin/dashboard-content">
              <button>🎓 SUCCESS+ Content</button>
            </Link>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Manage Events</h1>
            <Link href="/admin/dashboard-content" className={styles.backLink}>
              ← Back to Dashboard Content
            </Link>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>All Events</h2>
              <button className={styles.primaryButton}>+ Add New Event</button>
            </div>

            <div className={styles.notice}>
              <h3>🚧 Event Management</h3>
              <p>
                Event management interface is under development. You can add events
                manually to the database using the Prisma schema.
              </p>
              <p>
                <strong>Database Models:</strong> events, event_registrations
              </p>
              <p>
                <strong>Event Types:</strong> WEBINAR, WORKSHOP, QA_SESSION, NETWORKING, MASTERCLASS, CONFERENCE
              </p>
              <Link href="/dashboard/events" className={styles.previewLink}>
                Preview Events Page →
              </Link>
            </div>

            <div className={styles.infoBox}>
              <h4>To add an event manually:</h4>
              <ol>
                <li>Use Prisma Studio or database client to insert into the <code>events</code> table</li>
                <li>Include: title, slug, description, eventType, startDateTime, endDateTime</li>
                <li>Add timezone (default: "America/New_York")</li>
                <li>Add location URL for virtual events or physical address</li>
                <li>Set <code>maxAttendees</code> for capacity limits (optional)</li>
                <li>Set <code>isPublished</code> to true when ready</li>
                <li>Set <code>isPremium</code> to true for SUCCESS+ exclusive events</li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
