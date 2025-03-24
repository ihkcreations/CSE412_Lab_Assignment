<?php
session_start();
include 'db/dbcon.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch user details
$query = "SELECT fullname, profilePic, email FROM users WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$fullname = $user['fullname'];
$email = $user['email'];
$profilePic = $user['profilePic'];

// Fetch saved progress
$progressQuery = "SELECT * FROM portfolio_progress WHERE user_id = ?";
$progressStmt = $conn->prepare($progressQuery);
$progressStmt->bind_param("i", $user_id);
$progressStmt->execute();
$progressResult = $progressStmt->get_result();
$savedData = $progressResult->fetch_assoc();

// Load saved values
$short_bio = $savedData['short_bio'] ?? '';
$soft_skills = $savedData['soft_skills'] ?? '';
$technical_skills = $savedData['technical_skills'] ?? '';
$academic_background = json_decode($savedData['academic_background'] ?? '[]', true);
$work_experience = json_decode($savedData['work_experience'] ?? '[]', true);
$publications = json_decode($savedData['publications'] ?? '[]', true);
$theme = $savedData['theme'] ?? '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Your Portfolio</title>
    <link rel="stylesheet" href="css/portfolio.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>



    <style>
        .navbar {
            display: flex;
            justify-content: space-between;
            background-color: #333;
            padding: 10px 20px;
            align-items: center;
            top: 0;
            position: sticky;
            z-index: 1000;
        }

        .navbar h1 {
            color: white;
            font-size: 22px;
        }

        .logout-btn {
            background-color: skyblue;
            color: white;
            padding: 8px 12px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
        }

        .logout-btn:hover {
            background-color: darkblue;
        }

        .profile-container {
            text-align: center;
            margin-bottom: 20px;
            margin-top: 25px;
        }

        .profile-container img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #333;
        }

        .profile-container h2 {
            margin-top: 10px;
            font-size: 20px;
        }
    </style>
</head>

<body>

    <!-- Navbar with Logout Button -->
    <div class="navbar">
        <h1>Portfolio Builder</h1>
        <form method="post" action="logout.php">
            <button type="submit" class="logout-btn">Logout</button>
        </form>
    </div>

    <header>
        <h1>Create Your Professional Portfolio</h1>
        <p>Fill out the details below to generate your portfolio</p>
    </header>

    <!-- User Profile Section -->
    <section class="profile-container">
        <img id="profileImage" src="<?php echo htmlspecialchars($profilePic); ?>" alt="Profile Picture">
        <h2><?php echo htmlspecialchars($fullname); ?></h2>
    </section>

    <section class="portfolio-container">
        <form id="portfolioForm" method="post" action="save_progress.php">
            <h1>Create Your Portfolio</h1>

            <fieldset>
                <legend>Personal Information</legend>
                <input type="text" name="fullname" value="<?php echo htmlspecialchars($fullname); ?>" required>
                <input type="email" name="contact_info" value="<?php echo htmlspecialchars($email); ?>" required>
                <textarea name="short_bio" placeholder="Write a short bio..."><?php echo htmlspecialchars($short_bio); ?></textarea>
            </fieldset>

            <fieldset>
                <legend>Skills</legend>
                <input type="text" name="soft_skills" value="<?php echo htmlspecialchars($soft_skills); ?>" placeholder="Soft Skills (comma-separated)">
                <input type="text" name="technical_skills" value="<?php echo htmlspecialchars($technical_skills); ?>" placeholder="Technical Skills (comma-separated)">
            </fieldset>

            <!-- Section Selection -->
            <fieldset>
                <legend>Select Sections to Include</legend>
                <label>
                    <input type="checkbox" id="toggleAcademic" data-saved="<?php echo !empty($academic_background) ? 'true' : 'false'; ?>"> Academic Background
                </label>
                <label>
                    <input type="checkbox" id="toggleWork" data-saved="<?php echo !empty($work_experience) ? 'true' : 'false'; ?>"> Work Experience

                </label>
                <label>
                    <input type="checkbox" id="togglePublications" data-saved="<?php echo !empty($publications) ? 'true' : 'false'; ?>">
                    Projects/Publications
                </label>
            </fieldset>

            <!-- Academic Background Section -->
            <fieldset id="academicSection">
                <legend>Academic Background</legend>
                <div id="academicContainer">
                    <?php foreach ($academic_background as $entry) { ?>
                        <div class="academic-entry">
                            <input type="text" name="institute[]" placeholder="Institute" value="<?php echo htmlspecialchars($entry['institute']); ?>">
                            <input type="text" name="degree[]" placeholder="Degree" value="<?php echo htmlspecialchars($entry['degree']); ?>">
                            <input type="text" name="year[]" placeholder="Year" value="<?php echo htmlspecialchars($entry['year']); ?>">
                            <input type="text" name="grade[]" placeholder="Grade" value="<?php echo htmlspecialchars($entry['grade']); ?>">
                        </div>
                    <?php } ?>
                </div>
                <button type="button" onclick="addAcademicEntry()">Add Another</button>
            </fieldset>

            <!-- Work Experience Section -->
            <fieldset id="workSection">
                <legend>Work Experience</legend>
                <div id="workContainer">
                    <?php foreach ($work_experience as $entry) { ?>
                        <div class="work-entry">
                            <input type="text" name="company_name[]" placeholder="Company Name" value="<?php echo htmlspecialchars($entry['company_name']); ?>">
                            <input type="text" name="job_duration[]" placeholder="Job Duration" value="<?php echo htmlspecialchars($entry['job_duration']); ?>">
                            <textarea name="job_responsibilities[]"><?php echo htmlspecialchars($entry['job_responsibilities']); ?></textarea>
                        </div>
                    <?php } ?>
                </div>
                <button type="button" onclick="addWorkEntry()">Add Another</button>
            </fieldset>

            <!-- Projects/Publication Section -->
            <fieldset id="publicationsSection">
                <legend>Projects/Publications</legend>
                <div id="publicationsContainer">
                    <?php if (!empty($publications)) {
                        foreach ($publications as $entry) { ?>
                            <div class="publication-entry">
                                <textarea name="projects_publications[]" placeholder="Add your project or publication..."><?php echo htmlspecialchars($entry); ?></textarea>
                                <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
                            </div>
                        <?php }
                    } else { ?>
                        <div class="publication-entry">
                            <textarea name="projects_publications[]" placeholder="Add your project or publication..."></textarea>
                            <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
                        </div>
                    <?php } ?>
                </div>
                <button type="button" class="add-btn" onclick="addPublicationEntry()">Add Another</button>
            </fieldset>


            <fieldset>
                <legend>Select Portfolio Theme</legend>
                <label><input type="radio" name="theme" value="js/generatePDFClassic.js" <?php echo ($theme == 'classic') ? 'checked' : ''; ?>> Classic Theme</label>
                <label><input type="radio" name="theme" value="js/generatePDFModern.js" <?php echo ($theme == 'modern') ? 'checked' : ''; ?>> Modern Theme</label>
                <label><input type="radio" name="theme" value="js/generatePDFCreative.js" <?php echo ($theme == 'creative') ? 'checked' : ''; ?>> Creative Theme</label>

            </fieldset>

            <button type="submit" name="save_progress">Save Progress</button>

        </form>
        <button type="button" id="generatePdfBtn">Generate Portfolio as PDF</button>


        <script src="js/portfolio.js"></script>
    </section>

    <footer>
        <p>&copy; 2025 Portfolio Builder. All Rights Reserved.</p>
    </footer>

    <!-- <script src="js/clientSideValidation.js"></script> -->

</body>

</html>