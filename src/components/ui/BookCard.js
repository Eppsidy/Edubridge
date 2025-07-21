import React from 'react';
import { BookOpen } from 'lucide-react';
import '../../styles/components/ui/BookCard.css';

const BookCard = ({ book, onBuyNow }) => (
  <div className="book-card">
    <div className="book-image">
      <div className="book-placeholder">
        <BookOpen size={40} color="#9ca3af" />
        <div className="book-title-small">{book.title}</div>
      </div>
    </div>
    <div className="book-title">{book.title}</div>
    <div className="book-author">by {book.author}</div>
    <div className="book-details">
      <div className="book-price">
        {(book.selling_price || book.price) != null 
          ? `R${(book.selling_price || book.price).toFixed(2)}` 
          : 'Price not set'
        }
      </div>
      <div className="book-condition">{book.condition_rating}</div>
    </div>
    <div className="book-seller">
      Sold by: {book.seller} ({book.sellerCourse})
    </div>
    <div className="book-actions">
      <button className="btn btn-primary" onClick={() => onBuyNow(book)}>
        Buy Now
      </button>
    </div>
  </div>
);

export default BookCard;
