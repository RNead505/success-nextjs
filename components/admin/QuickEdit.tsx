/**
 * Quick Edit Inline Editor
 * Allows editing post metadata without opening full editor
 */

import { useState, useEffect } from 'react';
import styles from './QuickEdit.module.css';

interface Category {
  id: number;
  name: string;
  slug?: string;
}

interface QuickEditProps {
  post: any;
  categories: Category[];
  onSave: (updatedPost: any) => void;
  onCancel: () => void;
}

export default function QuickEdit({ post, categories, onSave, onCancel }: QuickEditProps) {
  const [title, setTitle] = useState(post.title.rendered || post.title);
  const [status, setStatus] = useState(post.status);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [publishDate, setPublishDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize selected categories
    const postCategories = post._embedded?.['wp:term']?.[0] || [];
    const categoryIds = postCategories.map((cat: any) => cat.id);
    setSelectedCategories(categoryIds);

    // Initialize publish date
    if (post.date) {
      const date = new Date(post.date);
      const formattedDate = date.toISOString().slice(0, 16);
      setPublishDate(formattedDate);
    }
  }, [post]);

  const handleCategoryToggle = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    const updatedPost = {
      id: post.id,
      title,
      status,
      categories: selectedCategories,
      date: publishDate ? new Date(publishDate).toISOString() : post.date,
    };

    onSave(updatedPost);
    setSaving(false);
  };

  return (
    <tr className={styles.quickEditRow}>
      <td colSpan={7}>
        <div className={styles.quickEditContainer}>
          <div className={styles.quickEditHeader}>
            <h3>Quick Edit</h3>
            <div className={styles.quickEditActions}>
              <button onClick={onCancel} className={styles.cancelButton} disabled={saving}>
                Cancel
              </button>
              <button onClick={handleSave} className={styles.saveButton} disabled={saving}>
                {saving ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>

          <div className={styles.quickEditBody}>
            {/* Left Column */}
            <div className={styles.column}>
              <div className={styles.field}>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Slug</label>
                <input
                  type="text"
                  value={post.slug}
                  className={styles.input}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <small style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Slug cannot be changed in quick edit
                </small>
              </div>

              <div className={styles.field}>
                <label>Publish Date</label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.column}>
              <div className={styles.field}>
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={styles.select}
                >
                  <option value="draft">Draft</option>
                  <option value="publish">Published</option>
                  <option value="pending">Pending Review</option>
                  <option value="private">Private</option>
                  <option value="future">Scheduled</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Categories</label>
                <div className={styles.categoryList}>
                  {categories.slice(0, 12).map((cat) => (
                    <label key={cat.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className={styles.checkbox}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
