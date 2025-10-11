import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import styles from './AdminPosts.module.css';

interface Post {
  id: string | number;
  title: { rendered: string };
  slug: string;
  status: string;
  date: string;
  _embedded?: {
    author?: Array<{ name: string }>;
    'wp:author'?: Array<{ name: string }>;
  };
}

export default function AdminPosts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchPosts() {
      console.log('Fetching posts...');
      try {
        setError(null);
        // Fetch directly from WordPress API
        const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
        console.log('API URL:', wpApiUrl);

        const res = await fetch(`${wpApiUrl}/posts?_embed&per_page=50`);
        console.log('Response status:', res.status);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Data received:', data.length, 'posts');

        // Validate that data is an array
        if (Array.isArray(data)) {
          setPosts(data);
          console.log('Posts set successfully');
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    }

    // Fetch posts regardless of session for now
    fetchPosts();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      // Note: Deleting from WordPress requires authentication
      // For now, we'll just show an alert
      alert('Post deletion requires WordPress admin authentication. Please delete from WordPress admin panel.');
      // Uncomment below when WordPress authentication is set up:
      // const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
      // await fetch(`${wpApiUrl}/posts/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${YOUR_WP_TOKEN}`
      //   }
      // });
      // setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading posts...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Error Loading Posts</h2>
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
          <h1>Posts</h1>
          <Link href="/admin/posts/new" className={styles.addButton}>
            + New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No posts found. This might be because:</p>
            <ul>
              <li>The WordPress API returned no posts</li>
              <li>There's a connection issue</li>
            </ul>
            <Link href="/admin/posts/new" className={styles.addButton}>
              + New Post
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
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className={styles.titleCell}>
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        {post.title.rendered}
                      </Link>
                    </td>
                    <td>{post._embedded?.author?.[0]?.name || post._embedded?.['wp:author']?.[0]?.name || 'Unknown'}</td>
                    <td>
                      <span className={`${styles.status} ${styles[`status-${post.status}`]}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>{new Date(post.date).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <Link href={`/admin/posts/${post.id}/edit`} className={styles.editButton}>
                        Edit
                      </Link>
                      <Link href={`/blog/${post.slug}`} className={styles.viewButton} target="_blank">
                        View
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className={styles.deleteButton}>
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
