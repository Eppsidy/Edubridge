import React from 'react';
import Card from '../ui/Card';
import SearchBar from '../common/SearchBar';
import Button from '../ui/Button';
import '../../styles/components/sections/HeroSection.css';

const HeroSection = ({ userName, onLogout, onSearch }) => {
  return (
    <section className="hero-section">
      <Card variant="hero">
        <h1 className="greeting">
          HELLO{userName ? ` ${userName.toUpperCase()}` : ''}
        </h1>
        
        <Button 
          variant="link" 
          className="logout-link" 
          onClick={onLogout}
        >
          LOGOUT
        </Button>

        <h2 className="hero-title">
          WELCOME TO EDUBRIDGE
          <br />
          Your Student-Powered Learning Hub!
        </h2>

        <SearchBar 
          placeholder="Search textbooks..."
          onSearch={onSearch}
        />

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
      </Card>
    </section>
  );
};

export default HeroSection;