import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from './dashboard.module.css';

interface Magazine {
  id: string;
  title: string;
  slug: string;
  publishedText: string;
  description: string;
  pdfUrl: string;
  coverImageUrl: string;
  fileSize: number;
  currentPage: number;
  totalPages: number;
  completed: boolean;
  lastReadAt: string | null;
}

export default function MagazinesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?redirect=/dashboard/magazines');
    } else if (status === 'authenticated') {
      fetchMagazines();
    }
  }, [status]);

  const fetchMagazines = async () => {
    try {
      const response = await fetch('/api/dashboard/magazines');

      if (response.status === 403) {
        router.push('/subscribe?error=subscription_required');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch magazines');
      }

      const data = await response.json();
      setMagazines(data);
    } catch (error) {
      console.error('Error fetching magazines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMagazine = (magazine: Magazine) => {
    setSelectedMagazine(magazine);
    setCurrentPage(magazine.currentPage || 1);
  };

  const handleCloseMagazine = async () => {
    if (selectedMagazine) {
      // Save reading progress
      await updateProgress(selectedMagazine.id, currentPage);
    }
    setSelectedMagazine(null);
  };

  const updateProgress = async (magazineId: string, page: number) => {
    try {
      await fetch('/api/dashboard/magazines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazineId,
          currentPage: page,
          totalPages: 100, // Default, would be better to get from PDF
          completed: page >= 100,
        }),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Digital Magazines - SUCCESS+ Dashboard</title>
      </Head>

      <div className={styles.dashboardLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <Link href="/dashboard">
              <img src="/success-logo.png" alt="SUCCESS" />
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/dashboard">
              <button><span className={styles.icon}>📊</span> Dashboard</button>
            </Link>
            <Link href="/dashboard/courses">
              <button><span className={styles.icon}>🎓</span> Courses</button>
            </Link>
            <Link href="/dashboard/resources">
              <button><span className={styles.icon}>📚</span> Resources</button>
            </Link>
            <Link href="/dashboard/labs">
              <button><span className={styles.icon}>🔬</span> Success Labs</button>
            </Link>
            <Link href="/dashboard/events">
              <button><span className={styles.icon}>📅</span> Events</button>
            </Link>
            <Link href="/dashboard/videos">
              <button><span className={styles.icon}>🎥</span> Videos</button>
            </Link>
            <Link href="/dashboard/podcasts">
              <button><span className={styles.icon}>🎙️</span> Podcasts</button>
            </Link>
            <Link href="/dashboard/magazines">
              <button className={styles.active}><span className={styles.icon}>📖</span> Magazines</button>
            </Link>
            <Link href="/dashboard/settings">
              <button><span className={styles.icon}>⚙️</span> Settings</button>
            </Link>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {!selectedMagazine ? (
            <>
              <div className={styles.header}>
                <h1>Digital Magazine Library</h1>
                <p className={styles.subtitle}>Access all SUCCESS Magazine issues</p>
              </div>

              <div className={styles.magazinesGrid}>
                {magazines.map((magazine) => (
                  <div key={magazine.id} className={styles.magazineCard}>
                    <div className={styles.magazineCover}>
                      <img
                        src={magazine.coverImageUrl || '/magazine-cover.jpg'}
                        alt={magazine.title}
                      />
                      {magazine.currentPage > 1 && (
                        <div className={styles.progressBadge}>
                          {Math.round((magazine.currentPage / magazine.totalPages) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className={styles.magazineInfo}>
                      <h3>{magazine.title}</h3>
                      <p className={styles.publishDate}>{magazine.publishedText}</p>
                      {magazine.description && <p>{magazine.description}</p>}

                      <div className={styles.magazineMeta}>
                        <span>{formatFileSize(magazine.fileSize)}</span>
                        {magazine.lastReadAt && (
                          <span>Last read: {new Date(magazine.lastReadAt).toLocaleDateString()}</span>
                        )}
                      </div>

                      <button
                        className={styles.readBtn}
                        onClick={() => handleOpenMagazine(magazine)}
                      >
                        {magazine.currentPage > 1 ? 'Continue Reading' : 'Read Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {magazines.length === 0 && !loading && (
                <div className={styles.emptyState}>
                  <p>No magazines available yet.</p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.magazineReader}>
              <div className={styles.readerHeader}>
                <button className={styles.closeBtn} onClick={handleCloseMagazine}>
                  ← Back to Library
                </button>
                <h2>{selectedMagazine.title}</h2>
                <div className={styles.pageIndicator}>
                  Page {currentPage} of {selectedMagazine.totalPages}
                </div>
              </div>

              <div className={styles.pdfViewer}>
                <iframe
                  src={`${selectedMagazine.pdfUrl}#page=${currentPage}`}
                  width="100%"
                  height="800px"
                  title={selectedMagazine.title}
                />
              </div>

              <div className={styles.readerControls}>
                <button
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                    updateProgress(selectedMagazine.id, newPage);
                  }}
                  disabled={currentPage <= 1}
                >
                  Previous Page
                </button>

                <input
                  type="number"
                  min="1"
                  max={selectedMagazine.totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value) || 1;
                    setCurrentPage(page);
                    updateProgress(selectedMagazine.id, page);
                  }}
                  className={styles.pageInput}
                />

                <button
                  onClick={() => {
                    const newPage = Math.min(selectedMagazine.totalPages, currentPage + 1);
                    setCurrentPage(newPage);
                    updateProgress(selectedMagazine.id, newPage);
                  }}
                  disabled={currentPage >= selectedMagazine.totalPages}
                >
                  Next Page
                </button>

                <a
                  href={selectedMagazine.pdfUrl}
                  download
                  className={styles.downloadBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
