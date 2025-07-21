import React from 'react';
import '../../../styles/components/sections/dashboard/DashboardContent.css';

const DashboardContent = ({ 
  activeSection, 
  userProfile, 
  userBooks, 
  userPurchases, 
  loading 
}) => {
  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  switch (activeSection) {
    case 'profile':
      return (
        <div className="section-content">
          <h3>Profile Information</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {userProfile.name}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Member Since:</strong> {new Date(userProfile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      );
    
    case 'textbooks':
      return (
        <div className="section-content">
          <h3>My Listed Textbooks</h3>
          {userBooks.length === 0 ? (
            <p>You haven't listed any textbooks yet.</p>
          ) : (
            <div className="books-list">
              {userBooks.map(book => (
                <div key={book.id} className="book-item">
                  <h4>{book.title}</h4>
                  <p>by {book.author}</p>
                  <p><strong>Price:</strong> R{book.selling_price?.toFixed(2)}</p>
                  <p><strong>Condition:</strong> {book.condition_rating}</p>
                  <p><strong>Status:</strong> {book.availability_status}</p>
                  <p><strong>Category:</strong> {book.categories?.name || 'Uncategorized'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    
    case 'purchases':
      return (
        <div className="section-content">
          <h3>My Purchases</h3>
          {userPurchases.length === 0 ? (
            <p>You haven't made any purchases yet.</p>
          ) : (
            <div className="purchases-list">
              {userPurchases.map(purchase => (
                <div key={purchase.id} className="purchase-item">
                  <h4>{purchase.books?.title}</h4>
                  <p>by {purchase.books?.author}</p>
                  <p><strong>Price:</strong> R{purchase.amount?.toFixed(2)}</p>
                  <p><strong>Date:</strong> {new Date(purchase.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    
    case 'settings':
      return (
        <div className="section-content">
          <h3>Settings</h3>
          <p>Settings functionality coming soon!</p>
        </div>
      );
    
    default:
      return null;
  }
};

export default DashboardContent;
