import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import styles from './AdminPages.module.css';

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
    }
  }, [status, router]);

  useEffect(() => {
    fetchPages();
  }, [filter]);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
      const statusParam = filter === 'all' ? '' : `&status=${filter}`;
      const res = await fetch(`${wpApiUrl}/pages?_embed&per_page=100${statusParam}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setPages(data);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch pages');
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
          <h1>Pages</h1>
          <Link href="/admin/pages/new" className={styles.addButton}>
            + New Page
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
            <p>No pages found.</p>
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
                          <span dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
                        </Link>
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
                      <Link href={`/admin/pages/${page.id}/edit`} className={styles.editButton}>
                        Edit
                      </Link>
                      <a
                        href={page.link}
                        className={styles.viewButton}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
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
