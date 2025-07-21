import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import '../../styles/components/layout/DashboardLayout.css';

const DashboardLayout = ({ children, userName, onLogout }) => {
  return (
    <div className="user-dashboard">
      <Header userName={userName} onLogout={onLogout} />
      <Navigation activeTab="Dashboard" />
      {children}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
