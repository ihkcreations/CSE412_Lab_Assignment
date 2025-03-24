document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const hobby = document.getElementById("hobby").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const profilePic = document.getElementById("profilePic").files[0];

    // Validation
    if (
      fullName === "" ||
      email === "" ||
      phone === "" ||
      address === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (phone.length < 10 || phone.length > 15 || isNaN(phone)) {
      alert("Phone number must be a valid number (10-15 digits).");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (profilePic) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(profilePic.type)) {
        alert("Only JPG and PNG files are allowed.");
        return;
      }

      if (profilePic.size > 2 * 1024 * 1024) {
        alert("Profile picture size should not exceed 2MB.");
        return;
      }
    }

    // Simulate successful registration
    alert("Registration Successful! Redirecting to login page...");
    window.location.href = "login.html"; // Redirect to login
  });
});
