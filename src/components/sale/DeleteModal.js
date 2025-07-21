import React from 'react';
import Button from '../ui/Button';

const DeleteModal = ({ show, onClose, onConfirm, loading }) => {
  return (
    <div 
      className="modal" 
      onClick={(e) => e.target.classList.contains('modal') && onClose()}
      style={{ display: show ? 'flex' : 'none' }}
    >
      <div className="modal-content">
        <h3 className="modal-title">Delete Listing</h3>
        <p>Are you sure you want to delete this textbook listing? This action cannot be undone.</p>
        <div className="modal-buttons">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
