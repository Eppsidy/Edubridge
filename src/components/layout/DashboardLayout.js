import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import '../../styles/components/layout/DashboardLayout.css';

const DashboardLayout = ({ children, userName, onLogout }) => {
  return (
    <div className="user-dashboard">
      <Header userName={userName} />
      <Navigation activeTab="dashboard" />
      {children}
      <div className="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
      </div>
    </div>
  );
};

export default DashboardLayout;
