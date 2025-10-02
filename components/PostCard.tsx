import Link from 'next/link';
import styles from './PostCard.module.css';

// 1. Define the types for the component's props
type PostCardProps = {
  post: any;
  isFeatured?: boolean; // The '?' makes it an optional prop
};

// 2. Apply the type to the function's props
export default function PostCard({ post, isFeatured = false }: PostCardProps) {
  if (!post) return null;

  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  const author = post._embedded?.author?.[0]?.name || 'SUCCESS Staff';
  const title = post.title?.rendered || post.title || 'Untitled';
  const excerpt = post.excerpt?.rendered || post.content?.rendered?.substring(0, 150) || '';
  const slug = post.slug || '';

  const cardClassName = isFeatured ? `${styles.card} ${styles.featured}` : styles.card;

  return (
    <div className={cardClassName}>
      {featuredImageUrl && (
        <Link href={`/blog/${slug}`}>
          <img src={featuredImageUrl} alt={title} className={styles.image} />
        </Link>
      )}
      <div className={styles.content}>
        <p className={styles.category}>{category}</p>
        <Link href={`/blog/${slug}`} className={styles.titleLink}>
          <h2 className={styles.title}>{title}</h2>
        </Link>
        <p className={styles.author}>By {author}</p>
        {excerpt && (
          <div
            className={styles.excerpt}
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}
        <Link href={`/blog/${slug}`} className={styles.readMore}>
          Read More
        </Link>
      </div>
    </div>
  );
}