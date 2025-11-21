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
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function AdminPages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchPages();
  }, [filter]);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const statusParam = filter === 'all' ? '' : `&status=${filter}`;
      const endpoint = `/api/pages?per_page=100${statusParam}`;

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', res.status, errorText);
        throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setPages(data);
        setError(null);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error: Unable to connect to the API. Check your internet connection.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to fetch pages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Page deleted successfully!');
        fetchPages();
      } else {
        throw new Error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading pages...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Error Loading Pages</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Pages</h1>
            <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Manage all pages for your Next.js site. Published pages appear on the live site.
            </p>
          </div>
          <Link href="/admin/pages/new" className={styles.addButton}>
            + Create New Page
          </Link>
        </div>

        <div className={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? styles.filterActive : styles.filter}
          >
            All ({pages.length})
          </button>
          <button
            onClick={() => setFilter('PUBLISHED')}
            className={filter === 'PUBLISHED' ? styles.filterActive : styles.filter}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('DRAFT')}
            className={filter === 'DRAFT' ? styles.filterActive : styles.filter}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter('ARCHIVED')}
            className={filter === 'ARCHIVED' ? styles.filterActive : styles.filter}
          >
            Archived
          </button>
        </div>

        {pages.length === 0 ? (
          <div className={styles.empty}>
            <p>No pages found with the selected filter.</p>
            <Link href="/admin/pages/new" className={styles.addButton}>
              + Create New Page
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className={styles.titleCell}>
                      <div className={styles.titleContent}>
                        <Link href={`/admin/pages/${page.id}/edit`}>
                          <span>{page.title}</span>
                        </Link>
                        <span className={styles.slug}>/{page.slug}</span>
                      </div>
                    </td>
                    <td>{session?.user?.name || 'Admin'}</td>
                    <td>
                      <span className={`${styles.status} ${styles[`status-${page.status.toLowerCase()}`]}`}>
                        {page.status.toLowerCase()}
                      </span>
                    </td>
                    <td>
                      <div className={styles.dateInfo}>
                        <div>{new Date(page.updatedAt).toLocaleDateString()}</div>
                        <small>{new Date(page.updatedAt).toLocaleTimeString()}</small>
                      </div>
                    </td>
                    <td className={styles.actions}>
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className={styles.editButton}
                      >
                        Edit
                      </Link>
                      {page.status === 'PUBLISHED' && (
                        <a
                          href={`/${page.slug}`}
                          className={styles.viewButton}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Live
                        </a>
                      )}
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

// Force SSR to prevent NextRouter errors during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}
