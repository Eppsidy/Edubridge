import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/layout/Navigation.css';

const Navigation = ({ activeTab = 'Home' }) => {
  const navItems = [
    { key: 'Home', label: 'Home', path: '/home' },
    { key: 'Dashboard', label: 'Dashboard', path: '/userdashboard' },
    { key: 'Market', label: 'Textbook Market', path: '/textbookmarket' },
    { key: 'Cart', label: 'Cart', path: '/cart' },
    { key: 'Sale', label: 'Sale', path: '/sale' }
  ];

  return (
    <nav className="nav-tabs">
      {navItems.map(item => (
        <Link 
          key={item.key}
          to={item.path} 
          className={activeTab === item.key ? 'active' : ''}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;