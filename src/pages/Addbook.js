import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/Addbook.css';

const AddBook = ({ session }) => {
  const navigate = useNavigate();
  const user = session?.user;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0];

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    edition: '',
    publisher: '',
    publication_year: '',
    category_id: '',
    selling_price: '',
    condition_rating: 'Good',
    description: ''
  });

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Create categories if they don't exist
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

        // First, check if categories exist
        const { data: existingCategories, error: fetchError } = await supabase
          .from('categories')
          .select('*');

        if (fetchError) throw fetchError;

        if (!existingCategories || existingCategories.length === 0) {
          // Insert default categories if none exist
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    setLoading(true);

    // Validation
    if (!form.title.trim() || !form.author.trim() || !form.selling_price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(form.selling_price) <= 0) {
      setError('Selling price must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      // First, get or create user profile
      let userProfile;
      
      // Try to get existing user profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        userProfile = existingProfile;
      } else {
        // Create user profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([
            {
              auth_id: user.id,
              email: user.email,
              first_name: userName || 'User',
              last_name: '',
              course_of_study: 'Not specified'
            }
          ])
          .select('id')
          .single();

        if (createError) throw createError;
        userProfile = newProfile;
      }

      // Insert the book
      const { error: insertError } = await supabase.from('books').insert([
        {
          title: form.title.trim(),
          author: form.author.trim(),
          isbn: form.isbn.trim() || null,
          edition: form.edition.trim() || null,
          publisher: form.publisher.trim() || null,
          publication_year: form.publication_year ? parseInt(form.publication_year) : null,
          category_id: form.category_id ? parseInt(form.category_id) : null,
          seller_id: userProfile.id,
          price: parseFloat(form.selling_price), // Add this line
          original_price: parseFloat(form.selling_price),
          selling_price: parseFloat(form.selling_price),
          condition_rating: form.condition_rating,
          description: form.description.trim() || null,
          availability_status: 'Available'
        }
      ]);

      if (insertError) throw insertError;

      setSuccessMsg('Book listed successfully! Redirecting to dashboard...');
      
      // Reset form
      setForm({
        title: '',
        author: '',
        isbn: '',
        edition: '',
        publisher: '',
        publication_year: '',
        category_id: '',
        selling_price: '',
        condition_rating: 'Good',
        description: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => navigate('/userdashboard'), 2000);
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message || 'Error adding book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      alert('Unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="add-book-container">
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

      <nav className="nav-tabs">
        <Link to="/home">Home</Link>
        <Link to="/userdashboard">Dashboard</Link>
        <Link to="/textbookmarket">Textbook Market</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/sale">Sale</Link>
      </nav>

      <main className="main-content">
        <div className="content-card">
          <div className="page-header">
            <h1 className="page-title">List a New Textbook</h1>
            <p className="page-subtitle">Add your textbook to the marketplace</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="add-book-form">
            <div className="form-group">
              <label htmlFor="title">Book Title *</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                placeholder="Enter book title" 
                value={form.title} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input 
                type="text" 
                id="author"
                name="author" 
                placeholder="Enter author name" 
                value={form.author} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input 
                  type="text" 
                  id="isbn"
                  name="isbn" 
                  placeholder="Enter ISBN" 
                  value={form.isbn} 
                  onChange={handleChange} 
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edition">Edition</label>
                <input 
                  type="text" 
                  id="edition"
                  name="edition" 
                  placeholder="e.g., 3rd Edition" 
                  value={form.edition} 
                  onChange={handleChange} 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="publisher">Publisher</label>
                <input 
                  type="text" 
                  id="publisher"
                  name="publisher" 
                  placeholder="Enter publisher name" 
                  value={form.publisher} 
                  onChange={handleChange} 
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="publication_year">Publication Year</label>
                <input 
                  type="number" 
                  id="publication_year"
                  name="publication_year" 
                  placeholder="e.g., 2023" 
                  value={form.publication_year} 
                  onChange={handleChange} 
                  min="1900"
                  max={new Date().getFullYear()}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select 
                  id="category_id"
                  name="category_id" 
                  value={form.category_id} 
                  onChange={handleChange} 
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="selling_price">Selling Price (ZAR) *</label>
                <input 
                  type="number" 
                  id="selling_price"
                  step="0.01" 
                  name="selling_price" 
                  placeholder="e.g., 299.99" 
                  value={form.selling_price} 
                  onChange={handleChange} 
                  required 
                  min="0.01"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="condition_rating">Condition *</label>
              <select 
                id="condition_rating"
                name="condition_rating" 
                value={form.condition_rating} 
                onChange={handleChange} 
                required 
                disabled={loading}
              >
                <option value="Excellent">Excellent - Like new</option>
                <option value="Very Good">Very Good - Minor wear</option>
                <option value="Good">Good - Some wear but functional</option>
                <option value="Fair">Fair - Noticeable wear</option>
                <option value="Poor">Poor - Heavy wear but usable</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description"
                name="description" 
                placeholder="Describe the book's condition, any missing pages, highlights, etc." 
                value={form.description} 
                onChange={handleChange} 
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/userdashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Listing Book...' : 'List Book'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
      </div>
    </div>
  );
};

export default AddBook;