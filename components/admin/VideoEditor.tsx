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

  const handleSave = async (publishStatus: string) => {
    if (!title || !videoUrl) {
      alert('Title and video URL are required');
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
            <label htmlFor="videoUrl">Video URL * (YouTube, Vimeo, etc.)</label>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={styles.input}
            />
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
              <label htmlFor="thumbnail">Thumbnail URL</label>
              <input
                id="thumbnail"
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
                className={styles.input}
              />
            </div>
            {thumbnail && (
              <div className={styles.imagePreview}>
                <img src={thumbnail} alt="Preview" />
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
