import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../Dashboard.module.css';

export default function AdminResources() {
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
        <title>Manage Resources - SUCCESS+ Admin</title>
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
            <h1>Manage Resources</h1>
            <Link href="/admin/dashboard-content" className={styles.backLink}>
              ← Back to Dashboard Content
            </Link>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>All Resources</h2>
              <button className={styles.primaryButton}>+ Add New Resource</button>
            </div>

            <div className={styles.notice}>
              <h3>🚧 Resource Management</h3>
              <p>
                Resource management interface is under development. You can add resources
                manually to the database using the Prisma schema.
              </p>
              <p>
                <strong>Database Model:</strong> resources
              </p>
              <p>
                <strong>Categories:</strong> TEMPLATES, GUIDES, WORKSHEETS, EBOOKS, TOOLS, CHECKLISTS
              </p>
              <Link href="/dashboard/resources" className={styles.previewLink}>
                Preview Resources Page →
              </Link>
            </div>

            <div className={styles.infoBox}>
              <h4>To add a resource manually:</h4>
              <ol>
                <li>Upload the file to your storage (e.g., AWS S3, Cloudinary)</li>
                <li>Use Prisma Studio or database client to insert into the <code>resources</code> table</li>
                <li>Include: title, description, category, fileUrl, fileType, fileSize</li>
                <li>Set <code>isPremium</code> to true for SUCCESS+ exclusive content</li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
