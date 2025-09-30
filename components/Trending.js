import Link from 'next/link';
import styles from './Trending.module.css';

export default function Trending({ posts }) {
  return (
    <div>
      <h3 className={styles.header}>TRENDING</h3>
      <ol className={styles.list}>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <span className={styles.category}>
                {/* You would need category data for this */}
                Personal Development
              </span>
              <span className={styles.title}>{post.title.rendered}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}