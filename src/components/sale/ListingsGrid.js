import React from 'react';

const ListingsGrid = ({ listings, onEdit, onDelete }) => {
  return (
    <div className="my-listings">
      <div className="listings-header">
        <h2 className="listings-title">My Listings</h2>
        <span className="listings-count">{listings.length}</span>
      </div>

      <div className="listings-grid">
        {listings.length === 0 ? (
          <div className="empty-state">
            <h3>No listings yet</h3>
            <p>Add your first textbook to get started!</p>
          </div>
        ) : (
          listings.map((book, index) => (
            <div key={index} className="book-card">
              <div className={`book-status status-${book.status || 'available'}`}>
                {(book.status || 'Available').charAt(0).toUpperCase() + (book.status || 'available').slice(1)}
              </div>
              <div className="book-header">
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                </div>
                <div className="book-actions">
                  <button className="btn-small btn-edit" onClick={() => onEdit(index)}>
                    Edit
                  </button>
                  <button className="btn-small btn-delete" onClick={() => onDelete(index)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="book-details">
                <div className="detail-item">
                  <span className="detail-label">Edition</span>
                  <span className="detail-value">{book.edition || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Subject</span>
                  <span className="detail-value">{book.subject || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">
                    {book.selling_price === 0 ? 'FREE' : `R${parseFloat(book.selling_price).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingsGrid;
