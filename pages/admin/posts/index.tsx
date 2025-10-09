import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import styles from './AdminPosts.module.css';

interface Post {
  id: string;
  title: { rendered: string };
  slug: string;
  status: string;
  date: string;
  _embedded?: {
    author: Array<{ name: string }>;
  };
}

export default function AdminPosts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts?_embed=true&per_page=50&status=all');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchPosts();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading posts...</div>
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
          <h1>Posts</h1>
          <Link href="/admin/posts/new" className={styles.addButton}>
            + New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No posts yet. Create your first post!</p>
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
                    <td>{post._embedded?.author[0]?.name || 'Unknown'}</td>
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
