import Link from 'next/link';
import styles from './PostCard.module.css';

// 1. Define the types for the component's props
type PostCardProps = {
  post: any;
  isFeatured?: boolean; // The '?' makes it an optional prop
};

// 2. Apply the type to the function's props
export default function PostCard({ post, isFeatured = false }: PostCardProps) {
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  const author = post._embedded?.author?.[0]?.name || 'SUCCESS Staff';

  const cardClassName = isFeatured ? `${styles.card} ${styles.featured}` : styles.card;

  return (
    <div className={cardClassName}>
      {featuredImageUrl && (
        <Link href={`/blog/${post.slug}`}>
          <img src={featuredImageUrl} alt={post.title.rendered} className={styles.image} />
        </Link>
      )}
      <div className={styles.content}>
        <p className={styles.category}>{category}</p>
        <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
          <h2 className={styles.title}>{post.title.rendered}</h2>
        </Link>
        <p className={styles.author}>By {author}</p>
        <div 
          className={styles.excerpt} 
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
        />
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          Read More
        </Link>
      </div>
    </div>
  );
}