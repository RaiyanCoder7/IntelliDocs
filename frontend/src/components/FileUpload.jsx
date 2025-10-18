import React, { useState } from 'react';
import styles from './FileUpload.module.css';

function FileUpload({ onFileUploaded, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFiles(files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    setMessage('');

    try {
      // Simulate file processing (in real app, you'd upload to server)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract text from files (simulated)
      const file = files[0];
      let content = '';
      
      if (file.type === 'text/plain') {
        content = `Content from ${file.name}: This is simulated text content from your uploaded file. In a real application, you would process the actual file content.`;
      } else if (file.type.includes('pdf')) {
        content = `PDF Content from ${file.name}: [Simulated PDF extraction] This would contain the actual text extracted from your PDF file.`;
      } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
        content = `Document Content from ${file.name}: [Simulated Word document extraction] This would contain the actual text from your Word document.`;
      } else {
        content = `File: ${file.name}\nType: ${file.type}\nSize: ${(file.size / 1024).toFixed(2)} KB\n\nThis file type would be processed in a real application.`;
      }

      // Create a document from the uploaded file
      const documentData = {
        title: `Uploaded: ${file.name}`,
        content: content,
        category: 'research',
        tags: ['uploaded', file.type.split('/')[0] || 'file']
      };

      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Successfully uploaded and processed "${file.name}"`);
        if (onFileUploaded) {
          onFileUploaded(data.document);
        }
        
        // Close after success
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setMessage(`❌ Failed to process file: ${data.message}`);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>📤 Upload Files</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.uploadContent}>
          {message && (
            <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          <div 
            className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''} ${uploading ? styles.uploading : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className={styles.uploadingState}>
                <div className={styles.spinner}></div>
                <p>Processing your file...</p>
              </div>
            ) : (
              <>
                <div className={styles.uploadIcon}>📁</div>
                <h3>Drop files here or click to upload</h3>
                <p className={styles.supportedFormats}>
                  Supported: TXT, PDF, DOCX (simulated processing)
                </p>
                <button 
                  onClick={handleButtonClick}
                  className={styles.uploadButton}
                  disabled={uploading}
                >
                  Choose Files
                </button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleChange}
                  className={styles.fileInput}
                  accept=".txt,.pdf,.docx,.doc"
                />
              </>
            )}
          </div>

          <div className={styles.uploadInfo}>
            <h4>How it works:</h4>
            <ul>
              <li>📝 <strong>Text files</strong> - Direct content extraction</li>
              <li>📄 <strong>PDF files</strong> - Text extraction simulation</li>
              <li>📋 <strong>Word documents</strong> - Content processing simulation</li>
              <li>⚡ <strong>Automatic</strong> - Creates documents from uploaded files</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;