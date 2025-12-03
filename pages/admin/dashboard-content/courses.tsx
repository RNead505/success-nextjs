import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../Dashboard.module.css';
import { requireAdminAuth } from '../../lib/adminAuth';

export default function AdminCourses() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
        router.push('/');
      } else {
        fetchCourses();
      }
    }
  }, [status, session, router]);

  const fetchCourses = async () => {
    try {
      // This would fetch from an admin API endpoint
      // For now, it's a placeholder
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Manage Courses - SUCCESS+ Admin</title>
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
            <Link href="/admin/posts">
              <button>📝 Posts</button>
            </Link>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Manage Courses</h1>
            <Link href="/admin/dashboard-content" className={styles.backLink}>
              ← Back to Dashboard Content
            </Link>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>All Courses</h2>
              <button className={styles.primaryButton}>+ Add New Course</button>
            </div>

            <div className={styles.notice}>
              <h3>🚧 Course Management</h3>
              <p>
                Course management interface is under development. You can add courses
                manually to the database using the Prisma schema.
              </p>
              <p>
                <strong>Database Models:</strong> courses, course_modules, course_lessons, course_enrollments
              </p>
              <Link href="/dashboard/courses" className={styles.previewLink}>
                Preview Courses Page →
              </Link>
            </div>

            <div className={styles.infoBox}>
              <h4>To add a course manually:</h4>
              <ol>
                <li>Use Prisma Studio or database client to insert into the <code>courses</code> table</li>
                <li>Add course modules to the <code>course_modules</code> table</li>
                <li>Add lessons to each module in the <code>course_lessons</code> table</li>
                <li>Set <code>isPublished</code> to true when ready</li>
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
