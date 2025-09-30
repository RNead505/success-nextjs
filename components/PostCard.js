import styles from './PostCard.module.css';

export default function PostCard({ post }) {
  // Basic check for featured image, you can expand on this
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  return (
    <div className={styles.card}>
      {featuredImageUrl && (
        <img src={featuredImageUrl} alt={post.title.rendered} className={styles.image} />
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{post.title.rendered}</h2>
        <div 
          className={styles.excerpt} 
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
        />
        <a href={`/blog/${post.slug}`} className={styles.readMore}>
          Read More
        </a>
      </div>
    </div>
  );
}