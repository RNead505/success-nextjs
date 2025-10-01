import Link from 'next/link';
import styles from './Trending.module.css';

export default function Trending({ posts }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.header}>TRENDING</h3>
      <ol className={styles.list}>
        {posts.map((post, index) => {
          const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';

          return (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className={styles.link}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.content}>
                  <span className={styles.category}>{category}</span>
                  <span className={styles.title}>{post.title.rendered}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
