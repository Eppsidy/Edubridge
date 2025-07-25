import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SaleForm from '../components/sale/SaleForm';
import ListingsGrid from '../components/sale/ListingsGrid';
import DeleteModal from '../components/sale/DeleteModal';
import '../styles/components/sale/index.css';
import '../styles/components/sale/BookCard.css';
import '../styles/components/sale/Layout.css';

/**
 * Sale page component for listing books
 * Protected feature that requires a non-anonymous user
 */
const EduBridgeSale = ({ session }) => {
  const navigate = useNavigate();
  const { isAnonymousUser, checkProtectedAccess } = useAuth();
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    edition: '',
    publisher: '',
    publication_year: '',
    category_id: '',
    selling_price: '',
    condition_rating: 'Good',
    description: '',
    listingType: 'sell'
  });
  
  // Check if user is allowed to access this page (non-anonymous users only)
  useEffect(() => {
    // This will redirect anonymous users to login with context
    checkProtectedAccess(session, 'Book Listing');
  }, [session, checkProtectedAccess]);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // First get the user's profile ID
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch books listed by this user
        const { data: userBooks, error: booksError } = await supabase
          .from('books')
          .select(`
            *,
            categories:category_id (
              name
            )
          `)
          .eq('seller_id', userProfile.id)
          .order('created_at', { ascending: false });

        if (booksError) throw booksError;

        setListings(userBooks.map(book => ({
          ...book,
          subject: book.categories?.name || 'Other',
          listingType: book.selling_price === 0 ? 'donate' : 'sell',
          status: book.availability_status.toLowerCase()
        })));
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load your listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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

        const { data: existingCategories, error: fetchError } = await supabase
          .from('categories')
          .select('*');

        if (fetchError) throw fetchError;

        if (!existingCategories || existingCategories.length === 0) {
          const { data, error: insertError } = await supabase
            .from('categories')
            .insert(
              defaultCategories.map(name => ({ name }))
            )
            .select();

          if (insertError) throw insertError;
          setCategories(data);
        } else {
          setCategories(existingCategories);
        }
      } catch (err) {
        console.error('Error with categories:', err);
        setError('Error loading categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission for listing a book
   * Validates form data and creates a new book listing
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    setLoading(true);

    try {
      // Check if user can access this protected feature
      if (!checkProtectedAccess(session, 'Book Listing')) {
        setLoading(false);
        return; // checkProtectedAccess handles the redirect
      }

      // Validate form data
      if (!formData.title.trim() || !formData.author.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.listingType === 'sell' && (!formData.selling_price || parseFloat(formData.selling_price) <= 0)) {
        throw new Error('Selling price must be greater than 0');
      }

      // Get or create user profile using profileService
      const userProfile = await profileService.getOrCreateProfile(user);
      
      if (!userProfile || !userProfile.id) {
        throw new Error('User profile not found. Please log in again.');
      }

      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || null,
        edition: formData.edition.trim() || null,
        publisher: formData.publisher.trim() || null,
        publication_year: formData.publication_year ? parseInt(formData.publication_year) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        seller_id: userProfile.id,
        selling_price: formData.listingType === 'sell' ? parseFloat(formData.selling_price) : 0,
        condition_rating: formData.condition_rating,
        description: formData.description.trim() || null,
        availability_status: 'Available'
      };

      if (editingIndex >= 0) {
        const { error: updateError } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', listings[editingIndex].id);

        if (updateError) throw updateError;
        
        const updatedListings = [...listings];
        updatedListings[editingIndex] = { ...bookData, id: listings[editingIndex].id };
        setListings(updatedListings);
        setEditingIndex(-1);
      } else {
        const { data: newBook, error: insertError } = await supabase
          .from('books')
          .insert([bookData])
          .select()
          .single();

        if (insertError) throw insertError;
        setListings([...listings, newBook]);
      }

      setSuccessMsg('Book listed successfully!');
      setFormData({
        title: '',
        author: '',
        isbn: '',
        edition: '',
        publisher: '',
        publication_year: '',
        category_id: '',
        selling_price: '',
        condition_rating: 'Good',
        description: '',
        listingType: 'sell'
      });
    } catch (err) {
      console.error('Error managing book:', err);
      setError(err.message || 'Error managing book listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const editListing = (index) => {
    const book = listings[index];
    setEditingIndex(index);
    setFormData({
      title: book.title,
      author: book.author,
      edition: book.edition || '',
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      publication_year: book.publication_year || '',
      category_id: book.category_id || '',
      selling_price: book.selling_price?.toString() || '',
      condition_rating: book.condition_rating || 'Good',
      description: book.description || '',
      listingType: book.listingType
    });
  };

  const showDeleteModalHandler = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteIndex(-1);
  };

  const confirmDelete = async () => {
    if (deleteIndex >= 0) {
      try {
        setLoading(true);
        const bookToDelete = listings[deleteIndex];
        
        const { error: deleteError } = await supabase
          .from('books')
          .delete()
          .eq('id', bookToDelete.id);

        if (deleteError) throw deleteError;

        const updatedListings = listings.filter((_, index) => index !== deleteIndex);
        setListings(updatedListings);
        setSuccessMsg('Book listing deleted successfully');
      } catch (err) {
        console.error('Error deleting book:', err);
        setError('Failed to delete book listing. Please try again.');
      } finally {
        setLoading(false);
        closeDeleteModal();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <Navigation activeTab="Sale" />

      <div className="sale-content-container">
        <div className="page-header">
          <h1 className="page-title">Sell Your Textbooks</h1>
          <p className="page-subtitle">Turn your unused textbooks into cash or help fellow students by donating</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}

        <div className="sale-main-content">
          <SaleForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            categories={categories}
            loading={loading}
            navigate={navigate}
            editingIndex={editingIndex}
          />

          <ListingsGrid
            listings={listings}
            onEdit={editListing}
            onDelete={showDeleteModalHandler}
          />
        </div>
      </div>

      <Footer />

      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  );
};

export default EduBridgeSale;