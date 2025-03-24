<?php
session_start();
include 'db/dbcon.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Retrieve form data
$short_bio = $_POST['short_bio'] ?? '';
$soft_skills = $_POST['soft_skills'] ?? '';
$technical_skills = $_POST['technical_skills'] ?? '';
$theme = $_POST['theme'] ?? ''; // Capture selected theme

// Handle Academic Background
$academic_background = [];
if (isset($_POST['institute'])) {
    for ($i = 0; $i < count($_POST['institute']); $i++) {
        $academic_background[] = [
            'institute' => $_POST['institute'][$i] ?? '',
            'degree' => $_POST['degree'][$i] ?? '',
            'year' => $_POST['year'][$i] ?? '',
            'grade' => $_POST['grade'][$i] ?? ''
        ];
    }
}

// Handle Work Experience
$work_experience = [];
if (isset($_POST['company_name'])) {
    for ($i = 0; $i < count($_POST['company_name']); $i++) {
        $work_experience[] = [
            'company_name' => $_POST['company_name'][$i] ?? '',
            'job_duration' => $_POST['job_duration'][$i] ?? '',
            'job_responsibilities' => $_POST['job_responsibilities'][$i] ?? ''
        ];
    }
}

// Handle Projects/Publications
$publications = $_POST['projects_publications'] ?? [];

// Convert arrays to JSON for storage
$academic_background_json = json_encode($academic_background);
$work_experience_json = json_encode($work_experience);
$publications_json = json_encode($publications);

// Check if progress exists
$checkQuery = "SELECT id FROM portfolio_progress WHERE user_id = ?";
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->bind_param("i", $user_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    // Update existing progress
    $updateQuery = "UPDATE portfolio_progress 
                    SET short_bio = ?, soft_skills = ?, technical_skills = ?, academic_background = ?, 
                        work_experience = ?, publications = ?, theme = ?
                    WHERE user_id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param(
        "sssssssi",
        $short_bio,
        $soft_skills,
        $technical_skills,
        $academic_background_json,
        $work_experience_json,
        $publications_json,
        $theme,
        $user_id
    );
    $updateStmt->execute();
    $updateStmt->close();
} else {
    // Insert new progress (only if user has never saved before)
    $insertQuery = "INSERT INTO portfolio_progress (user_id, short_bio, soft_skills, technical_skills, 
                    academic_background, work_experience, publications, theme) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param(
        "isssssss",
        $user_id,
        $short_bio,
        $soft_skills,
        $technical_skills,
        $academic_background_json,
        $work_experience_json,
        $publications_json,
        $theme
    );
    $insertStmt->execute();
    $insertStmt->close();
}

$checkStmt->close();
$conn->close();

header("Location: portfolio_2.php?success=1");
exit();
?>
