import React from 'react';

const Card = ({ children, className = '', variant = 'default' }) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {children}
    </div>
  );
};

export default Card;