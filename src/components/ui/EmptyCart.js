import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCart = () => (
  <div className="cart-empty">
    <div className="cart-empty-icon">
      <ShoppingCart size={80} color="#9ca3af" />
    </div>
    <div className="cart-empty-title">Your cart is empty</div>
    <div className="cart-empty-text">
      Start adding some textbooks to get the best deals!
    </div>
    <Link to="/textbookmarket" className="checkout-btn">
      Browse Textbooks
    </Link>
  </div>
);

export default EmptyCart;
