import React, { useState } from 'react';
import styles from './CreateDocument.module.css';

function CreateDocument({ onDocumentCreated, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'notes',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: tagsArray
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Document created successfully!');
        setFormData({
          title: '',
          content: '',
          category: 'notes',
          tags: ''
        });
        
        // Notify parent component
        if (onDocumentCreated) {
          onDocumentCreated(data.document);
        }

        // Close modal after success
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        setMessage(`❌ ${data.message || 'Failed to create document'}`);
      }
    } catch (error) {
      console.error('💥 Document creation error:', error);
      setMessage('❌ Network error - failed to create document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create New Document</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter document title"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="research">Research</option>
              <option value="notes">Notes</option>
              <option value="article">Article</option>
              <option value="bookmark">Bookmark</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="ai, research, machine-learning"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Write your document content here..."
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating...' : 'Create Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDocument;