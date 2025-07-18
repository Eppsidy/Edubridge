import React from 'react';

const UserInfo = ({ userName }) => {
  if (!userName) return null;

  return (
    <div className="user-info">
      Welcome, {userName}!
    </div>
  );
};

export default UserInfo;