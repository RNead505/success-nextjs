import { useEffect, useState } from 'react';
import styles from './DashboardStats.module.css';

interface Stats {
  posts: number;
  categories: number;
  users: number;
  videos: number;
  podcasts: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    categories: 0,
    users: 0,
    videos: 0,
    podcasts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch counts from API
        const [postsRes, catsRes, usersRes, videosRes, podcastsRes] = await Promise.all([
          fetch('/api/posts').catch(e => ({ ok: false, headers: new Headers() })),
          fetch('/api/categories').catch(e => ({ ok: false, headers: new Headers() })),
          fetch('/api/users').catch(e => ({ ok: false, headers: new Headers() })),
          fetch('/api/videos').catch(e => ({ ok: false, headers: new Headers() })),
          fetch('/api/podcasts').catch(e => ({ ok: false, headers: new Headers() })),
        ]);

        setStats({
          posts: parseInt(postsRes.headers.get('X-WP-Total') || '0'),
          categories: parseInt(catsRes.headers.get('X-WP-Total') || '0'),
          users: parseInt(usersRes.headers.get('X-WP-Total') || '0'),
          videos: parseInt(videosRes.headers.get('X-WP-Total') || '0'),
          podcasts: parseInt(podcastsRes.headers.get('X-WP-Total') || '0'),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Posts', value: stats.posts, icon: '📝', color: '#667eea' },
    { label: 'Categories', value: stats.categories, icon: '📁', color: '#764ba2' },
    { label: 'Users', value: stats.users, icon: '👥', color: '#f093fb' },
    { label: 'Videos', value: stats.videos, icon: '🎥', color: '#4facfe' },
    { label: 'Podcasts', value: stats.podcasts, icon: '🎙️', color: '#43e97b' },
  ];

  if (loading) {
    return <div className={styles.loading}>Loading stats...</div>;
  }

  return (
    <div className={styles.statsGrid}>
      {statCards.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: stat.color }}>
            {stat.icon}
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
