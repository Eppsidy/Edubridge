import { supabase } from '../lib/supabaseClient';

/**
 * Service for managing shopping cart
 * This centralizes all cart-related operations and standardizes data handling
 */
export const cartService = {
  /**
   * Get cart items for a user
   * @param {string} profileId - User's profile ID
   * @returns {Promise<Array>} - Cart items with book details
   */
  async getCartItems(profileId) {
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    try {
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
        .eq('user_id', profileId);

      if (error) throw error;

      // Transform data to standardize structure
      const transformedItems = (data || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        book: {
          ...item.books,
          seller: item.books?.profiles ? 
            item.books.profiles.full_name : 
            'Unknown Seller',
          sellerCourse: item.books?.profiles?.course_of_study || 'Unknown Course',
          course: item.books?.categories?.name || 'Other',
          // Standardize price field
          price: item.books?.selling_price || 0
        }
      }));

      return transformedItems;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  /**
   * Add a book to cart
   * @param {string} profileId - User's profile ID
   * @param {string} bookId - Book ID
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise<Object>} - Added cart item
   */
  async addToCart(profileId, bookId, quantity = 1) {
    if (!profileId) {
      throw new Error('Profile ID is required');
    }
    if (!bookId) {
      throw new Error('Book ID is required');
    }

    try {
      // Check if book is already in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', profileId)
        .eq('book_id', bookId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;

      if (existingItem) {
        // Update quantity if already in cart
        const newQuantity = existingItem.quantity + quantity;
        const { data, error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Add new item to cart
        const { data, error } = await supabase
          .from('cart')
          .insert([{
            user_id: profileId,
            book_id: bookId,
            quantity
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Update cart item quantity
   * @param {string} cartId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} - Updated cart item
   */
  async updateQuantity(cartId, quantity) {
    if (!cartId) {
      throw new Error('Cart ID is required');
    }
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    try {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  /**
   * Remove an item from cart
   * @param {string} cartId - Cart item ID
   * @returns {Promise<void>}
   */
  async removeFromCart(cartId) {
    if (!cartId) {
      throw new Error('Cart ID is required');
    }

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * Clear all items from a user's cart
   * @param {string} profileId - User's profile ID
   * @returns {Promise<void>}
   */
  async clearCart(profileId) {
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', profileId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  /**
   * Process checkout
   * @param {string} profileId - User's profile ID
   * @param {number} totalAmount - Total order amount
   * @returns {Promise<Object>} - Order details
   */
  async checkout(profileId, totalAmount) {
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    // Start a transaction using Supabase's RPC function
    // Note: This requires a custom RPC function to be set up in Supabase
    // For now, we'll simulate a transaction with multiple operations

    try {
      // 1. Get cart items
      const cartItems = await this.getCartItems(profileId);
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // 2. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: profileId,
          total_amount: totalAmount,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        book_id: item.book.id,
        quantity: item.quantity,
        price: item.book.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Update book availability status
      // This could be done with a batch operation or trigger in Supabase
      for (const item of cartItems) {
        const { error: updateError } = await supabase
          .from('books')
          .update({ availability_status: 'Sold' })
          .eq('id', item.book.id);

        if (updateError) throw updateError;
      }

      // 5. Clear cart
      await this.clearCart(profileId);

      // 6. Create purchase records
      const purchases = cartItems.map(item => ({
        buyer_id: profileId,
        book_id: item.book.id,
        amount: item.book.price,
        order_id: order.id
      }));

      const { error: purchasesError } = await supabase
        .from('purchases')
        .insert(purchases);

      // If purchases table doesn't exist, ignore the error
      if (purchasesError && purchasesError.code !== '42P01') {
        throw purchasesError;
      }

      return {
        order,
        items: orderItems.length
      };
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
};