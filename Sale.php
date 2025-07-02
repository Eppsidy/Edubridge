<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EduBridge|Sale</title>
<link rel="stylesheet" href="style.css">

<style>
.main-content {
            padding: 5px;
        }
        
        .content-card {
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-width: 1200px;
            margin: 0 auto;
        }

        .left-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

      

        .left-content h2 {
            margin: 0;
      color: teal;
      font-weight: bold;
        }
.footer {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 3rem;
        }
  .content-container {
            background: white;
            margin: 0 2rem;
            min-height: 70vh;
            padding: 2rem;
        }

        .page-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .page-title {
            font-size: 2rem;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }

        .page-subtitle {
            color: #64748b;
            font-size: 1.1rem;
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .add-book-form {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            height: fit-content;
        }

        .form-title {
            font-size: 1.5rem;
            color: #1e293b;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #374151;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: #20b2aa;
            box-shadow: 0 0 0 3px rgba(32, 178, 170, 0.1);
        }

        .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            background: white;
            cursor: pointer;
        }

        .form-textarea {
            resize: vertical;
            min-height: 100px;
        }

        .price-toggle {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .toggle-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }

        .toggle-option input[type="radio"] {
            accent-color: #20b2aa;
        }

        .image-upload {
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            transition: border-color 0.3s ease;
            cursor: pointer;
        }

        .image-upload:hover {
            border-color: #20b2aa;
        }

        .image-upload.dragover {
            border-color: #20b2aa;
            background: rgba(32, 178, 170, 0.05);
        }

        .upload-icon {
            font-size: 3rem;
            color: #9ca3af;
            margin-bottom: 1rem;
        }

        .btn-add {
            background: #20b2aa;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }

        .btn-add:hover {
            background: #1a9b93;
            transform: translateY(-1px);
        }

        .my-listings {
            display: flex;
            flex-direction: column;
        }

        .listings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .listings-title {
            font-size: 1.5rem;
            color: #1e293b;
        }

        .listings-count {
            background: #20b2aa;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .listings-grid {
            display: grid;
            gap: 1rem;
        }

        .book-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
            position: relative;
        }

        .book-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .book-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
        }

        .book-info h3 {
            color: #1e293b;
            font-size: 1.2rem;
            margin-bottom: 0.25rem;
        }

        .book-author {
            color: #64748b;
            font-size: 0.9rem;
        }

        .book-actions {
            display: flex;
            gap: 0.5rem;
        }

        .btn-small {
            padding: 0.25rem 0.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.3s ease;
        }

        .btn-edit {
            background: #f59e0b;
            color: white;
        }

        .btn-delete {
            background: #ef4444;
            color: white;
        }

        .btn-small:hover {
            transform: scale(1.05);
        }

        .book-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .detail-label {
            font-size: 0.85rem;
            color: #64748b;
            font-weight: 500;
        }

        .detail-value {
            color: #1e293b;
            font-weight: 600;
        }

        .book-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            position: absolute;
            top: 1rem;
            right: 1rem;
        }

        .status-available {
            background: #dcfce7;
            color: #16a34a;
        }

        .status-sold {
            background: #fee2e2;
            color: #dc2626;
        }

        .status-donated {
            background: #dbeafe;
            color: #2563eb;
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #64748b;
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.show {
            display: flex;
        }

        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }

        .modal-title {
            font-size: 1.25rem;
            color: #1e293b;
            margin-bottom: 1rem;
        }

        .modal-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1.5rem;
        }

        .btn-cancel {
            background: #6b7280;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn-confirm {
            background: #ef4444;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .book-details {
                grid-template-columns: 1fr;
            }
            
            .content-container {
                margin: 0 1rem;
                padding: 1rem;
            }
            
            .nav-container {
                margin: 0 1rem;
            }
        }   
</style>
</head>
<body>
<header class="header">
<div class="left-content">
<div class="logo-icon">EB</div>
<div class="logo-text">EDUBRIDGE</div>
</div>
        
<div class="right-content">
</div>
    
</header>

