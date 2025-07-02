<?php 
session_start();
include("connection.php"); 
?>

<!DOCTYPE html>
<html lang="en">
<head>
<title>EduBridge | Home</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
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
.sell-now-btn {
    background: linear-gradient(45deg, #008080);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);
}
.sell-now-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 128, 128, 0.4);
}     
.hero-section {
    max-width: 1400px;
    margin: 2rem auto;
    padding: 0 2rem;
}
.hero-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 2rem;
}
.greeting {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(45deg, #008080);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
}
.user-welcome {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 1rem;
}
.hero-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
    font-weight: 600;
}
.search-container {
    max-width: 600px;
    margin: 2rem auto;
    position: relative;
}
.search-input {
    width: 100%;
    padding: 15px 25px;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: all 0.3s ease;
}
.search-input:focus {
    box-shadow: 0 8px 30px rgba(0, 128, 128, 0.2);
    transform: translateY(-2px);
}
.hero-description {
    font-size: 1.2rem;
    color: #666;
    line-height: 1.6;
    margin: 2rem 0;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}
.hero-image {
    width: 300px;
    height: 300px;
    border-radius: 20px;
    object-fit: cover;
    margin: 2rem auto;
    display: block;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
.cta-btn {
    background: linear-gradient(45deg, #ff6f61);
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 111, 97, 0.3);
}
.cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 111, 97, 0.4);
}
.logout-link {
    background: rgba(255, 111, 97, 0.1);
    color: #ff6f61;
    padding: 10px 20px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    margin: 1rem;
    display: inline-block;
    transition: all 0.3s ease;
}
.logout-link:hover {
    background: #ff6f61;
    color: white;
    transform: translateY(-2px);
}   
.features-section {
    max-width: 1400px;
    margin: 2rem auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}
.feature-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 4px solid #008080;
}
.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
.feature-title {
    font-size: 1.8rem;
    color: #008080;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
}
.feature-image {
    width: 100%;
    max-width: 280px;
    height: 200px;
    border-radius: 15px;
    object-fit: cover;
    margin: 1rem auto;
    display: block;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.feature-list {
    list-style: none;
    padding: 0;
}
.feature-list li {
    padding: 0.8rem 0;
    font-size: 1.1rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 12px;
}
.feature-list li::before {
    font-size: 1.2rem;
    flex-shrink: 0;
}
.footer {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 3rem;
}
/* Animations */
@keyframes fadeInUp {
from {
    opacity: 0;
    transform: translateY(30px);
}
to {
    opacity: 1;
    transform: translateY(0);
}
}
.hero-card {
    animation: fadeInUp 0.6s ease forwards;
}
.feature-card {
    animation: fadeInUp 0.6s ease forwards;
}
.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }

@media (max-width: 1024px) {
.features-section {
    grid-template-columns: 1fr;
}
}
@media (max-width: 768px) {
.header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
}
.nav {
    padding: 0 1rem;
    justify-content: center;
}
.hero-section,
.features-section {
    padding: 0 1rem;
    margin: 1rem auto;
}
.hero-card {
    padding: 2rem 1rem;
}
.greeting {
    font-size: 2rem;
}
.hero-title {
    font-size: 1.5rem;
}
.features-section {
    grid-template-columns: 1fr;
}
.feature-card {
     padding: 1.5rem;
}
}
.user-info {
    background: rgba(0, 128, 128, 0.1);
    padding: 1rem 2rem;
    border-radius: 15px;
    margin: 1rem 0;
    display: inline-block;
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
<a href="Homepage.php" class="active"> Home</a>
<a href="User Dashboard.php"> User Dashboard</a>
<a href="Textbook Market.php" > Textbook Market</a>
<a href="Cart.php"> Cart</a>
<a href="Sale.php">Sale</a>
</nav>

<div class="hero-section">
<div class="hero-card">
<h1 class="greeting">HELLO</h1>
     
<a href="logout.php" class="logout-link">LOGOUT</a>

<h2 class="hero-title">WELCOME TO EDUBRIDGE
<br>Your Student-Powered Learning Hub!</h2>

<div class="search-container">
<input type="text" class="search-input" placeholder=" Search textbooks..." id="searchBox">
</div>

<img src="ipad reading inspo.jpg" alt="Student reading on iPad" class="hero-image">
<p class="hero-description">
Struggling with expensive textbooks? You've found the right place. 
EduBridge lets students across South Africa buy, sell, or donate digital textbooks.
</p>
</div>
</div>

<div class="features-section">
<div class="feature-card">
<h2 class="feature-title">WHY STUDENTS LOVE EDUBRIDGE</h2>
<img src="More girls, African-Americans enroll in AP computer science_ Why that matters_.jpg" alt="Happy students" class="feature-image">
<ul class="feature-list">
    <li>Affordable access to textbooks</li>
    <li>Buy, sell, or donate in a few clicks</li>
    <li>Track your learning progress</li>
    </ul>
    </div>

<div class="feature-card">
<h2 class="feature-title">HOW IT WORKS</h2>
<img src="Adult Fantasy Bookstagram Flatlay _ ebook cover _ blank ipad mockup _ digital book cover _ Cozy eBook Mockup I Canva Device Book Mock up.jpg" alt="Digital books mockup" class="feature-image">
<ul class="feature-list">
    <li>Buy digital textbooks at student-friendly prices</li>
    <li>List your old books and earn money</li>
    <li>Track everything in your dashboard</li>
    <li>Join study groups and discussions</li>
    </ul>
</div>
</div>

<div class="footer">
<p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
</div>
<script>
    const searchInput = document.getElementById('searchBox');
    searchInput.addEventListener('keypress', function (e) {
if (e.key === 'Enter') {
    const searchTerm = searchInput.value.trim();
if (searchTerm) {
    alert("Searching for: " + searchTerm);
}
}
});

    document.addEventListener('DOMContentLoaded', function() {
    const ctaBtn = document.querySelector('.cta-btn');
    ctaBtn.addEventListener('click', function(e) {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
    this.style.transform = 'scale(1)';
}, 150);
});

    searchInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
});
    searchInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});
});
</script>
</body>
</html>