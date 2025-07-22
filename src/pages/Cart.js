import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import CartItem from '../components/ui/CartItem';
import OrderSummary from '../components/ui/OrderSummary';
import EmptyCart from '../components/ui/EmptyCart';
import Footer from '../components/layout/Footer';
import '../styles/Cart.css';

// Component code has been moved to separate files

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
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (existingProfile) {
          userProfile = existingProfile;
        } else {
          // Create user profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              user_id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
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
              profiles:seller_id (
                full_name,
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
            seller: item.books?.profiles ? 
              item.books.profiles.full_name : 
              'Unknown Seller',
            sellerCourse: item.books?.profiles?.course_of_study || 'Unknown Course',
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
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
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
        <Navigation activeTab="Cart" />
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
      <Navigation activeTab="Cart" />
      
      <main className="main-content">
        <div className="content-container">
          <div className="cart-section">
            <div className="page-header">
              <h1 className="page-title">Shopping Cart</h1>
              <div className="cart-count">{cartItems.length} items</div>
            </div>

            {error && (
              <div className="error-message">
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
                
                {/* Replace this line in the main component */}
                <Link to="/textbookmarket" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </>
            )}
          </div>

          <div className="summary-container">
            <OrderSummary 
              cartItems={cartItems} 
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShoppingCartPage;