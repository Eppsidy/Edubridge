import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Navigation from '../components/layout/Navigation';
import SearchFilters from '../components/common/SearchFilters';
import BookCard from '../components/ui/BookCard';
import QuickStats from '../components/sections/dashboard/QuickStats';
import '../styles/TextbookMarket.css';

const getUserName = (session) => {
  const user = session?.user;
  const userEmail = user?.email;
  return user?.user_metadata?.full_name || userEmail?.split('@')[0];
};

const TextbookMarket = ({ session }) => {
  const [activeTab, setActiveTab] = useState('textbookmarket');
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch books from Supabase
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('books')
          .select(`
            *,
            users:seller_id (
              first_name,
              last_name,
              course_of_study
            ),
            categories:category_id (
              name
            )
          `)
          .eq('availability_status', 'Available')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the expected structure
        const transformedBooks = (data || []).map(book => ({
          ...book,
          seller: book.users ? `${book.users.first_name} ${book.users.last_name}` : 'Unknown Seller',
          sellerCourse: book.users?.course_of_study || 'Unknown Course',
          course: book.categories?.name || 'Other',
          price: book.selling_price || book.price // Use either selling_price or price
        }));

        setBooks(transformedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search and course selection
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.isbn && book.isbn.includes(searchTerm));
    
    const matchesCourse = selectedCourse === 'All Courses' || book.course === selectedCourse;
    
    return matchesSearch && matchesCourse;
  });

  const handleBuyNow = async (book) => {
    if (!session) {
      alert('Please log in to purchase books');
      navigate('/login');
      return;
    }

    try {
      // Get the user's profile ID first
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

      // Check if book is already in cart
      const { data: existingCart, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userProfile.id)  // Use profile ID instead of auth ID
        .eq('book_id', book.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCart) {
        const goToCart = window.confirm('This book is already in your cart. Would you like to view your cart?');
        if (goToCart) {
          navigate('/cart');
        }
        return;
      }

      // Add to cart using the user's profile ID
      const { error: insertError } = await supabase
        .from('cart')
        .insert([
          {
            user_id: userProfile.id,  // Use profile ID instead of auth ID
            book_id: book.id,
            quantity: 1
          }
        ]);

      if (insertError) throw insertError;

      const goToCart = window.confirm(`${book.title} added to cart! Would you like to view your cart?`);
      if (goToCart) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding book to cart. Please try again.');
    }
  };

  const handleSellBook = () => {
    if (!session) {
      alert('Please log in to sell books');
      navigate('/login');
      return;
    }
    navigate('/sale');
  };

  return (
    <div className="textbook-market">
      <Header user={session?.user} userName={getUserName(session)} />
      <Navigation activeTab="Market" />
      
      <main className="main-content">
        <div className="content-card">
          <div className="page-header">
            <h1 className="page-title">Textbook Market</h1>
            <p className="page-subtitle">Buy and sell textbooks with fellow students</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <QuickStats books={filteredBooks} />

          <SearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />

          {loading ? (
            <div className="loading">Loading books...</div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}

          {filteredBooks.length === 0 && !loading && !error && (
            <div className="no-results">
              <p>No books found matching your criteria.</p>
              <p>Try adjusting your search terms or browse all courses.</p>
            </div>
          )}
        </div>
      </main>

      <button className="floating-action" onClick={handleSellBook} title="List a book for sale">
        <Plus size={24} />
      </button>

      <Footer/>

    </div>
  );
};

export default TextbookMarket;