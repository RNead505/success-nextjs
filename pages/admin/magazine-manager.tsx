import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import { exportMagazineCoverToPDF } from '../../lib/pdfExport';
import styles from './MagazineManager.module.css';

interface Magazine {
  id: number;
  title: { rendered: string };
  slug: string;
  date: string;
  meta_data?: any;
  _embedded?: any;
}

export default function MagazineManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'preview'>('grid');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    setLoading(true);
    try {
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
      const res = await fetch(`${wpApiUrl}/magazines?per_page=50&_embed`);
      const data = await res.json();
      setMagazines(data);
      if (data.length > 0) {
        setSelectedMagazine(data[0]); // Select first (current) issue
      }
    } catch (error) {
      console.error('Error fetching magazines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (magazine: Magazine) => {
    const coverUrl = magazine.meta_data?.['image-for-listing-page']?.[0] ||
                     magazine._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    if (!coverUrl) {
      alert('No cover image available');
      return;
    }

    const issueInfo = magazine.meta_data?.['magazine-published-text']?.[0] ||
                      new Date(magazine.date).toLocaleDateString();

    try {
      await exportMagazineCoverToPDF(
        coverUrl,
        magazine.title.rendered,
        issueInfo
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  const getMagazineStatus = (index: number) => {
    if (index === 0) return 'Current Issue';
    if (index === 1) return 'Previous Issue';
    return 'Past Issue';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading magazines...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Magazine Manager</h1>
          <div className={styles.viewToggle}>
            <button
              onClick={() => setView('grid')}
              className={view === 'grid' ? styles.viewButtonActive : styles.viewButton}
            >
              📚 All Issues
            </button>
            <button
              onClick={() => setView('preview')}
              className={view === 'preview' ? styles.viewButtonActive : styles.viewButton}
            >
              👁 Preview Current
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className={styles.grid}>
            {magazines.map((magazine, index) => {
              const coverUrl = magazine.meta_data?.['image-for-listing-page']?.[0] ||
                              magazine._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const publishDate = magazine.meta_data?.['magazine-published-text']?.[0] || '';

              return (
                <div key={magazine.id} className={styles.card}>
                  <div className={styles.cardBadge}>
                    {getMagazineStatus(index)}
                  </div>

                  {coverUrl && (
                    <div className={styles.coverImage}>
                      <img src={coverUrl} alt={magazine.title.rendered} />
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    <h3
                      className={styles.cardTitle}
                      dangerouslySetInnerHTML={{ __html: magazine.title.rendered }}
                    />
                    {publishDate && (
                      <p className={styles.publishDate}>{publishDate}</p>
                    )}

                    <div className={styles.cardActions}>
                      <button
                        onClick={() => {
                          setSelectedMagazine(magazine);
                          setView('preview');
                        }}
                        className={styles.previewButton}
                      >
                        👁 Preview
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(magazine)}
                        className={styles.downloadButton}
                      >
                        📄 Download PDF
                      </button>
                      {magazine.meta_data?.['flip_version']?.[0] && (
                        <a
                          href={magazine.meta_data['flip_version'][0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.flipButton}
                        >
                          📖 Online Edition
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          selectedMagazine && (
            <div className={styles.previewContainer}>
              <div className={styles.previewHeader}>
                <button onClick={() => setView('grid')} className={styles.backButton}>
                  ← Back to All Issues
                </button>
                <h2 dangerouslySetInnerHTML={{ __html: selectedMagazine.title.rendered }} />
              </div>

              <div className={styles.previewContent}>
                <div className={styles.previewCover}>
                  <img
                    src={
                      selectedMagazine.meta_data?.['image-for-listing-page']?.[0] ||
                      selectedMagazine._embedded?.['wp:featuredmedia']?.[0]?.source_url
                    }
                    alt={selectedMagazine.title.rendered}
                  />
                </div>

                <div className={styles.previewDetails}>
                  <div className={styles.detailSection}>
                    <h3>Issue Information</h3>
                    <p>
                      <strong>Published:</strong>{' '}
                      {selectedMagazine.meta_data?.['magazine-published-text']?.[0] || 'N/A'}
                    </p>
                    <p>
                      <strong>Featured:</strong>{' '}
                      {selectedMagazine.meta_data?.['magazine-banner-heading']?.[0] || 'N/A'}
                    </p>
                  </div>

                  {selectedMagazine.meta_data?.['magazine-banner-description']?.[0] && (
                    <div className={styles.detailSection}>
                      <h3>Description</h3>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedMagazine.meta_data['magazine-banner-description'][0]
                        }}
                      />
                    </div>
                  )}

                  <div className={styles.previewActions}>
                    <button
                      onClick={() => handleDownloadPDF(selectedMagazine)}
                      className={styles.downloadButtonLarge}
                    >
                      📄 Download Cover as PDF
                    </button>
                    {selectedMagazine.meta_data?.['flip_version']?.[0] && (
                      <a
                        href={selectedMagazine.meta_data['flip_version'][0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.flipButtonLarge}
                      >
                        📖 Read Online Edition
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
}
