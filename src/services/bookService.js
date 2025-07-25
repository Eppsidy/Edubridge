import { supabase } from '../lib/supabaseClient';

/**
 * Service for managing books
 * This centralizes all book-related operations and standardizes data handling
 */
export const bookService = {
  /**
   * Get all available books with pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.pageSize - Number of items per page
   * @param {string} options.searchTerm - Search term for filtering
   * @param {string} options.courseFilter - Course/category filter
   * @returns {Promise<Object>} - Books data with pagination info
   */
  async getAvailableBooks({ page = 1, pageSize = 10, searchTerm = '', courseFilter = null } = {}) {
    try {
      // Calculate pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Start building the query
      let query = supabase
        .from('books')
        .select(`
          *,
          profiles:seller_id (
            full_name,
            course_of_study
          ),
          categories:category_id (
            name
          )
        `, { count: 'exact' })
        .eq('availability_status', 'Available')
        .order('created_at', { ascending: false })
        .range(from, to);

      // Add search filter if provided
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,isbn.ilike.%${searchTerm}%`
        );
      }

      // Add course/category filter if provided
      if (courseFilter && courseFilter !== 'All Courses') {
        query = query.eq('categories.name', courseFilter);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform the data to standardize the structure
      const transformedBooks = (data || []).map(book => ({
        ...book,
        seller: book.profiles ? book.profiles.full_name : 'Unknown Seller',
        sellerCourse: book.profiles?.course_of_study || 'Unknown Course',
        course: book.categories?.name || 'Other',
        // Standardize price field
        price: book.selling_price || 0
      }));

      return {
        books: transformedBooks,
        pagination: {
          page,
          pageSize,
          totalItems: count,
          totalPages: Math.ceil(count / pageSize)
        }
      };
    } catch (error) {
      console.error('Error fetching available books:', error);
      throw error;
    }
  },

  /**
   * Get books by seller ID with pagination
   * @param {string} sellerId - Seller's user ID (UUID from auth, not profile ID)
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.pageSize - Number of items per page
   * @returns {Promise<Object>} - Books data with pagination info
   */
  async getBooksBySeller(sellerId, { page = 1, pageSize = 10 } = {}) {
    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    try {
      // Calculate pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
          .from('books')
          .select(`
        *,
        categories:category_id (
          name
        )
      `, { count: 'exact' })
          .eq('seller_id', sellerId) // This should be the user.id (UUID)
          .order('created_at', { ascending: false })
          .range(from, to);

      if (error) throw error;

      // Transform the data to standardize the structure
      const transformedBooks = (data || []).map(book => ({
        ...book,
        course: book.categories?.name || 'Other',
        // Standardize price field
        price: book.selling_price || 0,
        listingType: book.selling_price === 0 ? 'donate' : 'sell',
        status: book.availability_status?.toLowerCase() || 'available'
      }));

      return {
        books: transformedBooks,
        pagination: {
          page,
          pageSize,
          totalItems: count,
          totalPages: Math.ceil(count / pageSize)
        }
      };
    } catch (error) {
      console.error('Error fetching books by seller:', error);
      throw error;
    }
  },

  /**
   * Create a new book listing
   * @param {Object} bookData - Book data
   * @param {string} sellerId - Seller's profile ID
   * @returns {Promise<Object>} - Created book
   */
  async createBook(bookData, sellerId) {
    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    try {
      // Standardize the book data
      const standardizedData = {
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        isbn: bookData.isbn?.trim() || null,
        edition: bookData.edition?.trim() || null,
        publisher: bookData.publisher?.trim() || null,
        publication_year: bookData.publication_year ? parseInt(bookData.publication_year) : null,
        category_id: bookData.category_id ? parseInt(bookData.category_id) : null,
        seller_id: sellerId,
        selling_price: bookData.listingType === 'sell' ? parseFloat(bookData.selling_price) : 0,
        condition_rating: bookData.condition_rating || 'Good',
        description: bookData.description?.trim() || null,
        availability_status: 'Available'
      };

      const { data, error } = await supabase
        .from('books')
        .insert([standardizedData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  /**
   * Update an existing book
   * @param {string} bookId - Book ID
   * @param {Object} bookData - Updated book data
   * @returns {Promise<Object>} - Updated book
   */
  async updateBook(bookId, bookData) {
    if (!bookId) {
      throw new Error('Book ID is required');
    }

    try {
      // Standardize the book data
      const standardizedData = {
        title: bookData.title?.trim(),
        author: bookData.author?.trim(),
        isbn: bookData.isbn?.trim() || null,
        edition: bookData.edition?.trim() || null,
        publisher: bookData.publisher?.trim() || null,
        publication_year: bookData.publication_year ? parseInt(bookData.publication_year) : null,
        category_id: bookData.category_id ? parseInt(bookData.category_id) : null,
        selling_price: bookData.listingType === 'sell' ? parseFloat(bookData.selling_price) : 0,
        condition_rating: bookData.condition_rating || 'Good',
        description: bookData.description?.trim() || null
      };

      // Remove undefined fields
      Object.keys(standardizedData).forEach(key => 
        standardizedData[key] === undefined && delete standardizedData[key]
      );

      const { data, error } = await supabase
        .from('books')
        .update(standardizedData)
        .eq('id', bookId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  /**
   * Delete a book
   * @param {string} bookId - Book ID
   * @returns {Promise<void>}
   */
  async deleteBook(bookId) {
    if (!bookId) {
      throw new Error('Book ID is required');
    }

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  /**
   * Get all categories
   * @returns {Promise<Array>} - Categories
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Ensure default categories exist
   * This should be called once during app initialization
   * @returns {Promise<Array>} - Categories
   */
  async ensureDefaultCategories() {
    try {
      // Default categories
      const defaultCategories = [
        'Computer Science',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Engineering',
        'Business',
        'Psychology',
        'History',
        'Literature',
        'Economics',
        'Other'
      ];

      // Check if categories exist
      const { data: existingCategories, error: fetchError } = await supabase
        .from('categories')
        .select('*');

      if (fetchError) throw fetchError;

      // If no categories exist, create them
      if (!existingCategories || existingCategories.length === 0) {
        const { data, error: insertError } = await supabase
          .from('categories')
          .insert(
            defaultCategories.map(name => ({ name }))
          )
          .select();

        if (insertError) throw insertError;
        return data;
      }

      return existingCategories;
    } catch (error) {
      console.error('Error ensuring default categories:', error);
      throw error;
    }
  }
};