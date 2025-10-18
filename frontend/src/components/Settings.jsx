import React, { useState } from 'react';
import styles from './Settings.module.css';

function Settings({ user, onClose, onSettingsUpdate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: 'Research enthusiast and AI explorer',
    notification: true,
    newsletter: false
  });

  const [aiSettings, setAiSettings] = useState({
    autoSummarize: true,
    sentimentAnalysis: true,
    keyPoints: true,
    language: 'english'
  });

  // NEW: State for preferences including theme
  const [preferences, setPreferences] = useState({
    showDocumentPreviews: true,
    displayAnalytics: true,
    browserNotifications: true,
    soundAlerts: false,
    theme: 'light' // 'light' or 'dark'
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAISettingsChange = (field, value) => {
    setAiSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // NEW: Handler for preference changes
  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));

    // If theme is changed, apply it immediately
    if (field === 'theme') {
      applyTheme(value);
    }
  };

  // NEW: Function to apply theme
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-theme');
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('✅ Profile updated successfully!');
      
      const updatedUser = { ...user, username: profileData.username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onSettingsUpdate) {
        onSettingsUpdate(updatedUser);
      }
    } catch (error) {
      setMessage('❌ Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const saveAISettings = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage('✅ AI Settings updated successfully!');
      
      // Save to localStorage
      localStorage.setItem('aiSettings', JSON.stringify(aiSettings));
    } catch (error) {
      setMessage('❌ Failed to update AI settings');
    } finally {
      setSaving(false);
    }
  };

  // NEW: Save preferences function
  const savePreferences = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage('✅ Preferences updated successfully!');
      
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Apply theme
      applyTheme(preferences.theme);
    } catch (error) {
      setMessage('❌ Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>⚙️ Settings</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.settingsContent}>
          {/* Navigation Tabs */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'ai' ? styles.active : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              🤖 AI Settings
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'preferences' ? styles.active : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              ⚡ Preferences
            </button>
          </div>

          {message && (
            <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={styles.tabContent}>
              <h3>Profile Settings</h3>
              
              <div className={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={profileData.notification}
                    onChange={(e) => handleProfileChange('notification', e.target.checked)}
                  />
                  <span>Enable email notifications</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={profileData.newsletter}
                    onChange={(e) => handleProfileChange('newsletter', e.target.checked)}
                  />
                  <span>Subscribe to newsletter</span>
                </label>
              </div>

              <button 
                onClick={saveProfile}
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {/* AI Settings Tab */}
          {activeTab === 'ai' && (
            <div className={styles.tabContent}>
              <h3>AI Analysis Settings</h3>
              <p className={styles.sectionDescription}>
                Configure how Owl AI analyzes your documents
              </p>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={aiSettings.autoSummarize}
                    onChange={(e) => handleAISettingsChange('autoSummarize', e.target.checked)}
                  />
                  <span>Auto-generate summaries for new documents</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={aiSettings.sentimentAnalysis}
                    onChange={(e) => handleAISettingsChange('sentimentAnalysis', e.target.checked)}
                  />
                  <span>Enable sentiment analysis</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={aiSettings.keyPoints}
                    onChange={(e) => handleAISettingsChange('keyPoints', e.target.checked)}
                  />
                  <span>Extract key points automatically</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Analysis Language</label>
                <select
                  value={aiSettings.language}
                  onChange={(e) => handleAISettingsChange('language', e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>

              <button 
                onClick={saveAISettings}
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? 'Saving...' : 'Save AI Settings'}
              </button>
            </div>
          )}

          {/* Preferences Tab - UPDATED */}
          {activeTab === 'preferences' && (
            <div className={styles.tabContent}>
              <h3>Application Preferences</h3>
              
              <div className={styles.preferenceSection}>
                <h4>📊 Dashboard</h4>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={preferences.showDocumentPreviews}
                      onChange={(e) => handlePreferenceChange('showDocumentPreviews', e.target.checked)}
                    />
                    <span>Show document previews</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={preferences.displayAnalytics}
                      onChange={(e) => handlePreferenceChange('displayAnalytics', e.target.checked)}
                    />
                    <span>Display analytics</span>
                  </label>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h4>🔔 Notifications</h4>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={preferences.browserNotifications}
                      onChange={(e) => handlePreferenceChange('browserNotifications', e.target.checked)}
                    />
                    <span>Browser notifications</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={preferences.soundAlerts}
                      onChange={(e) => handlePreferenceChange('soundAlerts', e.target.checked)}
                    />
                    <span>Sound alerts</span>
                  </label>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h4>🎨 Appearance</h4>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="theme" 
                      checked={preferences.theme === 'light'}
                      onChange={() => handlePreferenceChange('theme', 'light')}
                    />
                    <span>Light theme</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="theme" 
                      checked={preferences.theme === 'dark'}
                      onChange={() => handlePreferenceChange('theme', 'dark')}
                    />
                    <span>Dark theme</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={savePreferences}
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;