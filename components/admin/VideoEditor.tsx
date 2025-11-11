import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styles from './PostEditor.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface VideoEditorProps {
  videoId?: string;
}

export default function VideoEditor({ videoId }: VideoEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoSource, setVideoSource] = useState<'url' | 'upload'>('url');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    if (!videoId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}`);
      const video = await res.json();

      setTitle(video.title);
      setSlug(video.slug);
      setDescription(video.description || '');
      setVideoUrl(video.videoUrl);
      setThumbnail(video.thumbnail || '');
      setDuration(video.duration ? String(video.duration) : '');
      setStatus(video.status);
    } catch (error) {
      console.error('Error fetching video:', error);
      alert('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!videoId && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file is too large. Maximum size is 500MB.');
      return;
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid video format. Supported formats: MP4, MOV, AVI, WebM');
      return;
    }

    setUploadingVideo(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'video');

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setVideoUrl(data.url);

        // Try to get video duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          setDuration(Math.floor(video.duration).toString());
          URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(file);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again or use a video URL instead.');
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for thumbnails)
    if (file.size > 5 * 1024 * 1024) {
      alert('Thumbnail image is too large. Maximum size is 5MB.');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid image format. Supported formats: JPG, PNG, WebP, GIF');
      return;
    }

    setUploadingThumbnail(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setThumbnail(data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSave = async (publishStatus: string) => {
    if (!title || !videoUrl) {
      alert('Title and video are required');
      return;
    }

    setSaving(true);

    const videoData = {
      title,
      slug: slug || generateSlug(title),
      description,
      videoUrl,
      thumbnail,
      duration: duration ? parseInt(duration) : null,
      status: publishStatus,
      publishedAt: publishStatus === 'PUBLISHED' ? new Date().toISOString() : null,
    };

    try {
      const url = videoId ? `/api/videos/${videoId}` : '/api/videos';
      const method = videoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });

      if (res.ok) {
        alert(videoId ? 'Video updated!' : 'Video created!');
        router.push('/admin/videos');
      } else {
        throw new Error('Failed to save video');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading video...</div>;
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{videoId ? 'Edit Video' : 'Add New Video'}</h1>
        <div className={styles.actions}>
          <button
            onClick={() => handleSave('DRAFT')}
            disabled={saving}
            className={styles.draftButton}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('PUBLISHED')}
            disabled={saving}
            className={styles.publishButton}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={styles.editorGrid}>
        <div className={styles.mainColumn}>
          <div className={styles.field}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter video title..."
              className={styles.titleInput}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="video-url-slug"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>Video Source *</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setVideoSource('url')}
                className={videoSource === 'url' ? styles.activeTab : styles.inactiveTab}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  background: videoSource === 'url' ? '#c41e3a' : 'white',
                  color: videoSource === 'url' ? 'white' : '#333',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Video URL
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('upload')}
                className={videoSource === 'upload' ? styles.activeTab : styles.inactiveTab}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  background: videoSource === 'upload' ? '#c41e3a' : 'white',
                  color: videoSource === 'upload' ? 'white' : '#333',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Upload Video
              </button>
            </div>

            {videoSource === 'url' ? (
              <div>
                <label htmlFor="videoUrl" style={{ fontSize: '0.9rem', color: '#666' }}>
                  YouTube, Vimeo, or direct video URL
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={styles.input}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="videoFile" style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>
                  Upload video file (MP4, MOV, AVI, WebM - max 500MB)
                </label>
                <input
                  id="videoFile"
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
                {uploadingVideo && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      height: '24px'
                    }}>
                      <div style={{
                        background: '#c41e3a',
                        height: '100%',
                        width: `${uploadProgress}%`,
                        transition: 'width 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {uploadProgress > 0 && `${uploadProgress}%`}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                      Uploading video... This may take a few minutes for large files.
                    </p>
                  </div>
                )}
                {videoUrl && !uploadingVideo && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#e8f5e9',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}>
                    ✅ Video uploaded successfully
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={modules}
              className={styles.editor}
            />
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.panel}>
            <h3>Video Details</h3>
            <div className={styles.field}>
              <label htmlFor="thumbnail">Thumbnail Image</label>
              <input
                id="thumbnail"
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
                className={styles.input}
                style={{ marginBottom: '0.5rem' }}
              />
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                or
              </div>
              <input
                id="thumbnailFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleThumbnailUpload}
                disabled={uploadingThumbnail}
                style={{
                  display: 'block',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '100%',
                  fontSize: '0.85rem'
                }}
              />
              {uploadingThumbnail && (
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  Uploading thumbnail...
                </p>
              )}
            </div>
            {thumbnail && (
              <div className={styles.imagePreview}>
                <img src={thumbnail} alt="Preview" style={{ maxWidth: '100%', borderRadius: '4px' }} />
              </div>
            )}
            <div className={styles.field}>
              <label htmlFor="duration">Duration (seconds)</label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="300"
                className={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
