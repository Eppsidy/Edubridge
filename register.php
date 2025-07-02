<?php 
include 'connection.php';

if(isset($_POST["signup"])) {
    $fullname = $_POST['fullname'];
    $username = $_POST['Username'];  
    $email = $_POST['email'];
    $password = $_POST['password'];

if(empty($fullname) || empty($username) || empty($email) || empty($password)) {
    echo "All fields are required!";
    exit();
}
// Check if username OR email already exists
$checkCredentials = "SELECT * FROM users WHERE email = '$email' OR username = '$username'";
$result = $conn->query($checkCredentials);

if($result->num_rows > 0) {
// Credentials already exist
    echo "User credentials already exists";
} else {
    // New user - insert into database
    $insertQuery = "INSERT INTO users(fullname, username, email, password)
    VALUES ('$fullname', '$username', '$email', '$password')";
        
if($conn->query($insertQuery) == TRUE) {
// Redirect to homepage for new users
    header("location: Homepage.php");
    exit();
} else {
    echo "Error: ".$conn->error;
}
}
} 
if(isset($_POST['signIn'])) {
    $login_field = $_POST['username'];
    $password = $_POST['password'];

if(empty($login_field) || empty($password)) {
    echo "Please fill in all required fields.";
} else {
// Compare with plain text password
    $sql = "SELECT * FROM users WHERE (username = '$login_field' OR email = '$login_field') AND password = '$password'";
    $result = $conn->query($sql);
        
if($result->num_rows > 0) {
    session_start();
    $row = $result->fetch_assoc();
    $_SESSION['email'] = $row['email'];
    $_SESSION['username'] = $row['username'];
    header("Location: Homepage.php");
    exit();
} else {
    echo "Not found, Incorrect Email or Password";
}
}
}
?>