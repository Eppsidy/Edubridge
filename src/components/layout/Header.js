import React from 'react';
import UserInfo from '../common/UserInfo';
import '../styles/components/layout/Header.css';

const Header = ({ user, userName }) => {
  return (
    <header className="header">
      <div className="left-content">
        <div className="logo-icon">EB</div>
        <div className="logo-text">EDUBRIDGE</div>
      </div>
      <div className="right-content">
        <UserInfo userName={userName} />
      </div>
    </header>
  );
};

export default Header;