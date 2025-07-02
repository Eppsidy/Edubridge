
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduBridge - Shopping Cart</title>
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

        .content-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 24px;
        }

        .cart-section {
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .summary-section {
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            height: fit-content;
            position: sticky;
            top: 32px;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
        }

        .page-title {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
        }

        .cart-count {
            background: #2dd4bf;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }

        .cart-empty {
            text-align: center;
            padding: 64px 32px;
            color: #6b7280;
        }

        .cart-empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
        }

        .cart-empty-title {
            font-size: 24px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }

        .cart-empty-text {
            font-size: 16px;
            margin-bottom: 24px;
        }

        .cart-item {
            display: flex;
            gap: 20px;
            padding: 24px 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .cart-item:last-child {
            border-bottom: none;
        }

        .item-image {
            width: 80px;
            height: 100px;
            background: linear-gradient(135deg, #e5e7eb);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 12px;
            flex-shrink: 0;
        }

        .item-details {
            flex: 1;
        }

        .item-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
            line-height: 1.3;
        }

        .item-author {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .item-seller {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
        }
    

        .item-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .quantity-control {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f9fafb;
            border-radius: 8px;
            padding: 4px;
        }

        .quantity-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #6b7280;
            transition: all 0.2s;
        }

        .quantity-btn:hover {
            background: #2dd4bf;
            color: white;
        }

        .quantity-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .quantity-input {
            width: 40px;
            text-align: center;
            border: none;
            background: transparent;
            font-weight: 600;
            color: #1f2937;
        }

        .item-price {
            font-size: 18px;
            font-weight: bold;
            color: #2dd4bf;
            margin-left: 16px;
        }

        .remove-btn {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .remove-btn:hover {
            background: #fef2f2;
        }

        .summary-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 24px;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 8px;
        }

        .summary-line.total {
            border-top: 2px solid #f3f4f6;
            padding-top: 16px;
            margin-top: 24px;
            font-size: 18px;
            font-weight: bold;
        }

        .summary-label {
            color: #6b7280;
        }

        .summary-value {
            font-weight: 600;
            color: #1f2937;
        }

        .summary-value.total {
            color: #2dd4bf;
            font-size: 24px;
        }

        .promo-section {
            margin: 24px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
        }

        .promo-input {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .promo-field {
            flex: 1;
            padding: 10px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
        }

        .promo-field:focus {
            outline: none;
            border-color: #2dd4bf;
        }

        .promo-btn {
            padding: 10px 16px;
            background: #2dd4bf;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .promo-btn:hover {
            background: #14b8a6;
        }

        .checkout-btn {
            width: 100%;
            padding: 16px;
            background: #2dd4bf;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 24px;
        }

        .checkout-btn:hover {
            background: #14b8a6;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(45, 212, 191, 0.3);
        }

        .checkout-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .continue-shopping {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #2dd4bf;
            text-decoration: none;
            font-weight: 600;
            margin-top: 16px;
            transition: all 0.2s;
        }

        .continue-shopping:hover {
            gap: 12px;
        }

        .footer {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 3rem;
        }

        
        @media (max-width: 1024px) {
            .content-container {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .summary-section {
                position: static;
            }
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 16px;
            }

            .cart-section,
            .summary-section {
                padding: 20px;
            }

            .cart-item {
                flex-direction: column;
                gap: 16px;
            }

            .item-actions {
                justify-content: space-between;
            }

            .page-header {
                flex-direction: column;
                gap: 16px;
                align-items: flex-start;
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

    </header>

    <nav class="nav-tabs">
        <a href="Homepage.php">Home</a>
        <a href="User Dashboard.php">User Dashboard</a>
        <a href="Textbook Market.php" >Textbook Market</a>
        <a href="Cart.php" class="active">Cart</a>
        <a href="Sale.php"> Sale</a>
    </nav>

    <main class="main-content">
        <div class="content-container">
            <div class="cart-section">
                <div class="page-header">
                    <h1 class="page-title">Shopping Cart</h1>
                    <div class="cart-count">3 items</div>
                </div>

                <div class="cart-items">
                    <div class="cart-item">
                        <div class="item-image">
                        <img src = "Calculus_ Calculus Early Transcendentals Version (Available Titles Cengagenow).jpg" width = "100" height = "150">
                        </div>
                        <div class="item-details">
                            <div class="item-title">Calculus: Early Transcendentals</div>
                            <div class="item-author">by James Stewart</div>
                            <div class="item-seller">Sold by: Nyuleka M. (Engineering)</div>
                            <div class="item-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn" onclick="updateQuantity(1, -1)">-</button>
                                    <input type="text" class="quantity-input" value="1" readonly>
                                    <button class="quantity-btn" onclick="updateQuantity(1, 1)" disabled>+</button>
                                </div>
                                <div class="item-price">R899.99</div>
                                <button class="remove-btn" onclick="removeItem(1)"></button>
                            </div>
                        </div>
                    </div>

                    <div class="cart-item">
                        <div class="item-image">
                        <img src = "Social Psychology by David Myers.jpg" width = "100" height = "150">
                        </div>
                        <div class="item-details">
                            <div class="item-title">Introduction to Psychology</div>
                            <div class="item-author">by David G. Myers</div>
                            <div class="item-seller">Sold by: Mike L. (Psychology)</div>
                            <div class="item-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn" onclick="updateQuantity(2, -1)">-</button>
                                    <input type="text" class="quantity-input" value="1" readonly>
                                    <button class="quantity-btn" onclick="updateQuantity(2, 1)" disabled>+</button>
                                </div>
                                <div class="item-price">R650.00</div>
                                <button class="remove-btn" onclick="removeItem(2)">🗑️</button>
                            </div>
                        </div>
                    </div>

                    <div class="cart-item">
                        <div class="item-image">
                          <img src = "PRICES MAY VARY_ Extensively revised, the fourth….jpg" width = "100" height = "150">
                        </div>
                        <div class="item-details">
                            <div class="item-title">Organic Chemistry</div>
                            <div class="item-author">by Paula Yurkanis Bruice</div>
                            <div class="item-seller">Sold by: Emma R. (Chemistry)</div>
                            <div class="item-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn" onclick="updateQuantity(3, -1)">-</button>
                                    <input type="text" class="quantity-input" value="1" readonly>
                                    <button class="quantity-btn" onclick="updateQuantity(3, 1)" disabled>+</button>
                                </div>
                                <div class="item-price">R1250.00</div>
                                <button class="remove-btn" onclick="removeItem(3)"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <a href="Textbook Market.php" class="continue-shopping"> Continue Shopping</a>
            </div>

            <div class="summary-section">
                <h2 class="summary-title">Order Summary</h2>
                
                <div class="summary-line">
                    <span class="summary-label">Subtotal (3 items)</span>
                    <span class="summary-value">R2799.99</span>
                </div>
                <div class="summary-line">
                    <span class="summary-label">Student Discount (10%)</span>
                    <span class="summary-value" style="color: #10b981;">-R280.00</span>
                </div>
                
                <div class="promo-section">
                    <label for="promoCode" style="font-weight: 600; color: #374151;">Promo Code</label>
                    <div class="promo-input">
                        <input type="text" class="promo-field" id="promoCode" placeholder="Enter code">
                        <button class="promo-btn">Apply</button>
                    </div>
                </div>

                <div class="summary-line total">
                    <span class="summary-label">Total</span>
                    <span class="summary-value total">R2519.99</span>
                </div>

                <button class="checkout-btn">
                     Checkout
                </button>

              
            </div>
        </div>
    </main>

     <div class="footer">
        <p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
    </div>

    <script>
        let cartItems = {
            1: { name: "Calculus: Early Transcendentals", price: 89.99, quantity: 1 },
            2: { name: "Introduction to Psychology", price: 65.00, quantity: 1 },
            3: { name: "Organic Chemistry", price: 125.00, quantity: 1 }
        };

        function updateQuantity(itemId, change) {
            const item = cartItems[itemId];
            if (!item) return;

            const newQuantity = item.quantity + change;
            if (newQuantity < 1) return;

            item.quantity = newQuantity;
            updateDisplay();
        }

        function removeItem(itemId) {
            if (confirm('Remove this item from your cart?')) {
                delete cartItems[itemId];
                document.querySelector(`.cart-item:nth-child(${itemId})`).remove();
                updateDisplay();
                
                // If cart is empty, show empty state
                if (Object.keys(cartItems).length === 0) {
                    showEmptyCart();
                }
            }
        }

        function updateDisplay() {
            const itemCount = Object.keys(cartItems).length;
            const subtotal = Object.values(cartItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = subtotal * 0.1; // 10% student discount
            const serviceFee = 5.99;
            const total = subtotal - discount + serviceFee;

            document.querySelector('.cart-count').textContent = `${itemCount} items`;
            document.querySelector('.summary-line:nth-child(1) .summary-value').textContent = `$${subtotal.toFixed(2)}`;
            document.querySelector('.summary-line:nth-child(2) .summary-value').textContent = `-$${discount.toFixed(2)}`;
            document.querySelector('.summary-value.total').textContent = `$${total.toFixed(2)}`;
        }

        function showEmptyCart() {
            document.querySelector('.cart-items').innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon"></div>
                    <div class="cart-empty-title">Your cart is empty</div>
                    <div class="cart-empty-text">Start adding some textbooks to get the best deals!</div>
                    <button class="checkout-btn" onclick="window.location.href='#'">Browse Textbooks</button>
                </div>
            `;
            document.querySelector('.checkout-btn').disabled = true;
        }

        // Promo code functionality
        document.querySelector('.promo-btn').addEventListener('click', function() {
            const promoCode = document.getElementById('promoCode').value.trim();
            if (promoCode === 's') {
                alert('Promo code applied! Additional 20% off');
            } else if (promoCode) {
                alert('Invalid promo code');
            }
        });

        // Move to cart functionality
        document.querySelectorAll('.move-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                this.textContent = 'Added ';
                this.style.background = '#10b981';
                this.style.color = 'white';
                this.disabled = true;
                
                // Simulate adding to cart
                setTimeout(() => {
                    this.closest('.saved-item').style.opacity = '0.5';
                    this.textContent = 'In Cart';
                }, 500);
            });
        });

        // Continue shopping
        document.querySelector('.continue-shopping').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Redirecting to Textbook Market...');
        });

       document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (Object.keys(cartItems).length > 0) {
        // Redirect to checkout page
        window.location.href = 'checkout.php';
    } else {
        alert('Your cart is empty. Please add items before checkout.');
    }
});
    </script>
</body>
</html>