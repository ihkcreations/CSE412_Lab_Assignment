document.addEventListener("DOMContentLoaded", function () {
    function toggleSection(sectionId, isChecked) {
        document.getElementById(sectionId).style.display = isChecked ? "block" : "none";
    }

    // Get saved values from dataset (these will be set in portfolio.php)
    const toggleAcademic = document.getElementById("toggleAcademic");
    const toggleWork = document.getElementById("toggleWork");
    const togglePublications = document.getElementById("togglePublications");

    const academicUsed = toggleAcademic.dataset.saved === "true";
    const workUsed = toggleWork.dataset.saved === "true";
    const publicationsUsed = togglePublications.dataset.saved === "true";

    // Auto-check checkboxes based on saved data
    toggleAcademic.checked = academicUsed;
    toggleWork.checked = workUsed;
    togglePublications.checked = publicationsUsed;

    toggleSection("academicSection", academicUsed);
    toggleSection("workSection", workUsed);
    toggleSection("publicationsSection", publicationsUsed);

    // Add event listeners to toggle sections on checkbox change
    toggleAcademic.addEventListener("change", function () {
        toggleSection("academicSection", this.checked);
    });

    toggleWork.addEventListener("change", function () {
        toggleSection("workSection", this.checked);
    });

    togglePublications.addEventListener("change", function () {
        toggleSection("publicationsSection", this.checked);
    });
});

// Function to Show/Hide Sections
function toggleSection(sectionId, isChecked) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = isChecked ? "block" : "none";
    }
}

// Ensure sections are shown/hidden correctly when the page loads
function initializeSections() {
    toggleSection("academicSection", document.getElementById("toggleAcademic").checked);
    toggleSection("workSection", document.getElementById("toggleWork").checked);
    toggleSection("publicationsSection", document.getElementById("togglePublications").checked);
}

// Add Academic Entry
function addAcademicEntry() {
    const container = document.getElementById("academicContainer");
    const newEntry = document.createElement("div");
    newEntry.classList.add("academic-entry");
    newEntry.innerHTML = `
        <input type="text" name="institute[]" placeholder="Institute" required>
        <input type="text" name="degree[]" placeholder="Degree" required>
        <input type="text" name="year[]" placeholder="Year" required>
        <input type="text" name="grade[]" placeholder="Grade" required>
        <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
    `;
    container.appendChild(newEntry);
}

// Add Work Experience Entry
function addWorkEntry() {
    const container = document.getElementById("workContainer");
    const newEntry = document.createElement("div");
    newEntry.classList.add("work-entry");
    newEntry.innerHTML = `
        <input type="text" name="company_name[]" placeholder="Company Name" required>
        <input type="text" name="job_duration[]" placeholder="Job Duration" required>
        <textarea name="job_responsibilities[]" placeholder="Job Responsibilities" required></textarea>
        <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
    `;
    container.appendChild(newEntry);
}

// Add Publication Entry
function addPublicationEntry() {
    const container = document.getElementById("publicationsContainer");
    const newEntry = document.createElement("div");
    newEntry.classList.add("publication-entry");
    newEntry.innerHTML = `
        <textarea name="projects_publications[]" placeholder="Add your project or publication..." required></textarea>
        <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
    `;
    container.appendChild(newEntry);
}

// Remove Entry
function removeEntry(button) {
    button.parentElement.remove();
}


document.getElementById("generatePdfBtn").addEventListener("click", function () {
    // Get the selected theme
    const selectedTheme = document.querySelector('input[name="theme"]:checked')?.value;

    if (selectedTheme) {
        // Dynamically load the corresponding script
        const scriptTag = document.createElement('script');
        scriptTag.src = selectedTheme;
        scriptTag.onload = function () {
            // The theme's script is loaded, call the theme's function
            if (typeof generatePDF === "function") {
                generatePDF(); 
            } else {
                console.error("The function `generatePDF` is not defined in the theme script.");
            }
        };
        scriptTag.onerror = function () {
            alert(`Failed to load the theme: ${selectedTheme}`);
        };

        // Append the script to the document
        document.body.appendChild(scriptTag);
    } else {
        alert("Please select a theme to generate the PDF.");
    }
});
