document.getElementById("portfolioForm").addEventListener("submit", function(event) {
    const requiredFields = document.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.style.borderColor = "red";
        } else {
            field.style.borderColor = "#ccc";
        }
    });

    if (!isValid) {
        alert("Please fill out all required fields.");
        event.preventDefault();
    }
});