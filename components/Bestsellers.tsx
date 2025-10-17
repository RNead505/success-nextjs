import styles from './Bestsellers.module.css';
import { decodeHtmlEntities } from '../lib/htmlDecode';

type BestsellerBook = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

type BestsellersProps = {
  books: BestsellerBook[];
};

export default function Bestsellers({ books }: BestsellersProps) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <section className={styles.bestsellersSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>SUCCESS® Bestsellers</h2>
          <a href="/bestsellers" className={styles.viewAllLink}>View All →</a>
        </div>
        <div className={styles.booksGrid}>
          {books.map((book) => {
            const imageUrl = book._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
            const imageAlt = book._embedded?.['wp:featuredmedia']?.[0]?.alt_text || book.title.rendered;
            const bookTitle = decodeHtmlEntities(book.title.rendered);

            return (
              <div key={book.id} className={styles.bookCard}>
                <a href={book.link} target="_blank" rel="noopener noreferrer" className={styles.bookLink}>
                  {imageUrl && (
                    <div className={styles.bookCover}>
                      <img src={imageUrl} alt={imageAlt} loading="lazy" />
                    </div>
                  )}
                  <h3 className={styles.bookTitle}>
                    {bookTitle}
                  </h3>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
