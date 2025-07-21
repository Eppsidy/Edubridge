import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SaleForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  categories, 
  loading, 
  navigate, 
  editingIndex 
}) => {
  return (
    <div className="sale-form">
      <h2 className="sale-form-title">
        {editingIndex >= 0 ? 'Edit Textbook' : 'Add New Textbook'}
      </h2>
      
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
            onClick={handleSubmit}
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
