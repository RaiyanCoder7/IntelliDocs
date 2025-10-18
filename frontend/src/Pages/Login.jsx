import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage(''); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('🚀 Sending login request...');
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      console.log('📨 Server response:', data);

      if (data.success) {
        setMessage('✅ Login successful! Redirecting to dashboard...');
        
        // Save user data to localStorage (temporary)
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Clear form
        setFormData({
          email: '',
          password: ''
        });

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setMessage('❌ Network error - make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Welcome Back</h1>
        <p className={styles.authSubtitle}>Sign in to your Owl AI account</p>
        
        {message && (
          <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className={styles.authSwitch}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;