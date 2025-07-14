// Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/Home.css';

const Home = ({ session }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Get user info from session
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const term = searchTerm.trim();
      if (term) {
        // TODO: Implement actual search functionality
        console.log("Searching for:", term);
        // Example: navigate(`/search?q=${encodeURIComponent(term)}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
      } else {
        // Navigation will happen automatically via the auth state change listener in App.js
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
      'UserDashboard': '/userdashboard',
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
    <div className="home-container">
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
        <Link to="/home" className="active">Home</Link>
        <Link to="/userdashboard">Dashboard</Link>
        <Link to="/textbookmarket">Textbook Market</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/sale">Sale</Link>
      </nav>

      <div className="hero-section">
        <div className="hero-card">
          <h1 className="greeting">HELLO{userName ? ` ${userName.toUpperCase()}` : ''}</h1>
          
          <div className="logout-link" onClick={handleLogout}>
            LOGOUT
          </div>

          <h2 className="hero-title">
            WELCOME TO EDUBRIDGE
            <br />
            Your Student-Powered Learning Hub!
          </h2>

          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
            <input
              type="text"
              className="search-input"
              placeholder="Search textbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <div 
            className="hero-image" 
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)',
            }}
          />
          
          <p className="hero-description">
            Struggling with expensive textbooks? You've found the right place. 
            EduBridge lets students across South Africa buy, sell, or donate digital textbooks.
          </p>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h2 className="feature-title">WHY STUDENTS LOVE EDUBRIDGE</h2>
          <div 
            className="feature-image" 
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)',
            }}
          />
          <ul className="feature-list">
            <li>Affordable access to textbooks</li>
            <li>Buy, sell, or donate in a few clicks</li>
            <li>Track your learning progress</li>
          </ul>
        </div>

        <div className="feature-card">
          <h2 className="feature-title">HOW IT WORKS</h2>
          <div 
            className="feature-image" 
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)',
            }}
          />
          <ul className="feature-list">
            <li>Buy digital textbooks at student-friendly prices</li>
            <li>List your old books and earn money</li>
            <li>Track everything in your dashboard</li>
            <li>Join study groups and discussions</li>
          </ul>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
      </div>
    </div>
  );
};

export default Home;