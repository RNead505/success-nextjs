import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './ContentViewer.module.css';
import { decodeHtmlEntities } from '../../lib/htmlDecode';

interface ContentItem {
  id: number;
  title: { rendered: string };
  link: string;
  date: string;
  status: string;
  type: string;
  _embedded?: any;
}

export default function ContentViewer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'posts' | 'pages' | 'videos' | 'podcasts'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchContent();
  }, [filter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
      const endpoints = filter === 'all'
        ? ['posts', 'pages', 'videos', 'podcasts']
        : [filter];

      const promises = endpoints.map(endpoint =>
        fetch(`${wpApiUrl}/${endpoint}?_embed&per_page=20`)
          .then(res => res.json())
          .then(data => data.map((item: any) => ({ ...item, type: endpoint })))
      );

      const results = await Promise.all(promises);
      const allContent = results.flat().sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setContent(allContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Live Site Content</h1>
          <div className={styles.filters}>
            <button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? styles.filterActive : styles.filter}
            >
              All Content
            </button>
            <button
              onClick={() => setFilter('posts')}
              className={filter === 'posts' ? styles.filterActive : styles.filter}
            >
              Posts
            </button>
            <button
              onClick={() => setFilter('pages')}
              className={filter === 'pages' ? styles.filterActive : styles.filter}
            >
              Pages
            </button>
            <button
              onClick={() => setFilter('videos')}
              className={filter === 'videos' ? styles.filterActive : styles.filter}
            >
              Videos
            </button>
            <button
              onClick={() => setFilter('podcasts')}
              className={filter === 'podcasts' ? styles.filterActive : styles.filter}
            >
              Podcasts
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading content...</div>
        ) : (
          <div className={styles.grid}>
            {content.map((item) => {
              const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;

              return (
                <div key={`${item.type}-${item.id}`} className={styles.card}>
                  {imageUrl && (
                    <div className={styles.cardImage}>
                      <img src={imageUrl} alt={item.title.rendered} />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <span className={`${styles.badge} ${styles[`badge-${item.type}`]}`}>
                      {item.type}
                    </span>
                    <h3 className={styles.cardTitle}>
                      {decodeHtmlEntities(item.title.rendered)}
                    </h3>
                    <p className={styles.cardDate}>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className={styles.cardActions}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewButton}
                      >
                        View Live
                      </a>
                      <span className={`${styles.status} ${styles[`status-${item.status}`]}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
