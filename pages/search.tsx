import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import styles from './Search.module.css';
import { fetchWordPressData } from '../lib/wordpress';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const posts = await fetchWordPressData(
        `posts?search=${encodeURIComponent(query)}&_embed&per_page=20`
      );
      setResults(posts);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      <div className={styles.searchPage}>
        <div className={styles.searchHeader}>
          <h1 className={styles.title}>Search</h1>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className={styles.searchInput}
              autoFocus
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className={styles.loading}>Searching...</div>
        ) : results.length > 0 ? (
          <div className={styles.resultsContainer}>
            <h2 className={styles.resultsTitle}>
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{q}"
            </h2>
            <div className={styles.resultsGrid}>
              {results.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : q ? (
          <div className={styles.noResults}>
            <p>No results found for "{q}"</p>
            <p className={styles.suggestion}>Try different keywords or check your spelling.</p>
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>Enter a search term to find articles</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
