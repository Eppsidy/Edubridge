import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Search, Plus, ShoppingCart, User, Home, BookOpen, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import '../styles/TextbookMarket.css';

// Define courses array
const courses = [
  'All Courses',
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

const Navigation = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    const routes = {
      'home': '/home',
      'dashboard': '/userdashboard',
      'market': '/market',
      'cart': '/cart',
      'sale': '/sale'
    };
    
    const route = routes[page];
    if (route) {
      navigate(route);
    }
  };

  return (
    <nav className="nav-tabs">
      <Link to="/home">Home</Link>
      <Link to="/userdashboard">Dashboard</Link>
      <Link to="/textbookmarket" className="active">Textbook Market</Link>
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); navigateTo('cart'); }} 
        className={activeTab === 'cart' ? 'active' : ''}
      >
        <ShoppingCart size={16} />
        Cart
      </a>
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); navigateTo('sale'); }} 
        className={activeTab === 'sale' ? 'active' : ''}
      >
        <DollarSign size={16} />
        Sale
      </a>
    </nav>
  );
};

const SearchFilters = ({ searchTerm, setSearchTerm, selectedCourse, setSelectedCourse }) => (
  <div className="search-filters">
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, author, or ISBN..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <select 
      className="filter-select"
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.target.value)}
    >
      {courses.map(course => (
        <option key={course} value={course}>{course}</option>
      ))}
    </select>
  </div>
);

const BookCard = ({ book, onBuyNow }) => (
  <div className="book-card">
    <div className="book-image">
      <div className="book-placeholder">
        <BookOpen size={40} color="#9ca3af" />
        <div className="book-title-small">{book.title}</div>
      </div>
    </div>
    <div className="book-title">{book.title}</div>
    <div className="book-author">by {book.author}</div>
    <div className="book-details">
      <div className="book-price"> {book.price != null ? `R${book.price.toFixed(2)}` : 'Price not set'} </div>
      <div className="book-condition">{book.condition}</div>
    </div>
    <div className="book-seller">
      Sold by: {book.seller} ({book.sellerCourse})
    </div>
    <div className="book-actions">
      <button className="btn btn-primary" onClick={() => onBuyNow(book)}>
        Buy Now
      </button>
    </div>
  </div>
);

const QuickStats = ({ books }) => {
  const totalBooks = books.length;
  const avgPrice = totalBooks > 0 ? books.reduce((sum, book) => sum + book.price, 0) / totalBooks : 0;
  const uniqueCourses = new Set(books.map(book => book.course)).size;
  const activeSellers = new Set(books.map(book => book.seller)).size;

  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-number">{totalBooks}</div>
        <div className="stat-label">Books Available</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">R{avgPrice.toFixed(0)}</div>
        <div className="stat-label">Average Price</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{uniqueCourses}</div>
        <div className="stat-label">Courses</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{activeSellers}</div>
        <div className="stat-label">Active Sellers</div>
      </div>
    </div>
  );
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
          course: book.categories?.name || 'Other'
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
      // Check if book is already in cart
      const { data: existingCart, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('book_id', book.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCart) {
        alert('This book is already in your cart!');
        navigate('/cart');
        return;
      }

      // Add to cart
      const { error } = await supabase
        .from('cart')
        .insert([
          {
            user_id: session.user.id,
            book_id: book.id,
            quantity: 1
          }
        ]);

      if (error) throw error;

      alert(`${book.title} added to cart!`);
      navigate('/cart');
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
      <Header session={session} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
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

      <div className="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
      </div>
    </div>
  );
};

export default TextbookMarket;