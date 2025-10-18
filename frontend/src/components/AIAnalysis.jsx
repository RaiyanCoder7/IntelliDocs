import React, { useState } from 'react';
import styles from './AIAnalysis.module.css';

function AIAnalysis({ document, onAnalysisComplete }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [message, setMessage] = useState('');

  const analyzeDocument = async (type = 'full') => {
    if (!document?.content) {
      setMessage('❌ No document content to analyze');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let endpoint = '/api/ai/analyze';
      if (type === 'summary') endpoint = '/api/ai/summarize';
      if (type === 'keypoints') endpoint = '/api/ai/keypoints';
      if (type === 'sentiment') endpoint = '/api/ai/sentiment';

      console.log(`🤖 Sending ${type} analysis request...`);

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: document.content,
          title: document.title
        }),
      });

      const data = await response.json();
      console.log('📨 AI Response:', data);

      if (data.success) {
        if (type === 'full') {
          setAnalysis(data.analysis);
        } else {
          setAnalysis({ [type]: data });
        }
        setMessage('✅ Analysis completed successfully!');
        
        if (onAnalysisComplete) {
          onAnalysisComplete(data);
        }
      } else {
        setMessage(`❌ ${data.message || 'Analysis failed'}`);
      }
    } catch (error) {
      console.error('💥 AI Analysis error:', error);
      setMessage('❌ Network error - AI service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '#48bb78';
      case 'negative': return '#f56565';
      case 'neutral': return '#ed8936';
      default: return '#a0aec0';
    }
  };

  return (
    <div className={styles.aiAnalysis}>
      <div className={styles.header}>
        <h3>🤖 AI Analysis</h3>
        <div className={styles.actions}>
          <button
            onClick={() => analyzeDocument('summary')}
            disabled={loading}
            className={styles.actionButton}
          >
            📝 Summary
          </button>
          <button
            onClick={() => analyzeDocument('keypoints')}
            disabled={loading}
            className={styles.actionButton}
          >
            🔑 Key Points
          </button>
          <button
            onClick={() => analyzeDocument('sentiment')}
            disabled={loading}
            className={styles.actionButton}
          >
            😊 Sentiment
          </button>
          <button
            onClick={() => analyzeDocument('full')}
            disabled={loading}
            className={styles.fullAnalysisButton}
          >
            🚀 Full Analysis
          </button>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>AI is analyzing your document...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className={styles.results}>
          {/* Navigation Tabs */}
          <div className={styles.tabs}>
            {analysis.summary && (
              <button
                className={`${styles.tab} ${activeTab === 'summary' ? styles.active : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                📝 Summary
              </button>
            )}
            {analysis.keyPoints && (
              <button
                className={`${styles.tab} ${activeTab === 'keypoints' ? styles.active : ''}`}
                onClick={() => setActiveTab('keypoints')}
              >
                🔑 Key Points
              </button>
            )}
            {analysis.sentiment && (
              <button
                className={`${styles.tab} ${activeTab === 'sentiment' ? styles.active : ''}`}
                onClick={() => setActiveTab('sentiment')}
              >
                😊 Sentiment
              </button>
            )}
          </div>

          {/* Summary Tab */}
          {activeTab === 'summary' && analysis.summary && (
            <div className={styles.tabContent}>
              <h4>Document Summary</h4>
              <div className={styles.summaryBox}>
                <p>{analysis.summary.summary}</p>
                <div className={styles.stats}>
                  <span>Original: {analysis.summary.originalLength} chars</span>
                  <span>Summary: {analysis.summary.summaryLength} chars</span>
                  <span>Reduced by: {analysis.summary.reduction}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Points Tab */}
          {activeTab === 'keypoints' && analysis.keyPoints && (
            <div className={styles.tabContent}>
              <h4>Key Points</h4>
              <ul className={styles.keyPointsList}>
                {analysis.keyPoints.keyPoints.map((point, index) => (
                  <li key={index} className={styles.keyPoint}>
                    <span className={styles.pointNumber}>{index + 1}</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>
                Found {analysis.keyPoints.count} key points
                {analysis.keyPoints.note && ` • ${analysis.keyPoints.note}`}
              </p>
            </div>
          )}

          {/* Sentiment Tab */}
          {activeTab === 'sentiment' && analysis.sentiment && (
            <div className={styles.tabContent}>
              <h4>Sentiment Analysis</h4>
              <div className={styles.sentimentResult}>
                <div 
                  className={styles.sentimentBadge}
                  style={{ backgroundColor: getSentimentColor(analysis.sentiment.sentiment) }}
                >
                  {analysis.sentiment.sentiment}
                </div>
                <p className={styles.confidence}>
                  Confidence: {analysis.sentiment.confidence}%
                </p>
                <p className={styles.analysis}>
                  {analysis.sentiment.analysis}
                </p>
                {analysis.sentiment.note && (
                  <p className={styles.note}>{analysis.sentiment.note}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!analysis && !loading && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>🤖</div>
          <p>Click an analysis button to get AI insights about your document</p>
          <ul className={styles.featureList}>
            <li>📝 <strong>Summary</strong> - Get a concise summary</li>
            <li>🔑 <strong>Key Points</strong> - Extract main ideas</li>
            <li>😊 <strong>Sentiment</strong> - Analyze tone and emotion</li>
            <li>🚀 <strong>Full Analysis</strong> - Get all insights at once</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;