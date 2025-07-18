import React from 'react';
import '../styles/components/ui/Card.css';

const Card = ({ children, className = '', variant = 'default' }) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {children}
    </div>
  );
};

export default Card;