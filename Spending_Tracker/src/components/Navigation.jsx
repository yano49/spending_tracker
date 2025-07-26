import React from 'react';
import { NavLink } from 'react-router-dom';
import { DollarSign, BarChart3, Receipt, User } from 'lucide-react';

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '256px',
    maxWidth: '30vw', // Prevent sidebar from being too wide on small screens
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 40, // Reduced z-index
    overflowY: 'auto', // Allow scrolling if content is too tall
    overflowX: 'hidden' // Prevent horizontal overflow
  },
  header: {
    padding: '20px 16px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.5)'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  iconContainer: {
    padding: '6px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '10px',
    boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1)',
    flexShrink: 0
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    lineHeight: '1.2'
  },
  brandSubtitle: {
    fontSize: '11px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: '1.2'
  },
  menuContainer: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  linkBase: {
    textDecoration: 'none',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minHeight: '40px',
    boxSizing: 'border-box'
  },
  linkActive: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    boxShadow: '0 8px 12px -3px rgba(99, 102, 241, 0.25)'
  },
  linkInactive: {
    background: 'transparent',
    color: '#cbd5e1'
  },
  userSection: {
    position: 'absolute',
    bottom: '20px',
    left: '12px',
    right: '12px'
  },
  userContainer: {
    background: 'linear-gradient(135deg, #1e293b, #334155)',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid rgba(100, 116, 139, 0.5)'
  },
  userContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  userText: {
    flex: 1,
    minWidth: 0 // Allow text to shrink
  },
  userName: {
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    margin: 0,
    lineHeight: '1.2'
  },
  userRole: {
    color: '#94a3b8',
    fontSize: '11px',
    margin: 0,
    lineHeight: '1.2'
  }
};

function Navigation() {
  const menuItems = [
    { id: '/', label: 'Analytics', icon: BarChart3 },
    { id: '/journal', label: 'Journal', icon: Receipt },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.brandContainer}>
          <div style={styles.iconContainer}>
            <DollarSign size={20} color="white" />
          </div>
          <div style={styles.userText}>
            <h1 style={styles.brandTitle}>SpendTracker</h1>
            <p style={styles.brandSubtitle}>Financial Management</p>
          </div>
        </div>
      </div>

      <div style={styles.menuContainer}>
        {menuItems.map(({ id, label, icon: Icon }) => (
          <NavLink
            key={id}
            to={id}
            style={({ isActive }) => ({
              ...styles.linkBase,
              ...(isActive ? styles.linkActive : styles.linkInactive)
            })}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div style={styles.userSection}>
        <div style={styles.userContainer}>
          <div style={styles.userContent}>
            <div style={styles.userAvatar}>
              <User size={18} color="white" />
            </div>
            <div style={styles.userText}>
              <p style={styles.userName}>Welcome back!</p>
              <p style={styles.userRole}>Manage your finances</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;