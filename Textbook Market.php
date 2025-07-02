<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EduBridge - Textbook Market</title>
<link rel="stylesheet" href="style.css">

<style>
.main-content {
padding: 32px 24px;
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

        .main-content {
            padding: 32px 24px;
        }

        .content-card {
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-width: 1200px;
            margin: 0 auto;
        }

        .page-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .page-title {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }

        .page-subtitle {
            font-size: 18px;
            color: #6b7280;
        }

        .search-filters {
            display: flex;
            gap: 16px;
            margin-bottom: 32px;
            flex-wrap: wrap;
        }

        .search-bar {
            flex: 1;
            min-width: 300px;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.2s;
        }

        .search-input:focus {
            outline: none;
            border-color: #2dd4bf;
            box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.1);
        }

        .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
        }

        .filter-select {
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .filter-select:focus {
            outline: none;
            border-color: #2dd4bf;
        }

        .books-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .book-card {
            border: 2px solid #f3f4f6;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s;
            cursor: pointer;
            background: white;
        }

        .book-card:hover {
            border-color: #2dd4bf;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .book-image {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }

        .book-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .book-author {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .book-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .book-price {
            font-size: 18px;
            font-weight: bold;
            color: #2dd4bf;
        }


        .book-seller {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 12px;
        }

        .book-actions {
            display: flex;
            gap: 8px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            flex: 1;
        }

        .btn-primary {
            background: #2dd4bf;
            color: white;
        }

        .btn-primary:hover {
            background: #14b8a6;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #6b7280;
            border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
            background: #e5e7eb;
        }

        .quick-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }

        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: #2dd4bf;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: #6b7280;
        }

        .floating-action {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #2dd4bf;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 50%;
            width: 64px;
            height: 64px;
            box-shadow: 0 8px 25px rgba(45, 212, 191, 0.3);
            cursor: pointer;
            transition: all 0.3s;
            font-size: 24px;
        }

        .floating-action:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(45, 212, 191, 0.4);
        }
.footer {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 3rem;
        }
      
    </style>
</head>
<body>
    <header class="header">
        <div class="left-content">
            <div class="logo-icon">EB</div>
            <div class="logo-text">EDUBRIDGE</div>
        </div>
       
    </header>

    <nav class="nav-tabs">
        <a href="Homepage.php">Home</a>
        <a href="User Dashboard.php" > Dashboard</a>
        <a href="Textbook Market.php" class = "active" > Textbook Market</a>
        <a href="Cart.php">Cart</a>
        <a href="Sale.php">Sale</a>
      </nav>

    <main class="main-content">
        <div class="content-card">
            <div class="page-header">
                <h1 class="page-title">Textbook Market</h1>
                <p class="page-subtitle">Buy and sell textbooks with fellow students</p>
            </div>

            <div class="search-filters">
                <div class="search-bar">
                    <div class="search-icon"></div>
                    <input type="text" class="search-input" placeholder="Search by title, author, or ISBN...">
                </div>
                <select class="filter-select">
                    <option>All Courses</option>
                    <option>Biomedicine</option>
                    <option>Arts</option>
                    <option>Business Management</option>
                    <option>Information Technology</option>
                    <option>Psychology</option>
                </select>
                
            </div>

            <div class="books-grid">
                <div class="book-card">
                    <div class="book-image">
                    <img src="Calculus_ Calculus Early Transcendentals Version (Available Titles Cengagenow).jpg" width = "250" height = "200">
                    </div>
                    <div class="book-title">Calculus: Early Transcendentals</div>
                    <div class="book-author">by James Stewart</div>
                    <div class="book-details">
                        <div class="book-price">R899.99</div>
                    </div>
                    <div class="book-seller">Sold by: Nyuleka M. (Engineering)</div>
                    <div class="book-actions">
                        <button class="btn btn-primary">Buy Now</button>
                       
                    </div>
                </div>

                <div class="book-card">
                    <div class="book-image">
                      <img src = "Social Psychology by David Myers.jpg" width = "250" height = "200">
                    </div>
                    <div class="book-title">Introduction to Psychology</div>
                    <div class="book-author">by David G. Myers</div>
                    <div class="book-details">
                        <div class="book-price">R650.00</div>
                    </div>
                    <div class="book-seller">Sold by: Onthatile L. (Psychology)</div>
                    <div class="book-actions">
                        <button class="btn btn-primary">Buy Now</button>
         
                    </div>
                </div>

                <div class="book-card">
                    <div class="book-image">
<img src = "PRICES MAY VARY_ Extensively revised, the fourth….jpg" width = "250" height = "200">
                    </div>
                    <div class="book-title">Bioenergetics</div>
                    <div class="book-author">by David G. Nicholis</div>
                    <div class="book-details">
                        <div class="book-price">R1250.00</div>
                    </div>
                    <div class="book-seller">Sold by: Mathew P. (Biomedicine)</div>
                    <div class="book-actions">
                        <button class="btn btn-primary">Buy Now</button>
   
                    </div>
                </div>

                <div class="book-card">
                    <div class="book-image">
<img src = "PRICES MAY VARY_ Encyclopedia of MYP Visual Arts….jpg" width = "250" height = "200">
                    </div>
                    <div class="book-title">Visual Arts</div>
                    <div class="book-author">by Lyunda Kuntyi</div>
                    <div class="book-details">
                        <div class="book-price">R749.99</div>
                    </div>
                    <div class="book-seller">Sold by: Alex T. (Arts in graphics)</div>
                    <div class="book-actions">
                        <button class="btn btn-primary">Buy Now</button>

                    </div>
                </div>

                <div class="book-card">
                    <div class="book-image">
                      <img src = "PRICES MAY VARY_ This book provides an essential….jpg" width = "250" height = "200">
                    </div>
                    <div class="book-title">Simple Contract Law</div>
                    <div class="book-author">by David C. Lay</div>
                    <div class="book-details">
                        <div class="book-price">R849.99</div>
                    </div>
                    <div class="book-seller">Sold by: Jackomene R. (Law)</div>
                    <div class="book-actions">
                        <button class="btn btn-primary">Buy Now</button>

                    </div>
                </div>

                <div class="book-card">
                    <div class="book-image">
                     <img src = "PRICES MAY VARY_ “This is an ideal technical….jpg" width = "250" height = "200">
                    </div>
                    <div class="book-title">Business Accounting</div>
                    <div class="book-author">by Frank Woods</div>
                    <div class="book-details">
                        <div class="book-price">R1195.00</div>
                    </div>
                    <div class="book-seller">Sold by: Norette P. (Accounting)</div>
                    <div class="book-actions">
                        <button class="btn btn-primary">Buy Now</button>

                    </div>
                </div>
            </div>
        </div>
    </main>

    <button class="floating-action" title="List a book for sale">+</button>

    <div class="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
    </div>

    <script>
        // Add interactivity
        document.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn')) {
                    console.log('Book clicked:', this.querySelector('.book-title').textContent);
                }
            });
        });

        document.querySelector('.floating-action').addEventListener('click', function() {
            alert('Open sell book form');
        });

        document.querySelector('.search-input').addEventListener('input', function(e) {
            console.log('Searching for:', e.target.value);
        });

        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', function() {
                console.log('Filter changed:', this.value);
            });
        });
    </script>
</body>
</html>