<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EDUBRIDGE</title>
<style>
body {
    margin: 0;
    padding: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    font-family: Arial, sans-serif;
}
.form-container {
    border: 5px solid #45a049;
    padding: 20px;
    border-radius: 10px;
    width: 380px;
    height: auto;
    margin: 100px auto;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    background-color: white;          
}
.form-header {
    text-align:center;
    margin-bottom: 20px;
}    
.logo-icon {
    background: #f8f9fa;
    width: 80px;
    height: 80px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    border: 2px solid #e9ecef;
}
.form-header h1{
    margin:10px 0 0;
    color:#45a049;
}
.form-container label {
    display: block;
    margin-bottom: 8px;
    color: #333;
}
.form-container input[type="text"],
.from-container input [type = "text"],
.form-container input[type="email"],
.form-container input[type="password"] {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.form-container input[type="submit"] {
    width: 80%;
    padding: 10px;
    background-color: #45a049;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;     
}
.form-container input[type="submit"]:hover {
    background-color: #45a049;
}
.signin {
    text-align: center;
    font-size: 14px;
}
.signin a {
    color: #000;
    text-decoration: none;
    font-weight: bold;
    margin-left: 5px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.signin a:hover {
    background-color: #f0f0f0;
}
</style>
</head>
<body>

<div class="form-container">
<div class = "form-header">
<div class="logo-icon">EB</div>
<h1 >EDUBRIDGE</h1>
<center><h2>REGISTER</h2></center>
</div>

<form action="register.php" method="POST">
<label for="fullname">Full Name:</label>
<input type="text" id="fullname" name="fullname" required>

<label for="username">Username:</label>
<input type="text" id="username" name="Username" required>

<label for="email">Email:</label>
<input type="email" id="email" name="email" required>

<label for="password">Password:</label>
<input type="password" id="password" name="password" required>

<center><input type="submit" name="signup" value="Submit"></center>
</form>
<div class="signin"> Already have an account?
<a href="SignIn.php">Sign In</a>
</div>
</div>

</body>
</html>
