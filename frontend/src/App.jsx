import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import './index.css';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Dashboard from './Pages/Dashboard.jsx';

// Home component - defined here since we don't have a separate Home.jsx yet
function Home() {
  return (
    <div className={styles.app}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>🦉 Owl AI</h1>
          <p className={styles.heroSubtitle}>
            Your intelligent research assistant that helps you collect, 
            organize, and extract insights from your documents and notes.
          </p>
          <div className={styles.heroButtons}>
            <a href="/register" className={styles.primaryButton}>
              Get Started Free
            </a>
            <a href="/login" className={styles.secondaryButton}>
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>How Owl AI Helps You</h2>
          <p className={styles.sectionSubtitle}>
            Smart features designed for researchers, students, and knowledge workers
          </p>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>📚</span>
              <h3 className={styles.featureTitle}>Smart Document Management</h3>
              <p className={styles.featureDescription}>
                Organize your research papers, notes, and documents with AI-powered 
                categorization and automatic tagging.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🔍</span>
              <h3 className={styles.featureTitle}>Advanced Search</h3>
              <p className={styles.featureDescription}>
                Find exactly what you're looking for with semantic search that understands 
                context and meaning.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🤖</span>
              <h3 className={styles.featureTitle}>AI-Powered Insights</h3>
              <p className={styles.featureDescription}>
                Get automatic summaries, key point extraction, and intelligent insights 
                from your content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Transform Your Research?</h2>
        <p className={styles.ctaSubtitle}>
          Join thousands of researchers and students who use Owl AI to work smarter.
        </p>
        <a href="/register" className={styles.ctaButton}>
          Start Your Journey Today
        </a>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;