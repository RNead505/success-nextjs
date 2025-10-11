import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import styles from './EnhancedPostEditor.module.css';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EnhancedPostEditorProps {
  postId?: string;
}

export default function EnhancedPostEditor({ postId }: EnhancedPostEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [status, setStatus] = useState('draft');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activePanel, setActivePanel] = useState<'settings' | 'seo' | 'media'>('settings');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
      const res = await fetch(`${wpApiUrl}/categories?per_page=100`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://www.success.com/wp-json/wp/v2';
      const res = await fetch(`${wpApiUrl}/posts/${postId}?_embed`);
      const post = await res.json();

      setTitle(post.title.rendered);
      setSlug(post.slug);
      if (editor) {
        editor.commands.setContent(post.content.rendered);
      }
      setExcerpt(post.excerpt?.rendered || '');
      setFeaturedImage(post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '');
      setFeaturedImageAlt(post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '');
      setStatus(post.status);
      setSeoTitle(post.yoast_head_json?.title || '');
      setSeoDescription(post.yoast_head_json?.description || '');
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
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
    if (!postId && !slug) {
      setSlug(generateSlug(value));
    }
    if (!seoTitle) {
      setSeoTitle(value);
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleSave = async (publishStatus: string) => {
    if (!title || !editor?.getHTML()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    alert(`Note: This will save to local database. WordPress integration requires API authentication.

Post Data:
- Title: ${title}
- Status: ${publishStatus}
- Content: ${editor.getHTML().substring(0, 100)}...

To save to WordPress, you'll need to set up WordPress REST API authentication.`);
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading post...</div>;
  }

  if (!editor) {
    return <div className={styles.loading}>Initializing editor...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <button onClick={() => router.push('/admin/posts')} className={styles.backButton}>
            ← Back to Posts
          </button>
        </div>
        <div className={styles.topRight}>
          <button onClick={() => setShowPreview(!showPreview)} className={styles.previewButton}>
            {showPreview ? '📝 Edit' : '👁 Preview'}
          </button>
          <button onClick={() => handleSave('draft')} disabled={saving} className={styles.draftButton}>
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => handleSave('publish')} disabled={saving} className={styles.publishButton}>
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.titleSection}>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Add title"
              className={styles.titleInput}
            />
            <div className={styles.slugRow}>
              <span className={styles.slugLabel}>Permalink:</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-slug"
                className={styles.slugInput}
              />
            </div>
          </div>

          {!showPreview ? (
            <>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.toolbarGroup}>
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Bold (Ctrl+B)"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Italic (Ctrl+I)"
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Underline (Ctrl+U)"
                  >
                    <u>U</u>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Strikethrough"
                  >
                    <s>S</s>
                  </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Paragraph"
                  >
                    P
                  </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Numbered List"
                  >
                    1. List
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Quote"
                  >
                    "
                  </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                  <button onClick={setLink} className={styles.toolbarButton} title="Insert Link">
                    🔗
                  </button>
                  <button onClick={addImage} className={styles.toolbarButton} title="Insert Image">
                    🖼
                  </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Align Left"
                  >
                    ⬅
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Align Center"
                  >
                    ⬌
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Align Right"
                  >
                    ➡
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <EditorContent editor={editor} className={styles.editor} />
            </>
          ) : (
            /* Preview Mode */
            <div className={styles.preview}>
              <h1>{title || 'Untitled Post'}</h1>
              <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Panel Tabs */}
          <div className={styles.panelTabs}>
            <button
              onClick={() => setActivePanel('settings')}
              className={activePanel === 'settings' ? styles.panelTabActive : styles.panelTab}
            >
              Settings
            </button>
            <button
              onClick={() => setActivePanel('media')}
              className={activePanel === 'media' ? styles.panelTabActive : styles.panelTab}
            >
              Media
            </button>
            <button
              onClick={() => setActivePanel('seo')}
              className={activePanel === 'seo' ? styles.panelTabActive : styles.panelTab}
            >
              SEO
            </button>
          </div>

          {/* Settings Panel */}
          {activePanel === 'settings' && (
            <div className={styles.panel}>
              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>Status</h3>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
                  <option value="draft">Draft</option>
                  <option value="publish">Published</option>
                  <option value="pending">Pending Review</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>Categories</h3>
                <div className={styles.categoryList}>
                  {categories.slice(0, 10).map((cat) => (
                    <label key={cat.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                          }
                        }}
                        className={styles.checkbox}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>Excerpt</h3>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write a short excerpt..."
                  rows={4}
                  className={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* Media Panel */}
          {activePanel === 'media' && (
            <div className={styles.panel}>
              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>Featured Image</h3>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Image URL"
                  className={styles.input}
                />
                {featuredImage && (
                  <div className={styles.imagePreview}>
                    <img src={featuredImage} alt="Featured" />
                  </div>
                )}
                <input
                  type="text"
                  value={featuredImageAlt}
                  onChange={(e) => setFeaturedImageAlt(e.target.value)}
                  placeholder="Alt text"
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {/* SEO Panel */}
          {activePanel === 'seo' && (
            <div className={styles.panel}>
              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>SEO Title</h3>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO Title"
                  className={styles.input}
                  maxLength={60}
                />
                <small className={styles.charCount}>{seoTitle.length}/60 characters</small>
              </div>

              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>Meta Description</h3>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search engines..."
                  rows={3}
                  className={styles.textarea}
                  maxLength={160}
                />
                <small className={styles.charCount}>{seoDescription.length}/160 characters</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
