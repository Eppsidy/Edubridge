import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Navigation from '../components/layout/Navigation';
import SearchFilters from '../components/common/SearchFilters';
import BookCard from '../components/ui/BookCard';
import QuickStats from '../components/sections/dashboard/QuickStats';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { bookService } from '../services/bookService';
import { cartService } from '../services/cartService';
import '../styles/TextbookMarket.css';

const getUserName = (session) => {
  const user = session?.user;
  const userEmail = user?.email;
  return user?.user_metadata?.full_name || userEmail?.split('@')[0];
};

const TextbookMarket = ({ session }) => {
  // State variables
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 0
  });
  
  const navigate = useNavigate();
  const { isAnonymousUser, checkProtectedAccess } = useAuth();

  // Fetch books from service with pagination
  const fetchBooks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await bookService.getAvailableBooks({
        page,
        pageSize: 12,
        searchTerm,
        courseFilter: selectedCourse
      });

      setBooks(result.books);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCourse]);

  // Initial load and when filters change
  useEffect(() => {
    fetchBooks(1);
    setCurrentPage(1);
  }, [fetchBooks]);
  
  // Check for book added flag when component mounts
  useEffect(() => {
    if (localStorage.getItem('edubridge_book_added') === 'true') {
      // Refresh books if a book was recently added
      fetchBooks(currentPage);
    }
  }, [fetchBooks, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchBooks(newPage);
    window.scrollTo(0, 0);
  };

  // Memoized stats to prevent unnecessary recalculations
  const bookStats = useMemo(() => {
    return {
      totalBooks: pagination.totalItems,
      averagePrice: books.length 
        ? (books.reduce((sum, book) => sum + book.price, 0) / books.length).toFixed(2)
        : 0,
      categories: [...new Set(books.map(book => book.course))].length
    };
  }, [books, pagination.totalItems]);

  /**
   * Add to cart handler with authentication check
   * Redirects anonymous users to login with context
   */
  const handleBuyNow = useCallback(async (book) => {
    // Check if user can access this protected feature
    if (!checkProtectedAccess(session, 'Book Purchase')) {
      return; // checkProtectedAccess handles the redirect
    }

    try {
      // Get or create user profile
      const userProfile = await profileService.getOrCreateProfile(session.user);
      
      if (!userProfile) {
        alert('User profile not found. Please complete your profile first.');
        navigate('/userdashboard');
        return;
      }

      // Add to cart using cart service
      await cartService.addToCart(userProfile.id, book.id);

      const goToCart = window.confirm(`${book.title} added to cart! Would you like to view your cart?`);
      if (goToCart) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding book to cart. Please try again.');
    }
  }, [session, navigate, checkProtectedAccess]);

  /**
   * Handle sell book action with authentication check
   * Redirects anonymous users to login with context
   */
  const handleSellBook = useCallback(() => {
    // Check if user can access this protected feature
    if (!checkProtectedAccess(session, 'Book Listing')) {
      return; // checkProtectedAccess handles the redirect
    }
    
    navigate('/sale');
  }, [session, navigate, checkProtectedAccess]);

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

          <QuickStats books={books} stats={bookStats} />

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
              {books.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}

          {books.length === 0 && !loading && !error && (
            <div className="no-results">
              <p>No books found matching your criteria.</p>
              <p>Try adjusting your search terms or browse all courses.</p>
            </div>
          )}

          {/* Pagination UI */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="pagination-button"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages || loading}
                className="pagination-button"
              >
                Next
              </button>
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