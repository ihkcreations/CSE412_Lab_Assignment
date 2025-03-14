document.addEventListener("DOMContentLoaded", function () {
  const registerButton = document.getElementById("registerButton");
  const registerSection = document.getElementById("registerSection");

  registerButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link action
    registerSection.style.display = "block"; // Show the registration form
    registerButton.style.display = "none"; // Hide the register button to prevent multiple clicks
  });
});
