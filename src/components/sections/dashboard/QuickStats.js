import React from 'react';
import '../../../styles/components/sections/dashboard/QuickStats.css';

const QuickStats = ({ books }) => {
  const totalBooks = books.length;
  const avgPrice = totalBooks > 0 ? books.reduce((sum, book) => sum + book.price, 0) / totalBooks : 0;
  const uniqueCourses = new Set(books.map(book => book.course)).size;
  const activeSellers = new Set(books.map(book => book.seller)).size;

  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-number">{totalBooks}</div>
        <div className="stat-label">Books Available</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">R{avgPrice.toFixed(0)}</div>
        <div className="stat-label">Average Price</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{uniqueCourses}</div>
        <div className="stat-label">Courses</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{activeSellers}</div>
        <div className="stat-label">Active Sellers</div>
      </div>
    </div>
  );
};

export default QuickStats;
