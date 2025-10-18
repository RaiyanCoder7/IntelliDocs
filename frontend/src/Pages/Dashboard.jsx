import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import CreateDocument from '../components/CreateDocument';
import DocumentList from '../components/DocumentList';
import AIAnalysis from '../components/AIAnalysis';
import FileUpload from '../components/FileUpload';
import Settings from '../components/Settings';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchDocuments();
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  // Function to fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/documents');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDocumentCreated = (newDocument) => {
    // Update documents state immediately
    setDocuments(prev => [newDocument, ...prev]);
  };

  const handleAnalyzeDocument = (document) => {
    setSelectedDocument(document);
    setShowAnalysis(true);
  };

  if (!user) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🦉 Owl AI Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Welcome, <strong>{user.username}</strong></span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h2>Hello, {user.username}! 👋</h2>
          <p>Manage your research documents and notes in one place.</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📚</div>
            <div className={styles.statInfo}>
              <h3>Documents</h3>
              <p className={styles.statNumber}>{documents.length}</p>
              <p className={styles.statLabel}>Total documents</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔍</div>
            <div className={styles.statInfo}>
              <h3>AI Analysis</h3>
              <p className={styles.statNumber}>{documents.filter(doc => doc.content.length > 100).length}</p>
              <p className={styles.statLabel}>Analyzable documents</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <h3>Storage</h3>
              <p className={styles.statNumber}>
                {Math.round(documents.reduce((total, doc) => total + doc.content.length, 0) / 1000)} KB
              </p>
              <p className={styles.statLabel}>Used</p>
            </div>
          </div>
        </div>

        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button 
              onClick={() => setShowCreateDocument(true)}
              className={styles.actionButton}
            >
              <span className={styles.actionIcon}>➕</span>
              <span>New Document</span>
            </button>
            <button 
              onClick={() => setShowFileUpload(true)}
              className={styles.actionButton}
            >
              <span className={styles.actionIcon}>📤</span>
              <span>Upload Files</span>
            </button>
            <button 
              onClick={() => {
                if (documents.length > 0) {
                  handleAnalyzeDocument(documents[0]);
                } else {
                  alert('Create a document first to use AI analysis!');
                }
              }}
              className={styles.actionButton}
            >
              <span className={styles.actionIcon}>🤖</span>
              <span>AI Analysis</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className={styles.actionButton}
            >
              <span className={styles.actionIcon}>⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Document List */}
        <DocumentList onDocumentCreated={handleDocumentCreated} />

      </main>

      {/* Create Document Modal */}
      {showCreateDocument && (
        <CreateDocument
          onDocumentCreated={handleDocumentCreated}
          onClose={() => setShowCreateDocument(false)}
        />
      )}

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload
          onFileUploaded={handleDocumentCreated}
          onClose={() => setShowFileUpload(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          user={user}
          onClose={() => setShowSettings(false)}
          onSettingsUpdate={(updatedUser) => {
            setUser(updatedUser);
            // You could show a success message here
          }}
        />
      )}

      {/* AI Analysis Modal */}
      {showAnalysis && selectedDocument && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>AI Analysis</h2>
              <button onClick={() => setShowAnalysis(false)} className={styles.closeButton}>×</button>
            </div>
            <AIAnalysis
              document={selectedDocument}
              onAnalysisComplete={() => console.log('Analysis completed')}
              onClose={() => setShowAnalysis(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;