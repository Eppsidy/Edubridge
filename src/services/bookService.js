import { supabase } from '../lib/supabaseClient';

export const bookService = {
  /**
   * Get available books with pagination and filtering
   */
  async getAvailableBooks({ page = 1, pageSize = 12, searchTerm = '', courseFilter = 'All Courses' }) {
    try {
      let query = supabase
          .from('books')
          .select(`
          *,
          categories:category_id (
            name
          ),
          seller_profile:seller_id (
            full_name,
            course_of_study,
            email
          )
        `, { count: 'exact' })
          .eq('availability_status', 'Available');

      // Apply search filter
      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply course filter
      if (courseFilter !== 'All Courses') {
        const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', courseFilter)
            .single();

        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
          .range(from, to)
          .order('created_at', { ascending: false });

      const { data: books, error, count } = await query;

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log('Raw books data from database:', books); // Debug log

      // Transform the data to match the expected format
      const transformedBooks = (books || []).map(book => {
        console.log('Processing book:', book.title, 'Seller profile:', book.seller_profile); // Debug log

        return {
          ...book,
          course: book.categories?.name || 'Other',
          seller: book.seller_profile?.full_name ||
              book.seller_profile?.email?.split('@')[0] ||
              'Unknown Seller',
          sellerCourse: book.seller_profile?.course_of_study || 'Unknown Course',
          price: book.selling_price || 0,
          thumbnail_url: book.thumbnail_url
        };
      });

      console.log('Transformed books:', transformedBooks); // Debug log

      return {
        books: transformedBooks,
        pagination: {
          page,
          pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }
};
