import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import styles from './AdminPages.module.css';
import { decodeHtmlEntities } from '../../../lib/htmlDecode';

interface Page {
  id: string | number;
  title: { rendered: string };
  slug: string;
  status: string;
  date: string;
  modified: string;
  link: string;
  _embedded?: {
    author?: Array<{ name: string }>;
  };
}

export default function AdminPages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'publish' | 'draft' | 'private'>('all');

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
      // Use our API proxy to avoid CORS issues
      const endpoint = '/api/wordpress/pages?per_page=100';

      // Only show published pages for now
      if (filter !== 'publish' && filter !== 'all') {
        setPages([]);
        setError('Draft and private pages require WordPress admin authentication. Only published pages are shown.');
        setLoading(false);
        return;
      }

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('WordPress API Error:', res.status, errorText);
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
        setError('Network error: Unable to connect to WordPress API. Check your internet connection.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to fetch pages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    alert('Page deletion requires WordPress admin authentication. Please delete from WordPress admin panel.');
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
              Viewing pages from WordPress CMS. Only published pages appear on the live site.
            </p>
          </div>
          <a
            href="https://www.success.com/wp-admin/edit.php?post_type=page"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.addButton}
          >
            + Manage in WordPress
          </a>
        </div>

        <div className={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? styles.filterActive : styles.filter}
          >
            All ({pages.length})
          </button>
          <button
            onClick={() => setFilter('publish')}
            className={filter === 'publish' ? styles.filterActive : styles.filter}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={filter === 'draft' ? styles.filterActive : styles.filter}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter('private')}
            className={filter === 'private' ? styles.filterActive : styles.filter}
          >
            Private
          </button>
        </div>

        {pages.length === 0 ? (
          <div className={styles.empty}>
            <p>No pages found with the selected filter.</p>
            <a
              href="https://www.success.com/wp-admin/edit.php?post_type=page"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addButton}
            >
              + Create in WordPress
            </a>
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
                        <a
                          href={`https://www.success.com/wp-admin/post.php?post=${page.id}&action=edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{decodeHtmlEntities(page.title.rendered)}</span>
                        </a>
                        <span className={styles.slug}>/{page.slug}</span>
                      </div>
                    </td>
                    <td>{page._embedded?.author?.[0]?.name || 'Unknown'}</td>
                    <td>
                      <span className={`${styles.status} ${styles[`status-${page.status}`]}`}>
                        {page.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.dateInfo}>
                        <div>{new Date(page.modified).toLocaleDateString()}</div>
                        <small>{new Date(page.modified).toLocaleTimeString()}</small>
                      </div>
                    </td>
                    <td className={styles.actions}>
                      <a
                        href={`https://www.success.com/wp-admin/post.php?post=${page.id}&action=edit`}
                        className={styles.editButton}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Edit in WP
                      </a>
                      {page.status === 'publish' && (
                        <a
                          href={page.link}
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
