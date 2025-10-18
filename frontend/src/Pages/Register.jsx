import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Sending registration request...');
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      console.log('📨 Server response:', data);

      if (data.success) {
        setMessage('✅ Registration successful! Redirecting...');
        
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      setMessage('❌ Network error - make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Create Account</h1>
        <p className={styles.authSubtitle}>Join Owl AI today</p>
        
        {message && (
          <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
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
              minLength="6"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className={styles.authSwitch}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;