import React from 'react';
import '../../styles/components/layout/Header.css';

const Header = ({ session }) => {
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  return (
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
  );
};

export default Header;