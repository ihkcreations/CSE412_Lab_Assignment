document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generatePdfBtn").addEventListener("click", generatePDF);
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPosition = 20;

    // Add Sky Blue Header
    doc.setFillColor(42, 134, 227); // Sky blue color
    doc.rect(0, 0, 210, 30, "F"); // Full-width colored rectangle

    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Portfolio", 105, 15, { align: "center" });

    doc.setTextColor(0, 0, 0); // Reset text color
    yPosition += 40;

    // Get form data
    const fullName = document.querySelector("input[name='fullname']").value;
    const contactInfo = document.querySelector("input[name='contact_info']").value;
    const shortBio = document.querySelector("textarea[name='short_bio']").value;
    const softSkills = document.querySelector("input[name='soft_skills']").value;
    const technicalSkills = document.querySelector("input[name='technical_skills']").value;

    // Personal Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Personal Information", 10, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 8;

    doc.text(`Name: ${fullName}`, 10, yPosition);
    doc.text(`Contact: ${contactInfo}`, 10, yPosition + 8);
    doc.text("Short Bio:", 10, yPosition + 16);
    doc.setFont("helvetica", "italic");
    doc.text(shortBio, 10, yPosition + 22, { maxWidth: 180 });

    yPosition += 40;

    // Skills Section
    doc.setFont("helvetica", "bold");
    doc.text("Skills", 10, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 8;

    doc.text(`Soft Skills: ${softSkills}`, 10, yPosition);
    doc.text(`Technical Skills: ${technicalSkills}`, 10, yPosition + 8);

    yPosition += 20;

    // Academic Background Table
    if (document.getElementById("toggleAcademic").checked) {
        doc.setFont("helvetica", "bold");
        doc.text("Academic Background", 10, yPosition);
        yPosition += 6;

        const academicData = [];
        document.querySelectorAll("#academicContainer .academic-entry").forEach((entry) => {
            const institute = entry.querySelector("input[name='institute[]']").value;
            const degree = entry.querySelector("input[name='degree[]']").value;
            const year = entry.querySelector("input[name='year[]']").value;
            const grade = entry.querySelector("input[name='grade[]']").value;

            academicData.push([institute, degree, year, grade]);
        });

        doc.autoTable({
            startY: yPosition,
            head: [["Institute", "Degree", "Year", "Grade"]],
            body: academicData,
            theme: "grid",
            headStyles: { fillColor: [42, 134, 227] },
            styles: { cellWidth: "wrap" },
            
        });

        yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Work Experience Table
    if (document.getElementById("toggleWork").checked) {
        doc.setFont("helvetica", "bold");
        doc.text("Work Experience", 10, yPosition);
        yPosition += 6;

        const workData = [];
        document.querySelectorAll("#workContainer .work-entry").forEach((entry) => {
            const company = entry.querySelector("input[name='company_name[]']").value;
            const duration = entry.querySelector("input[name='job_duration[]']").value;
            const responsibilities = entry.querySelector("textarea[name='job_responsibilities[]']").value;

            workData.push([company, duration, responsibilities]);
        });

        doc.autoTable({
            startY: yPosition,
            head: [["Company", "Duration", "Responsibilities"]],
            body: workData,
            theme: "grid",
            styles: { cellWidth: "wrap" },
            headStyles: { fillColor: [42, 134, 227] },
        });

        yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Projects/Publications Table
    if (document.getElementById("togglePublications").checked) {
        doc.setFont("helvetica", "bold");
        doc.text("Projects/Publications", 10, yPosition);
        yPosition += 6;

        const publicationsData = [];
        document.querySelectorAll("#publicationsContainer .publication-entry textarea").forEach((entry) => {
            publicationsData.push([entry.value]);
        });

        doc.autoTable({
            startY: yPosition,
            head: [["Projects/Publications"]],
            body: publicationsData,
            theme: "grid",
            styles: { cellWidth: "wrap" },
            headStyles: { fillColor: [42, 134, 227] },
        });

        yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Save the PDF
    doc.save("portfolio.pdf");
}
