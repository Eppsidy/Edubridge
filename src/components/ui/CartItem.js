import React from 'react';
import { Plus, Minus, Trash2, BookOpen } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { book, quantity } = item;

  // Get the correct price from either selling_price or price
  const bookPrice = book.selling_price || book.price || 0;

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
      <div className="cart-item">
        <div className="item-image">
          {book.thumbnail_url ? (
              <>
                <img
                    src={book.thumbnail_url}
                    alt={book.title}
                    className="book-thumbnail"
                    onError={handleImageError}
                />
                <div className="book-placeholder-fallback" style={{display: 'none'}}>
                  <BookOpen size={40} color="#9ca3af" />
                </div>
              </>
          ) : (
              <div className="book-placeholder">
                <BookOpen size={40} color="#9ca3af" />
              </div>
          )}
        </div>
        <div className="item-details">
          <div className="item-title">{book.title}</div>
          <div className="item-author">by {book.author}</div>
          <div className="item-seller">
            Sold by: {book.seller} ({book.sellerCourse})
          </div>
          <div className="item-actions">
            <div className="quantity-control">
              <button
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input
                  type="text"
                  className="quantity-input"
                  value={quantity}
                  readOnly
              />
              <button
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  disabled={true}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="item-price">
              R{bookPrice.toFixed(2)}
            </div>
            <button
                className="remove-btn"
                onClick={() => onRemove(item.id)}
                title="Remove from cart"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
  );
};

export default CartItem;