import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, BookOpen, DollarSign } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/Cart.css';

const Header = ({ session }) => {
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  return (
    <header className="header">
      <div className="left-content">
        <div className="logo-icon">EB</div>
        <div className="logo-text">EDUBRIDGE</div>
      </div>
      <div className="right-content">
        {userName && (
          <div className="user-info">
            Welcome, {userName}!
          </div>
        )}
      </div>
    </header>
  );
};

const Navigation = ({ activeTab }) => {
  return (
    <nav className="nav-tabs">
      <Link to="/home">Home</Link>
      <Link to="/userdashboard">Dashboard</Link>
      <Link to="/textbookmarket">Textbook Market</Link>
      <Link to="/cart" className="active">
        <ShoppingCart size={16} />
        Cart
      </Link>
      <Link to="/sale">
        <DollarSign size={16} />
        Sale
      </Link>
    </nav>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { book, quantity } = item;
  
  // Get the correct price from either selling_price or price
  const bookPrice = book.selling_price || book.price || 0;
  
  return (
    <div className="cart-item">
      <div className="item-image">
        <div className="book-placeholder">
          <BookOpen size={40} color="#9ca3af" />
        </div>
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

const ShoppingCartPage = ({ session }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items from database
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First get the user's profile ID
        let userProfile;
        const { data: existingProfile, error: profileError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (existingProfile) {
          userProfile = existingProfile;
        } else {
          // Create user profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([{
              auth_id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              last_name: '',
              course_of_study: 'Not specified'
            }])
            .select('id')
            .single();

          if (createError) throw createError;
          userProfile = newProfile;
        }

        // Then fetch cart items using the profile ID
        const { data, error } = await supabase
          .from('cart')
          .select(`
            *,
            books:book_id (
              *,
              users:seller_id (
                first_name,
                last_name,
                course_of_study
              ),
              categories:category_id (
                name
              )
            )
          `)
          .eq('user_id', userProfile.id);

        if (error) throw error;

        // Transform data to match component structure
        const transformedItems = (data || []).map(item => ({
          id: item.id,
          quantity: item.quantity,
          book: {
            ...item.books,
            seller: item.books?.users ? 
              `${item.books.users.first_name} ${item.books.users.last_name}` : 
              'Unknown Seller',
            sellerCourse: item.books?.users?.course_of_study || 'Unknown Course',
            course: item.books?.categories?.name || 'Other'
          }
        }));

        setCartItems(transformedItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items. Please try again.');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session]);

  const handleUpdateQuantity = async (cartId, change) => {
    try {
      const item = cartItems.find(item => item.id === cartId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;

      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', cartId);

      if (error) throw error;

      setCartItems(prev => 
        prev.map(item => 
          item.id === cartId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (cartId) => {
    if (!window.confirm('Remove this item from your cart?')) return;

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.id !== cartId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item. Please try again.');
    }
  };

  const handleCheckout = async (totalAmount) => {
    if (!session) {
      alert('Please log in to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    try {
      // Get user profile ID first
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      if (!userProfile) {
        alert('User profile not found. Please complete your profile first.');
        navigate('/userdashboard');
        return;
      }

      // Create order record with profile ID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userProfile.id,  // Use profile ID
          total_amount: totalAmount,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        book_id: item.book.id,
        quantity: item.quantity,
        price: item.book.selling_price || item.book.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart using profile ID
      const { error: clearError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userProfile.id);  // Use profile ID

      if (clearError) throw clearError;

      alert('Order placed successfully!');
      navigate('/userdashboard');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Error processing checkout. Please try again.');
    }
  };

  if (!session) {
    return (
      <div className="textbook-market">
        <Header session={session} />
        <Navigation activeTab="cart" />
        <main className="main-content">
          <div className="content-card">
            <p>Please log in to view your cart.</p>
            <a href="/login" className="btn btn-primary">Login</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="textbook-market">
      <Header session={session} />
      <Navigation activeTab="cart" />
      
      <main className="main-content">
        <div className="content-container" style={{ 
          display: 'flex', 
          gap: '2rem', 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '2rem'
        }}>
          <div className="cart-section" style={{ flex: '2' }}>
            <div className="page-header">
              <h1 className="page-title">Shopping Cart</h1>
              <div className="cart-count">{cartItems.length} items</div>
            </div>

            {error && (
              <div className="error-message" style={{ 
                color: '#ef4444', 
                background: '#fef2f2', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading">Loading cart...</div>
            ) : cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
                
                <a href="/textbookmarket" className="continue-shopping">
                  ← Continue Shopping
                </a>
              </>
            )}
          </div>

          <div style={{ flex: '1' }}>
            <OrderSummary 
              cartItems={cartItems} 
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>

      <div className="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
      </div>
    </div>
  );
};

export default ShoppingCartPage;