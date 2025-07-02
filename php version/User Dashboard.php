<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EduBridge | User Dashboard</title>
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
.left-content h2 {
    margin: 0;
    color: teal;
    font-weight: bold;
}
.main-container {
    max-width: 1400px;
    margin: 2rem auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    min-height: calc(100vh - 200px);
}
.sidebar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 120px;
}
.sidebar h3 {
    color: #008080;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
}
.sidebar ul {
    list-style: none;
}
.sidebar ul li {
    margin: 0.5rem 0;
}
.sidebar ul li a {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #666;
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 12px;
    transition: all 0.3s ease;
    font-weight: 500;
}
.sidebar ul li a:hover {
    background: rgba(0, 128, 128, 0.1);
    color: #008080;
    transform: translateX(4px);
}
.sidebar ul li a.active {
    background: #008080;
    color: white;
    box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);
}
.main-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
.welcome-section {
    background: linear-gradient(135deg, #008080);
    color: white;
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}
.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
}
.welcome-text h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}
.welcome-text p {
    opacity: 0.9;
}
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}
.dashboard-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border-left: 4px solid #008080;
}
.dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
}
.card-icon {
    width: 40px;
    height: 40px;
    background: rgba(0, 128, 128, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #008080;
    font-size: 18px;
}
.card-header h3 {
    color: #333;
    font-size: 1.1rem;
}

.card-content {
    color: #666;
    line-height: 1.6;
}
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}
.stat-item {
    background: rgba(0, 128, 128, 0.05);
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
}
.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #008080;
}
.stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}
.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}
.btn-primary {
    background: #008080;
    color: white;
}
.btn-secondary {
    background: rgba(0, 128, 128, 0.1);
    color: #008080;
}
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.footer {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 3rem;
}
@media (max-width: 1024px) {
.main-container {
    grid-template-columns: 1fr;
    gap: 1rem;
}
.sidebar {
    position: static;
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
.main-container {
    padding: 0 1rem;
    margin: 1rem auto;
}
.dashboard-grid {
    grid-template-columns: 1fr;
}
.welcome-section {
    flex-direction: column;
    text-align: center;
    }
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

.dashboard-card {
    animation: fadeInUp 0.6s ease forwards;
}
.dashboard-card:nth-child(1) { animation-delay: 0.1s; }
.dashboard-card:nth-child(2) { animation-delay: 0.2s; }
.dashboard-card:nth-child(3) { animation-delay: 0.3s; }
.dashboard-card:nth-child(4) { animation-delay: 0.4s; }
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
    <a href="User Dashboard.php" class="active">User Dashboard</a>
    <a href="Textbook Market.php" >Textbook Market</a>
    <a href="Cart.php">Cart</a>
    <a href="Sale.php">Sale</a>
</nav>

<div class="main-container">
   <aside class="sidebar">
<h3>Dashboard Menu</h3>
<ul>
    <li><a href="#profile" class="active"> Profile</a></li>
    <li><a href="Textbook Market.php">My Textbooks</a></li>
    <li><a href="Cart.php">My Purchases</a></li>
    <li><a href="#settings"> Settings</a></li>
</ul>
</aside>

<main class="main-content">
<div class="welcome-section">
<div class="welcome-text">
<h2>Welcome back!</h2>
<p>Ready to continue your learning journey? Check out your latest activity below.</p>
</div>
</div>

<div class="dashboard-grid">
<div class="dashboard-card">
<div class="card-header">         
<h3>My Textbooks</h3>
</div>
<div class="card-content">
<p>You have <strong>0 textbooks</strong> listed for sale</p>
<div class="action-buttons">
<a href="Textbook Market.php" class="btn btn-primary">Add New Book</a>
<a href="Cart.php" class="btn btn-secondary">View purchase</a>
</div>
</div>
</div>

<div class="dashboard-card">
<div class="card-header"> 
<h3>Recent Purchases</h3>
</div>
<div class="card-content">
<p>0 textbooks purchased </p>
<div class="action-buttons">
<a href="#" class="btn btn-primary">Browse Market</a>
<a href="#" class="btn btn-secondary">Order History</a>
</div>
</div>
</div>

<div class="dashboard-card">
<div class="card-header">
<div class="dashboard-card">
<div class="card-header">
<h3>Your Statistics</h3>
</div>

<div class="card-content">
<div class="stats-grid">
<div class="stat-item">
<div class="stat-number">0</div>
<div class="stat-label">Books Sold</div>
</div>
                        
<div class="stat-item">
<div class="stat-number">0</div>
<div class="stat-label">Books Bought</div>
</div>
                        
</div>
</div>
</div>
</main></div>

<div class="footer">
<p>&copy; 2025 EduBridge | Connecting Students Through Knowledge</p>
</div>

<script> 
    document.addEventListener('DOMContentLoaded', function() {

    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
    e.preventDefault();
    sidebarLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
});
});
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
});
    card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
});
});
 
});
</script>
</body>
</html>