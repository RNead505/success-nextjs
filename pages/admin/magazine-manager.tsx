import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import { exportMagazineCoverToPDF, exportMagazinePrintPDF } from '../../lib/pdfExport';
import { decodeHtmlEntities } from '../../lib/htmlDecode';
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
  const [view, setView] = useState<'grid' | 'preview' | 'edit' | 'add'>('grid');
  const [editData, setEditData] = useState<any>(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [newIssueData, setNewIssueData] = useState({
    title: '',
    publishedText: '',
    description: '',
    coverImage: null as File | null
  });

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

      // Create demo issue
      const demoIssue = {
        id: 99999,
        title: { rendered: 'SUCCESS Magazine - DEMO ISSUE' },
        slug: 'demo-issue-2025',
        date: new Date().toISOString(),
        meta_data: {
          'magazine-published-text': ['DEMO - October 2025'],
          'magazine-banner-heading': ['Welcome to SUCCESS Magazine Manager!'],
          'magazine-banner-description': ['This is a demo issue to showcase the Magazine Manager features. In production, this page will display real magazine issues from WordPress. You can preview covers, download PDFs, and manage all your magazine content from this dashboard.'],
          'image-for-listing-page': ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=900&fit=crop&q=80']
        },
        _embedded: {
          'wp:featuredmedia': [{
            source_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=900&fit=crop&q=80',
            alt_text: 'DEMO Magazine Cover'
          }]
        }
      };

      // Always add demo issue at the end
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ Loaded', data.length, 'real magazines + 1 demo issue');
        setMagazines([...data, demoIssue]);
        setSelectedMagazine(data[0]); // Select first (current) real issue
      } else {
        // If no real magazines, show only demo
        console.log('✅ No real magazines found, showing demo issue only');
        setMagazines([demoIssue]);
        setSelectedMagazine(demoIssue);
      }
    } catch (error) {
      console.error('Error fetching magazines:', error);

      // Show demo issue on error
      const demoIssue = {
        id: 99999,
        title: { rendered: 'SUCCESS Magazine - DEMO ISSUE' },
        slug: 'demo-issue-2025',
        date: new Date().toISOString(),
        meta_data: {
          'magazine-published-text': ['DEMO - October 2025'],
          'magazine-banner-heading': ['Welcome to SUCCESS Magazine Manager!'],
          'magazine-banner-description': ['This is a demo issue to showcase the Magazine Manager features. In production, this page will display real magazine issues from WordPress. You can preview covers, download PDFs, and manage all your magazine content from this dashboard.'],
          'image-for-listing-page': ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=900&fit=crop&q=80']
        },
        _embedded: {
          'wp:featuredmedia': [{
            source_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=900&fit=crop&q=80',
            alt_text: 'DEMO Magazine Cover'
          }]
        }
      };
      setMagazines([demoIssue]);
      setSelectedMagazine(demoIssue);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (magazine: Magazine, printReady: boolean = false) => {
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
        issueInfo,
        printReady
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  const handlePrintVersion = async (magazine: Magazine) => {
    const coverUrl = magazine.meta_data?.['image-for-listing-page']?.[0] ||
                     magazine._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    if (!coverUrl) {
      alert('No cover image available');
      return;
    }

    const issueDate = magazine.meta_data?.['magazine-published-text']?.[0] ||
                      new Date(magazine.date).toLocaleDateString();

    try {
      await exportMagazinePrintPDF(
        coverUrl,
        magazine.title.rendered,
        issueDate,
        [] // Articles would come from WordPress if available
      );
    } catch (error) {
      console.error('Error exporting print PDF:', error);
      alert('Failed to export print PDF');
    }
  };

  const getMagazineStatus = (index: number) => {
    if (index === 0) return 'Current Issue';
    if (index === 1) return 'Previous Issue';
    return 'Past Issue';
  };

  const handleAddIssue = async () => {
    if (!newIssueData.title || !newIssueData.publishedText || !pdfFile) {
      alert('Please fill in all required fields and upload a PDF');
      return;
    }

    setUploadingPDF(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('title', newIssueData.title);
      formData.append('publishedText', newIssueData.publishedText);
      formData.append('description', newIssueData.description);

      if (newIssueData.coverImage) {
        formData.append('coverImage', newIssueData.coverImage);
      }

      const response = await fetch('/api/magazines/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      alert('Magazine issue uploaded successfully!');

      // Reset form
      setNewIssueData({
        title: '',
        publishedText: '',
        description: '',
        coverImage: null
      });
      setPdfFile(null);
      setView('grid');
      fetchMagazines();
    } catch (error) {
      console.error('Error uploading magazine:', error);
      alert('Failed to upload magazine issue');
    } finally {
      setUploadingPDF(false);
    }
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
            <button
              onClick={() => {
                if (selectedMagazine) {
                  setEditData({
                    title: selectedMagazine.title.rendered,
                    publishedText: selectedMagazine.meta_data?.['magazine-published-text']?.[0] || '',
                    heading: selectedMagazine.meta_data?.['magazine-banner-heading']?.[0] || '',
                    description: selectedMagazine.meta_data?.['magazine-banner-description']?.[0] || '',
                    flipVersion: selectedMagazine.meta_data?.['flip_version']?.[0] || '',
                  });
                  setView('edit');
                }
              }}
              className={view === 'edit' ? styles.viewButtonActive : styles.viewButton}
              disabled={!selectedMagazine}
            >
              ✏️ Edit Current
            </button>
            <button
              onClick={() => setView('add')}
              className={view === 'add' ? styles.viewButtonActive : styles.viewButton}
            >
              ➕ Add Issue
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
                  {magazine.id === 99999 && (
                    <div className={styles.demoBadge}>DEMO</div>
                  )}

                  {coverUrl && (
                    <div className={styles.coverImage}>
                      <img src={coverUrl} alt={magazine.title.rendered} />
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {decodeHtmlEntities(magazine.title.rendered)}
                    </h3>
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
                        onClick={() => handleDownloadPDF(magazine, false)}
                        className={styles.downloadButton}
                        title="Download digital PDF"
                      >
                        📄 Digital PDF
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(magazine, true)}
                        className={styles.printButton}
                        title="Download print-ready PDF with bleed and crop marks"
                      >
                        🖨️ Print-Ready
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
        ) : view === 'preview' && selectedMagazine ? (
            <div className={styles.previewContainer}>
              <div className={styles.previewHeader}>
                <button onClick={() => setView('grid')} className={styles.backButton}>
                  ← Back to All Issues
                </button>
                <div className={styles.previewTitleRow}>
                  <h2>{decodeHtmlEntities(selectedMagazine.title.rendered)}</h2>
                  {selectedMagazine.id === 99999 && (
                    <span className={styles.demoBadgeInline}>DEMO</span>
                  )}
                </div>
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
                      onClick={() => handleDownloadPDF(selectedMagazine, false)}
                      className={styles.downloadButtonLarge}
                    >
                      📄 Digital PDF
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(selectedMagazine, true)}
                      className={styles.printButtonLarge}
                    >
                      🖨️ Print-Ready PDF
                    </button>
                    <button
                      onClick={() => handlePrintVersion(selectedMagazine)}
                      className={styles.fullPrintButtonLarge}
                    >
                      📚 Full Print Package
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
        ) : view === 'edit' && selectedMagazine && editData ? (
          <div className={styles.editContainer}>
            <div className={styles.editHeader}>
              <button onClick={() => setView('grid')} className={styles.backButton}>
                ← Back to All Issues
              </button>
              <h2>Edit Magazine Issue</h2>
            </div>

            <div className={styles.editForm}>
              <div className={styles.editSection}>
                <h3>📖 Basic Information</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="publishedText">Published Text (e.g., "NOVEMBER / DECEMBER 2025")</label>
                  <input
                    id="publishedText"
                    type="text"
                    value={editData.publishedText}
                    onChange={(e) => setEditData({...editData, publishedText: e.target.value})}
                    className={styles.input}
                    placeholder="NOVEMBER / DECEMBER 2025"
                  />
                </div>
              </div>

              <div className={styles.editSection}>
                <h3>🎯 Banner Content</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="heading">Banner Heading (Featured Person/Topic)</label>
                  <input
                    id="heading"
                    type="text"
                    value={editData.heading}
                    onChange={(e) => setEditData({...editData, heading: e.target.value})}
                    className={styles.input}
                    placeholder="Russell Brunson"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Banner Description</label>
                  <textarea
                    id="description"
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    className={styles.textarea}
                    rows={4}
                    placeholder="MARKETING TRAILBLAZER AND BOOK COLLECTOR REVEALS HIS NEXT MOVE..."
                  />
                </div>
              </div>

              <div className={styles.editSection}>
                <h3>🌐 Online Version</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="flipVersion">Online Edition URL (Flip Version)</label>
                  <input
                    id="flipVersion"
                    type="url"
                    value={editData.flipVersion}
                    onChange={(e) => setEditData({...editData, flipVersion: e.target.value})}
                    className={styles.input}
                    placeholder="https://read.mysuccessplus.com/..."
                  />
                  {editData.flipVersion && (
                    <a
                      href={editData.flipVersion}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.previewLink}
                    >
                      🔗 View Current Online Edition
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.editSection}>
                <h3>📊 Current Issue Data</h3>
                <div className={styles.infoBox}>
                  <p><strong>Magazine ID:</strong> {selectedMagazine.id}</p>
                  <p><strong>Slug:</strong> {selectedMagazine.slug}</p>
                  <p><strong>WordPress Link:</strong> <a href={`https://www.success.com/magazines/${selectedMagazine.slug}/`} target="_blank" rel="noopener noreferrer">View on WordPress</a></p>
                  <p><strong>Published Date:</strong> {new Date(selectedMagazine.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className={styles.editActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setView('preview')}
                >
                  Cancel
                </button>
                <button
                  className={styles.saveButton}
                  onClick={() => {
                    alert('Note: This is a preview-only interface. To actually update the magazine, you need to edit it in WordPress admin at www.success.com/wp-admin/');
                    console.log('Edit data:', editData);
                  }}
                >
                  💾 Save Changes (Preview Only)
                </button>
              </div>

              <div className={styles.notice}>
                <strong>ℹ️ Note:</strong> This editor allows you to preview changes. To publish updates, please edit the magazine in <a href="https://www.success.com/wp-admin/" target="_blank" rel="noopener noreferrer">WordPress Admin</a>.
              </div>
            </div>
          </div>
        ) : view === 'add' ? (
          <div className={styles.editContainer}>
            <div className={styles.editHeader}>
              <button onClick={() => setView('grid')} className={styles.backButton}>
                ← Back to All Issues
              </button>
              <h2>Add New Magazine Issue</h2>
            </div>

            <div className={styles.editForm}>
              <div className={styles.editSection}>
                <h3>📖 Basic Information</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="newTitle">Title *</label>
                  <input
                    id="newTitle"
                    type="text"
                    value={newIssueData.title}
                    onChange={(e) => setNewIssueData({...newIssueData, title: e.target.value})}
                    className={styles.input}
                    placeholder="SUCCESS Magazine - January 2025"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPublishedText">Published Text * (e.g., "JANUARY 2025")</label>
                  <input
                    id="newPublishedText"
                    type="text"
                    value={newIssueData.publishedText}
                    onChange={(e) => setNewIssueData({...newIssueData, publishedText: e.target.value})}
                    className={styles.input}
                    placeholder="JANUARY 2025"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newDescription">Description</label>
                  <textarea
                    id="newDescription"
                    value={newIssueData.description}
                    onChange={(e) => setNewIssueData({...newIssueData, description: e.target.value})}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Brief description of this magazine issue..."
                  />
                </div>
              </div>

              <div className={styles.editSection}>
                <h3>📄 PDF Upload *</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="pdfUpload">Magazine PDF</label>
                  <input
                    id="pdfUpload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type !== 'application/pdf') {
                          alert('Please upload a PDF file');
                          e.target.value = '';
                          return;
                        }
                        if (file.size > 50 * 1024 * 1024) {
                          alert('PDF file size must be less than 50MB');
                          e.target.value = '';
                          return;
                        }
                        setPdfFile(file);
                      }
                    }}
                    className={styles.fileInput}
                    required
                  />
                  {pdfFile && (
                    <div className={styles.fileInfo}>
                      ✓ Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.editSection}>
                <h3>🖼️ Cover Image (Optional)</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="coverUpload">Cover Image (JPG, PNG)</label>
                  <input
                    id="coverUpload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.type.startsWith('image/')) {
                          alert('Please upload an image file');
                          e.target.value = '';
                          return;
                        }
                        if (file.size > 10 * 1024 * 1024) {
                          alert('Image file size must be less than 10MB');
                          e.target.value = '';
                          return;
                        }
                        setNewIssueData({...newIssueData, coverImage: file});
                      }
                    }}
                    className={styles.fileInput}
                  />
                  {newIssueData.coverImage && (
                    <div className={styles.fileInfo}>
                      ✓ Selected: {newIssueData.coverImage.name}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.editActions}>
                <button
                  onClick={handleAddIssue}
                  className={styles.saveButton}
                  disabled={uploadingPDF || !newIssueData.title || !newIssueData.publishedText || !pdfFile}
                >
                  {uploadingPDF ? 'Uploading...' : '📤 Upload Magazine Issue'}
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={styles.cancelButton}
                  disabled={uploadingPDF}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
