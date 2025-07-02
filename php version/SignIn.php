<?php
include 'connection.php';

$error_message = '';
$debug_message = '';

if(isset($_POST['signIn'])) {
    $login_field = $_POST['username'];
    $password = $_POST['password'];

if(empty($login_field) || empty($password)) {
    $error_message = "Please fill in all required fields.";
} else {
    $debug_message = "Searching for: " . $login_field;
        
// Compare directly with plain text password
    $sql = "SELECT * FROM users WHERE (username = '$login_field' OR email = '$login_field') AND password = '$password'";
    $result = $conn->query($sql);
        
if($result->num_rows > 0) {
// Credentials found - successful login
    session_start();
    $row = $result->fetch_assoc();
    $_SESSION['username'] = $row['username'];
    $_SESSION['email'] = $row['email'];
            
    header("Location: Homepage.php");
    exit();
} else {
// Check if email exists but password is wrong
    $check_user = "SELECT * FROM users WHERE username = '$login_field' OR email = '$login_field'";
    $user_result = $conn->query($check_user);
            
if($user_result->num_rows > 0) {
    $error_message = "Account found but password is incorrect.";
} else {
    $error_message = "Account not found. Please check your username/email or sign up for a new account.";
}
}
}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EduBridge -Sign In</title>
<style>
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: #f5f5f5;
}
.signin-container {
    border: 5px solid #4CAF50;
    padding: 20px;
    border-radius: 10px;
    width: 600px; /* Made wider for debug info */
    margin: 50px auto;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    background-color: white; 
}
.form-group {
    margin-bottom: 1rem;
}
.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}
.form-input {
    width: 90%;
    padding: 0.5rem;
    border: 2px solid #ccc;
    border-radius: 5px;
}
.submit-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}
.error-message {
    background-color: #fee;
    color: #c33;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 1rem;
    border: 1px solid #fcc;
}
</style>
</head>
<body>
<div class="signin-container">
<h2>LOGIN FORM</h2>
        
<?php if(!empty($error_message)): ?>
<div class="error-message">
<?php echo $error_message; ?>
</div>
<?php endif; ?>

<form method="POST" action="">
<div class="form-group">
<label class="form-label">Username or Email:</label>
<input type="text" class="form-input" name="username" required value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>">
</div>

<div class="form-group">
<label class="form-label">Password:</label>
<input type="password" class="form-input" name="password" required>
</div>

<button type="submit" name="signIn" class="submit-btn">Sign In</button>
</form>
</div>
</body>
</html>