<nav class="nav-tabs">
    <a href="Homepage.php">Home</a>
    <a href="User Dashboard.php" >User Dashboard</a>
    <a href="Textbook Market.php" >Textbook Market</a>
    <a href="Cart.php">Cart</a>
    <a href="Sale.php" class="active">Sale</a>
</nav>

<div class="content-container">
<div class="page-header">
    <h1 class="page-title">Sell Your Textbooks</h1>
    <p class="page-subtitle">Turn your unused textbooks into cash or help fellow students by donating</p>
</div>
        
<div class="footer">
    <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
</div>

<div class="main-content">
<div class="add-book-form">
    <h2 class="form-title">Add New Textbook</h2>
                
<form id="bookForm">
<div class="form-group">
<label class="form-label">Book Title *</label>
<input type="text" class="form-input" name="title" required placeholder="e.g., Calculus: Early Transcendentals">
</div>

<div class="form-group">
    <label class="form-label">Author(s) *</label>
    <input type="text" class="form-input" name="author" required placeholder="e.g., James Stewart">
</div>

<div class="form-group">
    <label class="form-label">Edition</label>
    <input type="text" class="form-input" name="edition" placeholder="e.g., 8th Edition">
</div>

<div class="form-group">
    <label class="form-label">ISBN</label>
    <input type="text" class="form-input" name="isbn" placeholder="e.g., 978-1285741550">
</div>

<div class="form-group">
    <label class="form-label">course</label>
        <select class="form-select" name="subject">
            <option value="">Select Module</option>
            <option value="Commerece">Information Technology</option>
            <option value="Applied Science">Applies Science</option>
            <option value="Engineering">Business Manahement</option>
            <option value="Business Management">Law</option>
            <option value="Law">Literature</option>
            <option value="Information Technology">Swimming</option>
            <option value="Psychology">Psychology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Other">Other</option>
        </select>
</div>

<div class="form-group">
    <label class="form-label">Listing Type *</label>
<div class="price-toggle">
<div class="toggle-option">
    <input type="radio" name="listingType" value="sell" id="sell" checked>
    <label for="sell">Sell</label>
</div>
<div class="toggle-option">
   <input type="radio" name="listingType" value="donate" id="donate">
   <label for="donate">Donate</label>
</div>
</div>
</div>

<div class="form-group" id="priceGroup">
    <label class="form-label">Price</label>
    <input type="number" class="form-input" name="price" min="0" step="0.01" placeholder="e.g., 85.00">
</div>

<button type="submit" class="btn-add">Add Textbook</button>
</form>
</div>

<div class="my-listings">
<div class="listings-header">
    <h2 class="listings-title">My Listings</h2>
        <span class="listings-count" id="listingsCount">0</span>
</div>

<div class="listings-grid" id="listingsGrid">
<div class="empty-state">
    <h3>No listings yet</h3>
    <p>Add your first textbook to get started!</p>
</div>
</div>
</div>
</div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal" id="deleteModal">
<div class="modal-content">
    <h3 class="modal-title">Delete Listing</h3>
    <p>Are you sure you want to delete this textbook listing? This action cannot be undone.</p>
<div class="modal-buttons">
    <button class="btn-cancel" onclick="closeDeleteModal()">Cancel</button>
    <button class="btn-confirm" onclick="confirmDelete()">Delete</button>
</div>
</div>
</div>

<script>
    let listings = [];
    let editingIndex = -1;
    let deleteIndex = -1;

