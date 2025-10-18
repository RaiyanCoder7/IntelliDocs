import React, { useState, useEffect } from 'react';
import styles from './DocumentList.module.css';
import AIAnalysis from './AIAnalysis';

function DocumentList({ onDocumentCreated }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/documents');
      const data = await response.json();

      if (data.success) {
        setDocuments(data.data);
        // Notify parent component about documents count
        if (onDocumentCreated) {
          // This will help parent component know documents are loaded
        }
      } else {
        setMessage('❌ Failed to load documents');
      }
    } catch (error) {
      console.error('💥 Documents fetch error:', error);
      setMessage('❌ Network error loading documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Document deleted successfully');
        // Refresh the document list
        fetchDocuments();
      } else {
        setMessage(`❌ ${data.message || 'Failed to delete document'}`);
      }
    } catch (error) {
      console.error('💥 Document deletion error:', error);
      setMessage('❌ Network error deleting document');
    }
  };

  const handleAnalyze = (document) => {
    setSelectedDocument(document);
    setShowAnalysis(true);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      research: '🔬',
      notes: '📝',
      article: '📄',
      bookmark: '🔖',
      other: '📁'
    };
    return icons[category] || '📁';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className={styles.documentList}>
      <div className={styles.header}>
        <h3>My Documents</h3>
        <span className={styles.count}>{documents.length} documents</span>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      {documents.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h4>No documents yet</h4>
          <p>Create your first document to get started!</p>
        </div>
      ) : (
        <div className={styles.documentsGrid}>
          {documents.map((document) => (
            <div key={document._id} className={styles.documentCard}>
              <div className={styles.documentHeader}>
                <span className={styles.categoryIcon}>
                  {getCategoryIcon(document.category)}
                </span>
                <span className={styles.category}>
                  {document.category}
                </span>
              </div>
              
              <h4 className={styles.documentTitle}>{document.title}</h4>
              
              <p className={styles.documentContent}>
                {document.content.length > 100 
                  ? `${document.content.substring(0, 100)}...` 
                  : document.content
                }
              </p>

              {document.tags && document.tags.length > 0 && (
                <div className={styles.tags}>
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              )}

              <div className={styles.documentFooter}>
                <span className={styles.date}>
                  {formatDate(document.createdAt)}
                </span>
                <div className={styles.documentActions}>
                  <button
                    onClick={() => handleAnalyze(document)}
                    className={styles.analyzeButton}
                    title="AI Analysis"
                  >
                    🤖
                  </button>
                  <button
                    onClick={() => handleDelete(document._id)}
                    className={styles.deleteButton}
                    title="Delete document"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAnalysis && selectedDocument && (
        <AIAnalysis
          document={selectedDocument}
          onAnalysisComplete={() => {
            console.log('Analysis completed');
            setShowAnalysis(false);
          }}
          onClose={() => {
            setShowAnalysis(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}

export default DocumentList;