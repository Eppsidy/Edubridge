import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { bookService } from '../services/bookService';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSidebar from '../components/sections/dashboard/DashboardSidebar';
import DashboardStats from '../components/sections/dashboard/DashboardStats';
import DashboardContent from '../components/sections/dashboard/DashboardContent';

const UserDashboard = ({ session }) => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  // Add state for manual refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Define refreshData function using useCallback to avoid temporal dead zone issues
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Check for session on component mount
  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  // Get user info from session
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  // Fetch user statistics and data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get or create user profile using profileService
        const userProfile = await profileService.getOrCreateProfile(user);
        
        if (!userProfile) {
          throw new Error('Failed to get or create user profile');
        }

        // Use userProfile.id (integer) to fetch books - this matches the foreign key relationship
        const { data: userBooks, error: booksError } = await supabase
          .from('books')
          .select(`
        *,
        categories:category_id (
          name
        )
      `)
        .eq('seller_id', userProfile.id) // Use userProfile.id instead of user.id
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      // Transform the data to match the expected format
      const transformedBooks = (userBooks || []).map(book => ({
        ...book,
        course: book.categories?.name || 'Other',
        price: book.selling_price || 0,
        listingType: book.selling_price === 0 ? 'donate' : 'sell',
        status: book.availability_status?.toLowerCase() || 'available'
      }));
    
      setUserBooks(transformedBooks);

      // Rest of the function remains the same...
        // Fetch user's purchases (using userProfile.id since purchases likely use profile ID)
        const { data: purchases, error: purchasesError } = await supabase
          .from('purchases')
          .select(`
          *,
          books:book_id (
            title,
            author,
            selling_price
          )
        `)
          .eq('buyer_id', userProfile.id) // This might still use profile ID
          .order('created_at', { ascending: false });

        if (purchasesError && purchasesError.code !== '42P01') {
          // Table might not exist yet
          console.warn('Purchases table not found:', purchasesError);
        }
        setUserPurchases(purchases || []);

        // Calculate statistics using the transformed books
        const availableBooks = transformedBooks.filter(book => 
          book.status === 'available' || book.availability_status === 'Available');
        const soldBooks = transformedBooks.filter(book => 
          book.status === 'sold' || book.availability_status === 'Sold');
        const totalEarnings = soldBooks.reduce((sum, book) => 
          sum + (book.price || book.selling_price || 0), 0);
        const totalSpent = purchases?.reduce((sum, purchase) => 
          sum + (purchase.amount || 0), 0) || 0;

        setUserStats({
          textbooksListed: availableBooks.length,
          textbooksPurchased: purchases?.length || 0,
          booksSold: soldBooks.length,
          booksBought: purchases?.length || 0,
          totalEarnings: totalEarnings,
          totalSpent: totalSpent
        });

        // Clear the book added flag after refreshing data
        if (localStorage.getItem('edubridge_book_added') === 'true') {
          localStorage.removeItem('edubridge_book_added');
          localStorage.removeItem('edubridge_book_added_timestamp');
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, refreshTrigger]); // Add refreshTrigger to dependencies
  
  // Check for book added flag when component mounts
  useEffect(() => {
    if (localStorage.getItem('edubridge_book_added') === 'true') {
      // Trigger a refresh if a book was recently added
      refreshData();
    }
  }, [refreshData]);


  // Listen for focus events to refresh data when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshData]);

  // Rest of your component code remains the same...
  // Add a refresh button to the UI if needed
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading your dashboard...</div>;
    }

    switch (activeSection) {
      case 'profile':
        return (
          <div className="section-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Profile Information</h3>
              <button 
                onClick={refreshData}
                style={{ 
                  padding: '0.5rem 1rem', 
                  background: '#008080', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Refresh Data
              </button>
            </div>
            <div className="profile-info">
              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Email:</strong> {userEmail}</p>
              <p><strong>Member Since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        );
      
      case 'textbooks':
        return (
          <div className="section-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>My Listed Textbooks</h3>
              <button 
                onClick={refreshData}
                style={{ 
                  padding: '0.5rem 1rem', 
                  background: '#008080', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Refresh
              </button>
            </div>
            {userBooks.length === 0 ? (
              <p>You haven't listed any textbooks yet.</p>
            ) : (
              <div className="books-list">
                {userBooks.map(book => (
                  <div key={book.id} className="book-item">
                    <h4>{book.title}</h4>
                    <p>by {book.author}</p>
                    <p><strong>Price:</strong> R{(book.price || book.selling_price || 0).toFixed(2)}</p>
                    <p><strong>Condition:</strong> {book.condition_rating}</p>
                    <p><strong>Status:</strong> {book.status || book.availability_status}</p>
                    <p><strong>Category:</strong> {book.course || book.categories?.name || 'Uncategorized'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      // Rest of your cases remain the same...
      case 'purchases':
        return (
          <div className="section-content">
            <h3>My Purchases</h3>
            {userPurchases.length === 0 ? (
              <p>You haven't made any purchases yet.</p>
            ) : (
              <div className="purchases-list">
                {userPurchases.map(purchase => (
                  <div key={purchase.id} className="purchase-item">
                    <h4>{purchase.books?.title}</h4>
                    <p>by {purchase.books?.author}</p>
                    <p><strong>Price:</strong> R{purchase.amount?.toFixed(2)}</p>
                    <p><strong>Date:</strong> {new Date(purchase.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="section-content">
            <h3>Settings</h3>
            <p>Settings functionality coming soon!</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Rest of your component remains the same...
  const onLogout = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const [activeSection, setActiveSection] = useState('profile');
  const [userStats, setUserStats] = useState({
    textbooksListed: 0,
    textbooksPurchased: 0,
    booksSold: 0,
    booksBought: 0,
    totalEarnings: 0,
    totalSpent: 0
  });
  const [userBooks, setUserBooks] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  const handleCardHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    } else {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
    }
  };

  const navigateTo = (page) => {
    const routes = {
      'Home': '/home',
      'User Dashboard': '/userdashboard',
      'Textbook Market': '/textbookmarket',
      'Add New Book': '/sale',
      'Cart': '/cart'
    };
    
    const route = routes[page];
    if (route) {
      navigate(route);
    }
  };

  return (
    <DashboardLayout userName={userName} onLogout={onLogout}>
      <div className="main-container">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSidebarClick} 
        />

        <main className="main-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Welcome back{userName ? `, ${userName}` : ''}!</h2>
              <p>Ready to continue your learning journey? Check out your latest activity below.</p>
            </div>
            <div className="logout-link" onClick={onLogout}>
              LOGOUT
            </div>
          </div>
          
          {error && (
            <div className="error-message" style={{ 
              color: 'red', 
              margin: '10px 0', 
              padding: '10px', 
              backgroundColor: '#ffeeee', 
              borderRadius: '4px', 
              textAlign: 'center' 
            }}>
              {error}
              <button 
                onClick={() => setError(null)} 
                style={{ 
                  marginLeft: '10px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontWeight: 'bold' 
                }}
              >
                ✕
              </button>
            </div>
          )}

          {activeSection === 'profile' ? (
            <DashboardStats 
              stats={userStats}
              onCardHover={handleCardHover}
              onNavigate={(target) => {
                if (target === 'textbooks' || target === 'purchases') {
                  handleSidebarClick(target);
                } else {
                  navigateTo(target);
                }
              }}
            />
          ) : (
            <DashboardContent
              activeSection={activeSection}
              userProfile={{
                name: userName,
                email: userEmail,
                createdAt: user?.created_at
              }}
              userBooks={userBooks}
              userPurchases={userPurchases}
              loading={loading}
            />
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;