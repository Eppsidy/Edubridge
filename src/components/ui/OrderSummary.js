import React, { useState } from 'react';

const OrderSummary = ({ cartItems, onCheckout }) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.book.selling_price || item.book.price || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const studentDiscount = subtotal * 0.1; // 10% student discount
  const total = subtotal - studentDiscount;
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  const handlePromoCode = () => {
    if (promoCode.trim().toLowerCase() === 'student20') {
      setPromoApplied(true);
      alert('Promo code applied! Additional 20% off');
    } else if (promoCode.trim()) {
      alert('Invalid promo code');
    }
  };

  const finalTotal = promoApplied ? total * 0.8 : total;

  return (
    <div className="summary-section">
      <h2 className="summary-title">Order Summary</h2>
      
      <div className="summary-line">
        <span className="summary-label">Subtotal ({cartItems.length} items)</span>
        <span className="summary-value">R{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="summary-line">
        <span className="summary-label">Student Discount (10%)</span>
        <span className="summary-value" style={{ color: '#10b981' }}>
          -R{studentDiscount.toFixed(2)}
        </span>
      </div>
      
      {promoApplied && (
        <div className="summary-line">
          <span className="summary-label">Promo Code (20%)</span>
          <span className="summary-value" style={{ color: '#10b981' }}>
            -R{(total * 0.2).toFixed(2)}
          </span>
        </div>
      )}
      
      <div className="promo-section">
        <label htmlFor="promoCode" style={{ fontWeight: 600, color: '#374151' }}>
          Promo Code
        </label>
        <div className="promo-input">
          <input
            type="text"
            className="promo-field"
            id="promoCode"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button className="promo-btn" onClick={handlePromoCode}>
            Apply
          </button>
        </div>
      </div>

      <div className="summary-line total">
        <span className="summary-label">Total</span>
        <span className="summary-value total">R{finalTotal.toFixed(2)}</span>
      </div>

      <button 
        className="checkout-btn"
        onClick={() => onCheckout(finalTotal)}
        disabled={cartItems.length === 0}
      >
        Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
