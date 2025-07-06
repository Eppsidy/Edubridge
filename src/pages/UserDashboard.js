import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/UserDashboard.css';

const UserDashboard = ({ session }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [userStats, setUserStats] = useState({
    textbooksListed: 0,
    textbooksPurchased: 0,
    booksSold: 0,
    booksBought: 0
  });
  const navigate = useNavigate();

  // Get user info from session
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  const handleCardHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    } else {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
      } else {
        console.log('Logged out successfully');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      alert('Unexpected error occurred. Please try again.');
    }
  };

  const navigateTo = (page) => {
    const routes = {
      'Home': '/home',
      'User Dashboard': '/userdashboard',
      'Textbook Market': '/market',
      'Cart': '/cart',
      'Sale': '/sale'
    };
    
    const route = routes[page];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="user-dashboard">
      <header className="header">
        <div className="left-content">
          <div className="logo-icon">EB</div>
          <div className="logo-text">EDUBRIDGE</div>
        </div>
        <div className="right-content">
          {userName && (
            <div className="user-info">
              Welcome, {userName}!
            </div>
          )}
        </div>
      </header>

      <nav className="nav-tabs">
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('Home'); }}>
          Home
        </a>
        <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigateTo('User Dashboard'); }}>
          User Dashboard
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('Textbook Market'); }}>
          Textbook Market
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('Cart'); }}>
          Cart
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('Sale'); }}>
          Sale
        </a>
      </nav>

      <div className="main-container">
        <aside className="sidebar">
          <h3>Dashboard Menu</h3>
          <ul>
            <li>
              <a 
                href="#profile" 
                className={activeSection === 'profile' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleSidebarClick('profile');
                }}
              >
                Profile
              </a>
            </li>
            <li>
              <a 
                href="#textbooks"
                className={activeSection === 'textbooks' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleSidebarClick('textbooks');
                }}
              >
                My Textbooks
              </a>
            </li>
            <li>
              <a 
                href="#purchases"
                className={activeSection === 'purchases' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleSidebarClick('purchases');
                }}
              >
                My Purchases
              </a>
            </li>
            <li>
              <a 
                href="#settings"
                className={activeSection === 'settings' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleSidebarClick('settings');
                }}
              >
                Settings
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Welcome back{userName ? `, ${userName}` : ''}!</h2>
              <p>Ready to continue your learning journey? Check out your latest activity below.</p>
            </div>
            <div className="logout-link" onClick={handleLogout}>
              LOGOUT
            </div>
          </div>

          <div className="dashboard-grid">
            <div 
              className="dashboard-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-header">         
                <h3>My Textbooks</h3>
              </div>
              <div className="card-content">
                <p>You have <strong>{userStats.textbooksListed} textbooks</strong> listed for sale</p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigateTo('Textbook Market')}
                  >
                    Add New Book
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigateTo('Cart')}
                  >
                    View Purchase
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="dashboard-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-header"> 
                <h3>Recent Purchases</h3>
              </div>
              <div className="card-content">
                <p>{userStats.textbooksPurchased} textbooks purchased</p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigateTo('Textbook Market')}
                  >
                    Browse Market
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => console.log('Order history feature coming soon!')}
                  >
                    Order History
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="dashboard-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-header">
                <h3>Your Statistics</h3>
              </div>
              <div className="card-content">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{userStats.booksSold}</div>
                    <div className="stat-label">Books Sold</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{userStats.booksBought}</div>
                    <div className="stat-label">Books Bought</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
      </div>
    </div>
  );
};

export default UserDashboard;