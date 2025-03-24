document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generatePdfBtn").addEventListener("click", function () {
        const selectedTheme = document.querySelector("input[name='theme']:checked");
        if (!selectedTheme) {
            alert("Please select a theme first.");
            return;
        }

        const theme = selectedTheme.value;
        let scriptSrc = "";

        // Determine which script to load based on the selected theme
        if (theme === "classic") {
            scriptSrc = "js/generatePDFClassic.js";
        } else if (theme === "modern") {
            scriptSrc = "js/generatePDFModern.js";
        } else if (theme === "creative") {
            scriptSrc = "js/generatePDFCreative.js";
        }

        if (scriptSrc) {
            const existingScript = document.getElementById("pdfGeneratorScript");
            if (existingScript) {
                existingScript.remove(); // Remove the existing script if already present
            }

            const script = document.createElement("script");
            script.src = scriptSrc;
            script.id = "pdfGeneratorScript";
            script.onload = function () {
                generatePDF(); // Call the function after the script loads
            };

            document.body.appendChild(script);
        }
    });
});