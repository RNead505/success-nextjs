import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import styles from './AdminPages.module.css';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminPages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchPages();
    }
  }, [session]);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages?per_page=100');
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPages(pages.filter(p => p.id !== id));
      } else {
        throw new Error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading pages...</div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Pages</h1>
          <Link href="/admin/pages/new" className={styles.addButton}>
            + New Page
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className={styles.empty}>
            <p>No pages yet. Create your first page!</p>
            <Link href="/admin/pages/new" className={styles.addButton}>
              + New Page
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className={styles.titleCell}>
                      <Link href={`/admin/pages/${page.id}/edit`}>
                        {page.title}
                      </Link>
                    </td>
                    <td className={styles.slugCell}>{page.slug}</td>
                    <td>
                      <span className={`${styles.status} ${styles[`status-${page.status.toLowerCase()}`]}`}>
                        {page.status}
                      </span>
                    </td>
                    <td>{new Date(page.publishedAt || page.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <Link href={`/admin/pages/${page.id}/edit`} className={styles.editButton}>
                        Edit
                      </Link>
                      <Link href={`/${page.slug}`} className={styles.viewButton} target="_blank">
                        View
                      </Link>
                      <button onClick={() => handleDelete(page.id)} className={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
