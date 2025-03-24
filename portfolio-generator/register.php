<?php
session_start();
include 'db/dbcon.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = mysqli_real_escape_string($conn, $_POST['fullname']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirmPassword'];

    // Password confirmation check
    if ($password !== $confirm_password) {
        echo "<script>alert('Passwords do not match!'); window.location.href='register.php';</script>";
        exit();
    }

    // Hash the password for security
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Handle profile picture upload
    $profilePicName = $_FILES['profilePic']['name'];
    $profilePicTmp = $_FILES['profilePic']['tmp_name'];
    $profilePicSize = $_FILES['profilePic']['size'];
    $profilePicError = $_FILES['profilePic']['error'];
    $profilePicFolder = "images/" . uniqid() . "_" . $profilePicName;

    // Allowed image formats
    $allowedFormats = ['jpg', 'jpeg', 'png', 'gif'];
    $fileExt = strtolower(pathinfo($profilePicName, PATHINFO_EXTENSION));

    // Validate image file
    if (!in_array($fileExt, $allowedFormats)) {
        echo "<script>alert('Invalid file format. Only JPG, JPEG, PNG, and GIF are allowed.'); window.location.href='register.php';</script>";
        exit();
    }

    if ($profilePicSize > 2 * 1024 * 1024) { // 2MB limit
        echo "<script>alert('File size exceeds 2MB!'); window.location.href='register.php';</script>";
        exit();
    }

    if ($profilePicError === 0) {
        if (move_uploaded_file($profilePicTmp, $profilePicFolder)) {
            // Insert user data into database
            $sql = "INSERT INTO users (fullname, email, password, profilePic) VALUES ('$fullname', '$email', '$hashed_password', '$profilePicFolder')";
            if (mysqli_query($conn, $sql)) {
                echo "<script>alert('Registration successful! You can now log in.'); window.location.href='login.php';</script>";
                exit();
            } else {
                echo "Error: " . mysqli_error($conn);
            }
        } else {
            echo "<script>alert('Failed to upload profile picture.'); window.location.href='register.php';</script>";
            exit();
        }
    } else {
        echo "<script>alert('Error uploading file!'); window.location.href='register.php';</script>";
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Portfolio Builder</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/register.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body>
    <nav>
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="login.php">Login</a></li>
        </ul>
    </nav>

    <div class="registration-container">
        <h2>Create an Account</h2>
        <form method="POST" enctype="multipart/form-data" action="register.php">
            <!-- Profile Picture Upload -->
            <div class="form-group">
                <label for="profilePic">Profile Picture</label>
                <input type="file" id="profilePic" name="profilePic" accept="image/*" required>
                <small>(Max: 2MB)</small>
            </div>

            <div class="form-group">
                <label for="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" required>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
                <small>Minimum 6 characters</small>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>
            </div>

            <button type="submit">Register</button>
            <p>Already have an account? <a href="login.php">Login here</a></p>
        </form>
    </div>

    <footer>
        <p>&copy; 2025 Portfolio Builder. All Rights Reserved.</p>
    </footer>
</body>
</html>
