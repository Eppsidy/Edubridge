import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SaleForm = ({
                    formData,
                    handleInputChange,
                    handleSubmit,
                    categories,
                    loading,
                    navigate,
                    editingIndex,
                    userProfile
                  }) => {
  const [errors, setErrors] = useState({});
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const suggestionsRef = useRef(null);
  const titleInputRef = useRef(null);

  const validateForm = (data) => {
    const errors = {};
    const requiredFields = ['title', 'author', 'condition_rating', 'category_id'];

    requiredFields.forEach(field => {
      if (!data[field] || data[field].trim() === '') {
        errors[field] = `${field.replace('_', ' ').toUpperCase()} is required`;
      }
    });

    if (data.listingType === 'sell') {
      if (!data.selling_price || isNaN(data.selling_price) || data.selling_price <= 0) {
        errors.selling_price = 'Please enter a valid price greater than 0';
      }
    }

    return errors;
  };

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Search books using Google Books API
  const searchBooks = async (query) => {
    if (!query || query.length < 3) {
      setBookSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8&fields=items(id,volumeInfo(title,authors,imageLinks,publishedDate,publisher,industryIdentifiers,description))`
      );
      
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      
      if (data.items) {
        const suggestions = data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title || '',
          authors: item.volumeInfo.authors || [],
          publisher: item.volumeInfo.publisher || '',
          publishedDate: item.volumeInfo.publishedDate || '',
          thumbnail: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail || '',
          isbn: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 
                item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
          description: item.volumeInfo.description || ''
        }));
        
        setBookSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setBookSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching books:', error);
      setBookSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(searchBooks, 300);

  // Handle title input change with search
  const handleTitleChange = (e) => {
    const value = e.target.value;
    handleInputChange(e);
    
    if (value.trim()) {
      debouncedSearch(value.trim());
    } else {
      setBookSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle book selection from suggestions - Updated to use handleInputChange
  const handleBookSelect = (book) => {
    const publishYear = book.publishedDate ? new Date(book.publishedDate).getFullYear() : '';
    
    // Create synthetic events to update each field
    const updateField = (name, value) => {
      handleInputChange({
        target: { name, value }
      });
    };

    // Update each field individually
    updateField('title', book.title);
    updateField('author', book.authors.join(', '));
    updateField('isbn', book.isbn);
    updateField('publisher', book.publisher);
    updateField('publication_year', publishYear.toString());
    updateField('thumbnail_url', book.thumbnail);
    
    // Only update description if it's currently empty
    if (!formData.description || formData.description.trim() === '') {
      updateField('description', book.description ? book.description.substring(0, 500) : '');
    }
    
    setShowSuggestions(false);
    setBookSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          titleInputRef.current && !titleInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (!userProfile) {
      validationErrors.general = "User profile not found. Please log in again.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await handleSubmit(e);
  };

  return (
      <div className="sale-form">
        <h2 className="sale-form-title">
          {editingIndex >= 0 ? 'Edit Textbook' : 'Add New Textbook'}
        </h2>

        {errors.general && <div className="sale-form-error general-error">{errors.general}</div>}

        <form onSubmit={handleFormSubmit}>
          <div className="sale-form-group book-search-container">
            <label className="sale-form-label">Book Title *</label>
            <div className="book-search-wrapper" ref={titleInputRef}>
              <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Start typing to search for books..."
                  required
                  disabled={loading}
                  autoComplete="off"
              />
              {searchLoading && (
                <div className="search-loading-indicator">
                  <span>Searching...</span>
                </div>
              )}
              
              {showSuggestions && bookSuggestions.length > 0 && (
                <div className="book-suggestions-dropdown" ref={suggestionsRef}>
                  {bookSuggestions.map((book) => (
                    <div
                      key={book.id}
                      className="book-suggestion-item"
                      onClick={() => handleBookSelect(book)}
                    >
                      <div className="book-suggestion-image">
                        {book.thumbnail ? (
                          <img 
                            src={book.thumbnail} 
                            alt={book.title}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="book-placeholder" style={{display: book.thumbnail ? 'none' : 'flex'}}>
                          📚
                        </div>
                      </div>
                      <div className="book-suggestion-details">
                        <div className="book-suggestion-title">{book.title}</div>
                        <div className="book-suggestion-author">
                          by {book.authors.join(', ')}
                        </div>
                        {book.publisher && (
                          <div className="book-suggestion-publisher">
                            {book.publisher} {book.publishedDate && `(${new Date(book.publishedDate).getFullYear()})`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.title && <div className="sale-form-error">{errors.title}</div>}
          </div>

          <div className="sale-form-group">
            <label className="sale-form-label">Author(s) *</label>
            <Input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                required
                disabled={loading}
            />
            {errors.author && <div className="sale-form-error">{errors.author}</div>}
          </div>

          <div className="sale-form-row">
            <div className="sale-form-group">
              <label className="sale-form-label">ISBN</label>
              <Input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="Enter ISBN"
                  disabled={loading}
              />
            </div>

            <div className="sale-form-group">
              <label className="sale-form-label">Edition</label>
              <Input
                  type="text"
                  name="edition"
                  value={formData.edition}
                  onChange={handleInputChange}
                  placeholder="e.g., 3rd Edition"
                  disabled={loading}
              />
            </div>
          </div>

          <div className="sale-form-row">
            <div className="sale-form-group">
              <label className="sale-form-label">Publisher</label>
              <Input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="Enter publisher name"
                  disabled={loading}
              />
            </div>

            <div className="sale-form-group">
              <label className="sale-form-label">Publication Year</label>
              <Input
                  type="number"
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 2023"
                  disabled={loading}
              />
            </div>
          </div>

          <div className="sale-form-group">
            <label className="sale-form-label">Category *</label>
            <select
                className="sale-form-select"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
            {errors.category_id && <div className="sale-form-error">{errors.category_id}</div>}
          </div>

          <div className="sale-form-group">
            <label className="sale-form-label">Listing Type *</label>
            <div className="sale-price-toggle">
              <div className="sale-toggle-option">
                <input
                    type="radio"
                    name="listingType"
                    value="sell"
                    id="sell"
                    checked={formData.listingType === 'sell'}
                    onChange={handleInputChange}
                />
                <label htmlFor="sell">Sell</label>
              </div>
              <div className="sale-toggle-option">
                <input
                    type="radio"
                    name="listingType"
                    value="donate"
                    id="donate"
                    checked={formData.listingType === 'donate'}
                    onChange={handleInputChange}
                />
                <label htmlFor="donate">Donate</label>
              </div>
            </div>
          </div>

          {formData.listingType === 'sell' && (
              <div className="sale-form-group">
                <label className="sale-form-label">Price (ZAR) *</label>
                <Input
                    type="number"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    placeholder="e.g., 299.99"
                    required
                    disabled={loading}
                />
                {errors.selling_price && <div className="sale-form-error">{errors.selling_price}</div>}
              </div>
          )}

          <div className="sale-form-group">
            <label className="sale-form-label">Condition *</label>
            <select
                className="sale-form-select"
                name="condition_rating"
                value={formData.condition_rating}
                onChange={handleInputChange}
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

          <div className="sale-form-group">
            <label className="sale-form-label">Description</label>
            <textarea
                className="sale-form-textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the book's condition, any missing pages, highlights, etc."
                rows={4}
                disabled={loading}
            />
          </div>

          <div className="sale-form-actions">
            <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/userdashboard')}
                disabled={loading}
            >
              Cancel
            </Button>
            <Button
                type="submit"
                variant="primary"
                disabled={loading}
            >
              {loading ? 'Listing Book...' : editingIndex >= 0 ? 'Update Textbook' : 'Add Textbook'}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default SaleForm;