<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EduBridge - Checkout</title>
<style>
body {
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg,  #764ba2 100%);
    min-height: 100vh;
    color: #333;
}
.header {
    background: rgba(255, 255, 255, 0.95);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}
.logo {
    display: flex;
    align-items: center;
    gap: 12px;
}
.logo-icon {
    background: linear-gradient(45deg, #2dd4bf, #06b6d4);
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
}
.logo-text {
    font-size: 1.3rem;
    font-weight: bold;
    color: #1f2937;
}
.back-btn {
    background: #6b7280;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
}
.back-btn:hover {
    background: #4b5563;
 }
.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}
.card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
}
.checkout-section {
    display: block;
}
.success-section {
    display: none;
    text-align: center;
}
.section-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1.5rem;
}
.form-group {
    margin-bottom: 1rem;
}
.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 500;
}
.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
}
.form-input:focus {
    outline: none;
    border-color: #2dd4bf;
    box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.1);
}
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}
.payment-methods {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1rem 0;
}
.payment-option {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
}
.payment-option:hover {
    border-color: #2dd4bf;
}
.payment-option.selected {
    border-color: #2dd4bf;
    background: #f0fdfa;
}
.payment-option input[type="radio"] {
    display: none;
}
.payment-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}
.order-summary {
    background: #f9fafb;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
}
.order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
}
.order-item:last-child {
    border-bottom: none;
}
.item-name {
    font-weight: 500;
}
.item-price {
    color: #2dd4bf;
    font-weight: 600;
}
.total-line {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #e5e7eb;
}
.total-price {
    color: #2dd4bf;
}
.place-order-btn {
    width: 100%;
    background: linear-gradient(45deg, #2dd4bf);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
}
.place-order-btn:hover {
    opacity: 0.9;
}
.place-order-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}
/* Success Styles */
.success-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #059669);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 2.5rem;
    color: white;
}
.success-title {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 1rem;
}
.success-message {
    color: #6b7280;
    margin-bottom: 2rem;
}
.order-details {
    background: #f9fafb;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: left;
    margin: 1.5rem 0;
}
.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}
.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
}
.btn-primary {
    background: linear-gradient(45deg, #2dd4bf);
    color: white;
}
.btn-secondary {
    background: #f3f4f6;
    color: #1f2937;
}
@media (max-width: 768px) {
    .container {
    padding: 0 0.5rem;
}
.card {
    padding: 1rem;
}
.form-row {
    grid-template-columns: 1fr;
}
.payment-methods {
    grid-template-columns: 1fr;
}
.action-buttons {
    flex-direction: column;
    }
}
</style>
</head>

<body>
<header class="header">
<div class="logo">
<div class="logo-icon">EB</div>
<div class="logo-text">EDUBRIDGE</div>
</div>

<button class="back-btn" onclick="goBack()">Back</button>
</header>

<div class="container">
<!-- Checkout Section -->
<div id="checkoutSection" class="checkout-section">
<div class="card">
<h2 class="section-title">Checkout</h2>
                
<form id="checkoutForm">
<div class="form-group">
<label for="email">Email Address</label>
<input type="email" id="email" name="email" class="form-input" required>
</div>

<div class="form-group">
<label for="fullName">Full Name</label>
<input type="text" id="fullName" name="fullName" class="form-input" required>
</div>

<div class="form-group">
<label for="address">Address</label>
<input type="text" id="address" name="address" class="form-input" required>
</div>

<h3 style="margin: 1.5rem 0 1rem 0; color: #374151;">Payment Method</h3>
<div class="payment-methods">
<div class="payment-option" onclick="selectPayment('card')">
<input type="radio" name="payment" value="card" id="card">
            
<div>Credit Card</div>
</div>
<div class="payment-option" onclick="selectPayment('paypal')">
<input type="radio" name="payment" value="paypal" id="paypal">
                           
<div>PayPal</div>
</div>
</div>

<div class="order-summary">
<h3 style="margin-bottom: 1rem; color: #374151;">Order Summary</h3>
<div class="order-item">
<span class="item-name">Calculus: Early Transcendentals</span><span class="item-price">R899.99</span>
</div>
<div class="order-item">
<span class="item-name">Introduction to Psychology</span>
<span class="item-price">R650.00</span>
</div>

<div class="order-item">
<span class="item-name">Organic Chemistry</span>
<span class="item-price">R1250.00</span>
</div>
                        
<div class="total-line">
<span>Total</span>
<span class="total-price">R2,519.99</span>
</div>
</div>

<button type="button" class="place-order-btn" onclick="processPayment()">Place Order - R2,519.99
</button>
</form>
</div>
</div>

<!-- Success Section -->
<div id="successSection" class="success-section">
<div class="card">
<div class="success-icon">✓</div>
<h1 class="success-title">Payment Successful!</h1>
<p class="success-message">Thank you for your purchase! Your order has been confirmed.</p>

<div class="order-details">
<h3 style="margin-bottom: 1rem;">Order Details</h3>
<div class="detail-row">
<span>Order Number:</span>
<span><strong>#EB-2025-001234</strong></span>
</div>

<div class="detail-row">
<span>Order Date:</span>
<span id="orderDate"></span>
</div>

<div class="detail-row">
<span>Items:</span>
<span>3 Textbooks</span>
</div>
                    
<div class="detail-row">
<span>Total Paid:</span>
<span><strong>R2,519.99</strong></span>
</div>
</div>

<div class="action-buttons">
<a href="#" class="btn btn-primary">Back to Home</a>
<a href="#" class="btn btn-secondary">View Orders</a>
</div>
</div>
</div>
</div>

<script>
    function selectPayment(method) {
    document.querySelectorAll('.payment-option').forEach(option => {
    option.classList.remove('selected');
});  
    event.currentTarget.classList.add('selected');
    document.getElementById(method).checked = true;
}
    function processPayment() {
    const form = document.getElementById('checkoutForm');
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
            
if (!selectedPayment) {
    alert('Please select a payment method');
    return;
}
if (!form.checkValidity()) {
    alert('Please fill in all required fields');
    return;
}
// Show processing state
    const btn = document.querySelector('.place-order-btn');
    btn.innerHTML = '⏳ Processing...';
    btn.disabled = true;

// Simulate payment processing
    setTimeout(() => {
    showSuccessPage();
}, 2000);
}
function showSuccessPage() {
    document.getElementById('checkoutSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'block';
            
// Set current date
    const now = new Date();
    document.getElementById('orderDate').textContent = now.toLocaleDateString('en-ZA');
}
    function goBack() {
    const successVisible = document.getElementById('successSection').style.display === 'block';
if (successVisible) {
// Reset to checkout
    document.getElementById('successSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
                
// Reset button
    const btn = document.querySelector('.place-order-btn');
    btn.innerHTML = '🔒 Place Order - R2,519.99';
    btn.disabled = false;
} else {
// Go back to cart
    window.history.back();
   }
}
</script>
</body>
</html>