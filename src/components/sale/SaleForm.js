import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SaleForm = ({ 
  formData, 
  setFormData, 
  handleInputChange, 
  handleSubmit, 
  categories, 
  loading, 
  navigate, 
  editingIndex, 
  userProfile 
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const errors = {};
    
    // Required fields for both selling and donating
    const requiredFields = ['title', 'author', 'condition_rating', 'category_id'];
    
    requiredFields.forEach(field => {
      if (!data[field] || data[field].trim() === '') {
        errors[field] = `${field.replace('_', ' ').toUpperCase()} is required`;
      }
    });

    // Price validation only if listing type is 'sell'
    if (data.listingType === 'sell') {
      if (!data.selling_price || isNaN(data.selling_price) || data.selling_price <= 0) {
        errors.selling_price = 'Please enter a valid price greater than 0';
      }
    }

    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    
    // Check if userProfile exists
    if (!userProfile) {
      validationErrors.general = "User profile not found. Please log in again.";
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare book data
    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim() || null,
      edition: formData.edition.trim() || null,
      publisher: formData.publisher.trim() || null,
      publication_year: formData.publication_year ? parseInt(formData.publication_year) : null,
      category_id: formData.category_id,
      seller_id: userProfile?.id || null,
      selling_price: formData.listingType === 'donate' ? 0 : parseFloat(formData.selling_price),
      condition_rating: formData.condition_rating,
      description: formData.description.trim() || null,
      availability_status: 'Available'
    };

    // ... rest of submit handler
  };

  return (
    <div className="sale-form">
      <h2 className="sale-form-title">
        {editingIndex >= 0 ? 'Edit Textbook' : 'Add New Textbook'}
      </h2>
      
      {errors.general && <div className="sale-form-error general-error">{errors.general}</div>}
      
      <div>
        <div className="sale-form-group">
          <label className="sale-form-label">Book Title *</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter book title"
            required
            disabled={loading}
          />
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
          <label className="sale-form-label">Category</label>
          <select
            className="sale-form-select"
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
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
            onClick={handleFormSubmit}
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Listing Book...' : editingIndex >= 0 ? 'Update Textbook' : 'Add Textbook'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;
