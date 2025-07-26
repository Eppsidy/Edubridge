import React from 'react';
import '../../styles/components/ui/BookCard.css';

const BookCard = ({ book, onBuyNow }) => {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        {book.thumbnail_url ? (
          <>
            <img 
              src={book.thumbnail_url} 
              alt={book.title}
              className="book-image"
              onError={handleImageError}
            />
            <div className="book-placeholder-fallback" style={{display: 'none'}}>
              📚
            </div>
          </>
        ) : (
          <div className="book-placeholder">
            📚
          </div>
        )}
        
        {book.selling_price === 0 && (
          <div className="donation-badge">FREE</div>
        )}
      </div>
      
      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        
        <div className="book-info">
          <span className="book-course">{book.course || book.categories?.name || 'General'}</span>
          <span className="book-condition">{book.condition_rating}</span>
        </div>
        
        <div className="book-price-container">
          {book.selling_price > 0 ? (
            <span className="book-price">R{book.selling_price}</span>
          ) : (
            <span className="book-free">FREE</span>
          )}
        </div>
        
        <div className="book-actions">
          <button 
            className="buy-button"
            onClick={() => onBuyNow(book)}
          >
            {book.selling_price > 0 ? 'Add to Cart' : 'Request Book'}
          </button>
        </div>
        
        <div className="book-seller">
          <small>Seller: {book.seller || 'Unknown'}</small>
        </div>
      </div>
    </div>
  );
};

export default BookCard;