document.getElementById('bookForm').addEventListener('submit', function(e) {
e.preventDefault();
    const formData = new FormData(e.target);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        edition: formData.get('edition') || 'N/A',
        isbn: formData.get('isbn') || 'N/A',
        subject: formData.get('subject') || 'N/A',
        listingType: formData.get('listingType'),
        price: formData.get('price') || 0,
        status: 'available',
        dateAdded: new Date().toLocaleDateString()
            };

if (editingIndex >= 0) {
    listings[editingIndex] = bookData;
    editingIndex = -1;
    document.querySelector('.btn-add').textContent = 'Add Textbook';
    document.querySelector('.form-title').innerHTML = 'Add New Textbook';
    } else {
    listings.push(bookData);
    }

    e.target.reset();
    updateListingsDisplay();
    });

    document.querySelectorAll('input[name="listingType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const priceGroup = document.getElementById('priceGroup');
        const priceInput = document.querySelector('input[name="price"]');
                
if (this.value === 'donate') {
    priceGroup.style.display = 'none';
    priceInput.required = false;
} else {
    priceGroup.style.display = 'block';
    priceInput.required = true;
    }
});
});
    function updateListingsDisplay() {
        const grid = document.getElementById('listingsGrid');
        const count = document.getElementById('listingsCount');
            
        count.textContent = listings.length;

if (listings.length === 0) {
    grid.innerHTML = `
    <div class="empty-state">
    <div class="empty-icon"></div>
    <h3>No listings yet</h3>
    <p>Add your first textbook to get started!</p>
    </div>
`;
return;
}
    grid.innerHTML = listings.map((book, index) => `
    <div class="book-card">
    <div class="book-status status-${book.status}">${book.status.charAt(0).toUpperCase() + book.status.slice(1)}</div>
    <div class="book-header">
    <div class="book-info">
        <h3>${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
    </div>
    <div class="book-actions">
        <button class="btn-small btn-edit" onclick="editListing(${index})">Edit</button>
        <button class="btn-small btn-delete" onclick="showDeleteModal(${index})">Delete</button>
    </div>
    </div>
    <div class="book-details">
    <div class="detail-item">
        <span class="detail-label">Edition</span>
        <span class="detail-value">${book.edition}</span>
    </div>
    <div class="detail-item">
        <span class="detail-label">Subject</span>
        <span class="detail-value">${book.module}</span>
    </div>
    <div class="detail-item">
    <span class="detail-label">Price</span>
    <span class="detail-value">${book.listingType === 'donate' ? 'FREE' : 'R' + book.price}</span>
    </div>
                    
    </div>
    </div>
`).join('');
}

    function editListing(index) {
    const book = listings[index];
    editingIndex = index;
            
    document.querySelector('input[name="title"]').value = book.title;
    document.querySelector('input[name="author"]').value = book.author;
    document.querySelector('input[name="edition"]').value = book.edition === 'N/A' ? '' : book.edition;
    document.querySelector('input[name="isbn"]').value = book.isbn === 'N/A' ? '' : book.isbn;
    document.querySelector('select[name="subject"]').value = book.module === 'N/A' ? '' : book.subject;
    document.querySelector(`input[name="listingType"][value="${book.listingType}"]`).checked = true;
    document.querySelector('input[name="price"]').value = book.price;
    document.querySelector('.btn-add').textContent = 'Update Textbook';
    document.querySelector('.form-title').innerHTML = 'Edit Textbook';
    document.querySelector(`input[name="listingType"][value="${book.listingType}"]`).dispatchEvent(new Event('change'));
    document.querySelector('.add-book-form').scrollIntoView({ behavior: 'smooth' });
}
    function showDeleteModal(index) {
        deleteIndex = index;
        document.getElementById('deleteModal').classList.add('show');
}
    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('show');
        deleteIndex = -1;
}
    function confirmDelete() {
       if (deleteIndex >= 0) {
            listings.splice(deleteIndex, 1);
            updateListingsDisplay();
            closeDeleteModal();
        }
}
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
            }
        });
    listings = [
        {
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        edition: "8th Edition",
        isbn: "978-1285741550",
        subject: "Mathematics",
        listingType: "sell",
        price: "85.00",
        status: "available",
        dateAdded: "5/28/2025"
    },
{
        title: "Introduction to Psychology",
        author: "David G. Myers",
        edition: "11th Edition", 
        isbn: "978-1464140815",
        subject: "Psychology",
        listingType: "donate",
        price: "0",
        status: "available",
        dateAdded: "5/25/2025"
} ];      
updateListingsDisplay();
</script>

</body>
</html>