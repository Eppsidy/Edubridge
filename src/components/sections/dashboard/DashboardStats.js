import React from 'react';
import '../../../styles/components/sections/dashboard/DashboardStats.css';

const DashboardStats = ({ stats, onCardHover, onNavigate }) => {
  return (
    <div className="dashboard-grid">
      <div 
        className="dashboard-card"
        onMouseEnter={(e) => onCardHover(e, true)}
        onMouseLeave={(e) => onCardHover(e, false)}
      >
        <div className="card-header">         
          <h3>My Textbooks</h3>
        </div>
        <div className="card-content">
          <p>You have <strong>{stats.textbooksListed} textbooks</strong> listed for sale</p>
          <p>You've sold <strong>{stats.booksSold} books</strong> earning <strong>R{stats.totalEarnings.toFixed(2)}</strong></p>
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('Addbook')}
            >
              Add New Book
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('textbooks')}
            >
              View My Books
            </button>
          </div>
        </div>
      </div>

      <div 
        className="dashboard-card"
        onMouseEnter={(e) => onCardHover(e, true)}
        onMouseLeave={(e) => onCardHover(e, false)}
      >
        <div className="card-header"> 
          <h3>Recent Purchases</h3>
        </div>
        <div className="card-content">
          <p>{stats.textbooksPurchased} textbooks purchased</p>
          <p>Total spent: <strong>R{stats.totalSpent.toFixed(2)}</strong></p>
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('Textbook Market')}
            >
              Browse Market
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('purchases')}
            >
              View Purchases
            </button>
          </div>
        </div>
      </div>

      <div 
        className="dashboard-card"
        onMouseEnter={(e) => onCardHover(e, true)}
        onMouseLeave={(e) => onCardHover(e, false)}
      >
        <div className="card-header">
          <h3>Your Statistics</h3>
        </div>
        <div className="card-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.booksSold}</div>
              <div className="stat-label">Books Sold</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.booksBought}</div>
              <div className="stat-label">Books Bought</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">R{stats.totalEarnings.toFixed(0)}</div>
              <div className="stat-label">Total Earnings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">R{stats.totalSpent.toFixed(0)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
