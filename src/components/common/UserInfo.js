import React from 'react';
import '../styles/components/common/UserInfo.css';

const UserInfo = ({ userName }) => {
  if (!userName) return null;

  return (
    <div className="user-info">
      Welcome, {userName}!
    </div>
  );
};

export default UserInfo;