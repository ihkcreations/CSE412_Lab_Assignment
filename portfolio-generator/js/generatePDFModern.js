document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generatePdfBtn").addEventListener("click", generatePDF);
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Define colors
    const primaryColor = [41, 128, 185]; // Modern Blue
    const textColor = [44, 62, 80]; // Dark Gray
    const lightGray = [200, 200, 200];

    let yPosition = 20;

    // Add header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Professional Portfolio", 15, 15);
    
    yPosition = 40;
    doc.setTextColor(...textColor);
    doc.setFontSize(14);

    // Get form data
    const fullName = document.querySelector("input[name='fullname']").value;
    const contactInfo = document.querySelector("input[name='contact_info']").value;
    const shortBio = document.querySelector("textarea[name='short_bio']").value;
    const softSkills = document.querySelector("input[name='soft_skills']").value;
    const technicalSkills = document.querySelector("input[name='technical_skills']").value;

    // Name & Contact
    doc.setFontSize(16);
    doc.text(fullName, 15, yPosition);
    yPosition += 8;
    doc.setFontSize(12);
    doc.text(`Contact: ${contactInfo}`, 15, yPosition);
    yPosition += 12;

    // Short Bio Section
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, 195, yPosition);
    yPosition += 6;
    doc.setFontSize(14);
    doc.text("About Me", 15, yPosition);
    yPosition += 6;
    doc.setFontSize(12);
    doc.text(shortBio, 15, yPosition, { maxWidth: 180 });
    yPosition += 15;

    // Skills Section
    doc.setFontSize(14);
    doc.text("Skills", 15, yPosition);
    yPosition += 6;
    doc.setFontSize(12);
    doc.text(`Soft Skills: ${softSkills}`, 15, yPosition);
    yPosition += 6;
    doc.text(`Technical Skills: ${technicalSkills}`, 15, yPosition);
    yPosition += 12;

    // Academic Background Table
    if (document.getElementById("toggleAcademic").checked) {
        doc.setFontSize(14);
        doc.text("Academic Background", 15, yPosition);
        yPosition += 6;

        let academicData = [["Institute", "Degree", "Year", "Grade"]];
        document.querySelectorAll("#academicContainer .academic-entry").forEach((entry) => {
            academicData.push([
                entry.querySelector("input[name='institute[]']").value,
                entry.querySelector("input[name='degree[]']").value,
                entry.querySelector("input[name='year[]']").value,
                entry.querySelector("input[name='grade[]']").value,
            ]);
        });

        doc.autoTable({
            startY: yPosition,
            head: [academicData[0]],
            body: academicData.slice(1),
            theme: "grid",
            styles: { fillColor: lightGray },
            headStyles: { fillColor: primaryColor, textColor: 255 },
        });

        yPosition = doc.autoTable.previous.finalY + 10;
    }

    // Work Experience Table
    if (document.getElementById("toggleWork").checked) {
        doc.setFontSize(14);
        doc.text("Work Experience", 15, yPosition);
        yPosition += 6;

        let workData = [["Company", "Duration", "Responsibilities"]];
        document.querySelectorAll("#workContainer .work-entry").forEach((entry) => {
            workData.push([
                entry.querySelector("input[name='company_name[]']").value,
                entry.querySelector("input[name='job_duration[]']").value,
                entry.querySelector("textarea[name='job_responsibilities[]']").value,
            ]);
        });

        doc.autoTable({
            startY: yPosition,
            head: [workData[0]],
            body: workData.slice(1),
            theme: "grid",
            styles: { fillColor: lightGray },
            headStyles: { fillColor: primaryColor, textColor: 255 },
        });

        yPosition = doc.autoTable.previous.finalY + 10;
    }

    // Projects/Publications
    if (document.getElementById("togglePublications").checked) {
        doc.setFontSize(14);
        doc.text("Projects/Publications", 15, yPosition);
        yPosition += 6;

        document.querySelectorAll("#publicationsContainer .publication-entry textarea").forEach((entry) => {
            doc.text(`- ${entry.value}`, 15, yPosition);
            yPosition += 8;
        });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Generated using Portfolio Builder", 15, 285);
    doc.text(`Page 1`, 180, 285);

    // Save the PDF
    doc.save("portfolio_modern.pdf");
}
