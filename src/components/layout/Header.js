import React from 'react';
import UserInfo from '../common/UserInfo';
import '../../styles/components/layout/Header.css';

const Header = ({ session, userName, onLogout }) => {
  return (
    <header className="header">
      <div className="left-content">
        <div className="logo-icon">EB</div>
        <div className="logo-text">EDUBRIDGE</div>
      </div>
      <div className="right-content">
        <UserInfo userName={userName} onLogout={onLogout} />
      </div>
    </header>
  );
};

export default Header;