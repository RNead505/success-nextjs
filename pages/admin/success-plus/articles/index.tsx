import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';
import styles from '../../posts/PostsList.module.css';

export default function ExclusiveArticles() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  async function fetchArticles() {
    try {
      setLoading(true);
      // Fetch posts tagged with "success-plus" or "insider" or "exclusive"
      const res = await fetch(`/api/posts?tag=success-plus,insider,exclusive&status=${filter === 'all' ? '' : filter}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching exclusive articles:', error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.postsContainer}>
        <div className={styles.header}>
          <div>
            <h1>SUCCESS+ Exclusive Articles</h1>
            <p className={styles.subtitle}>
              Manage premium articles available only to SUCCESS+ Insider members
            </p>
          </div>
          <Link href="/admin/success-plus/articles/new" className={styles.newButton}>
            ✨ New Exclusive Article
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <button
              className={filter === 'all' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('all')}
            >
              All Articles
            </button>
            <button
              className={filter === 'PUBLISHED' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('PUBLISHED')}
            >
              Published
            </button>
            <button
              className={filter === 'DRAFT' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('DRAFT')}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{articles.length}</div>
            <div className={styles.statLabel}>Total Exclusive Articles</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {articles.filter(a => a.status === 'PUBLISHED').length}
            </div>
            <div className={styles.statLabel}>Published</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {articles.filter(a => a.status === 'DRAFT').length}
            </div>
            <div className={styles.statLabel}>Drafts</div>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className={styles.loading}>Loading exclusive articles...</div>
        ) : articles.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📰</span>
            <h3>No exclusive articles yet</h3>
            <p>Create your first SUCCESS+ exclusive article to get started.</p>
            <Link href="/admin/success-plus/articles/new" className={styles.newButton}>
              Create Exclusive Article
            </Link>
          </div>
        ) : (
          <div className={styles.postsList}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article: any) => (
                  <tr key={article.id}>
                    <td>
                      <div className={styles.postTitle}>
                        <Link href={`/admin/posts/${article.id}/edit`}>
                          {article.title}
                        </Link>
                        <div className={styles.postMeta}>
                          <span className={styles.badge} style={{ background: '#c41e3a', color: 'white' }}>
                            SUCCESS+ Exclusive
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{article.author?.name || 'Unknown'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[article.status.toLowerCase()]}`}>
                        {article.status}
                      </span>
                    </td>
                    <td>{article.views || 0}</td>
                    <td>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/posts/${article.id}/edit`} className={styles.actionButton}>
                          Edit
                        </Link>
                        <Link href={`/blog/${article.slug}`} className={styles.actionButton} target="_blank">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Help Section */}
        <div className={styles.helpSection} style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>💡 How to Create Exclusive Content</h3>
          <ol style={{ marginBottom: 0 }}>
            <li>Click "New Exclusive Article" to create a new post</li>
            <li>Add tag: <code>success-plus</code>, <code>insider</code>, or <code>exclusive</code></li>
            <li>Content will automatically be gated for non-members</li>
            <li>Only SUCCESS+ Insider members will see full content</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
