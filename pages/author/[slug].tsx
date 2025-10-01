import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import PostCard from '../../components/PostCard';
import styles from './Author.module.css';
import { fetchWordPressData } from '../../lib/wordpress';

type AuthorPageProps = {
  author: any;
  posts: any[];
};

export default function AuthorPage({ author, posts }: AuthorPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout>
        <div className={styles.error}>Author not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.authorHeader}>
        <div className={styles.authorInfo}>
          {author.avatar_urls && (
            <img
              src={author.avatar_urls['96']}
              alt={author.name}
              className={styles.avatar}
            />
          )}
          <div className={styles.authorDetails}>
            <h1 className={styles.authorName}>{author.name}</h1>
            {author.description && (
              <div
                className={styles.authorBio}
                dangerouslySetInnerHTML={{ __html: author.description }}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.postsContainer}>
        <h2 className={styles.postsTitle}>Articles by {author.name}</h2>
        <div className={styles.postsGrid}>
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const authors = await fetchWordPressData('users?per_page=20');

  const paths = authors.map((author: any) => ({
    params: { slug: author.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  try {
    const authors = await fetchWordPressData(`users?slug=${params.slug}`);
    const author = authors[0];

    if (!author) {
      return {
        notFound: true,
      };
    }

    const posts = await fetchWordPressData(
      `posts?author=${author.id}&_embed&per_page=20`
    );

    return {
      props: {
        author,
        posts,
      },
      revalidate: 600,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
