import React from 'react';
import UserInfo from '../common/UserInfo';
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
        <UserInfo userName={userName} />
      </div>
    </header>
  );
};

export default Header;