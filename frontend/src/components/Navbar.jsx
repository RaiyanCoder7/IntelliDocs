import React from 'react'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🦉</span>
          Owl AI
        </div>
        
        <div className={styles.navLinks}>
          <a href="/" className={styles.navLink}>Home</a>
          <a href="/documents" className={styles.navLink}>Documents</a>
          <a href="/dashboard" className={styles.navLink}>Dashboard</a>
        </div>
        
        <div className={styles.navActions}>
          <a href="/login" className={styles.loginBtn}>Login</a>
          <a href="/register" className={styles.signupBtn}>Sign Up</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar