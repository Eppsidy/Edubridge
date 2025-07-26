import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../hooks/useSearch';
import '../styles/Home.css';

const Home = ({ session }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { handleSearch } = useSearch();

  // Get user info from session
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  return (
    <div className="home-container">
      <Header user={user} userName={userName} />
      <Navigation activeTab="Home" />
      <div className="content-wrapper content-card">
        <HeroSection 
          userName={userName} 
          onLogout={handleLogout}
        />
        <FeaturesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Home;