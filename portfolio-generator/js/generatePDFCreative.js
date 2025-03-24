document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generatePdfBtn").addEventListener("click", generatePDF);
});

function generatePDF() {
    // Get profile image from <img> tag and convert it to Base64
    var profileImage = document.getElementById("profileImage"); // Your profile image tag
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = profileImage.width;
    canvas.height = profileImage.height;
    ctx.drawImage(profileImage, 0, 0, canvas.width, canvas.height);
    var profileImageBase64 = canvas.toDataURL("image/png"); // Convert to Base64

    var docDefinition = {
        content: [

            // HEADER
            { text: 'PORTFOLIO', style: 'header' },
            { text: 'A Creative Showcase', style: 'subheader' },

            { text: ' ', style: 'divider' },

            // PROFILE PHOTO
            {
                image: profileImageBase64,
                width: 80,
                alignment: 'left',
                margin: [0, 0, 0, 10]
            },

            // PERSONAL DETAILS
            { text: 'Personal Information', style: 'sectionTitle' },
            {
                table: {
                    widths: ['30%', '70%'],
                    body: [
                        [{ text: 'Full Name:', bold: true, color: 'red' }, { text: document.querySelector("input[name='fullname']").value }],
                        [{ text: 'Contact:', bold: true, color: 'red' }, { text: document.querySelector("input[name='contact_info']").value }],
                        [{ text: 'Short Bio:', bold: true, color: 'red' }, { text: document.querySelector("textarea[name='short_bio']").value }]
                    ]
                },
                layout: 'lightHorizontalLines'
            },

            { text: ' ', style: 'divider' },

            // SKILLS
            { text: 'Skills', style: 'sectionTitle' },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [{ text: 'Soft Skills', bold: true, fillColor: '#ff5733', color: 'white', alignment: 'center' },
                        { text: 'Technical Skills', bold: true, fillColor: '#ff5733', color: 'white', alignment: 'center' }],
                        [document.querySelector("input[name='soft_skills']").value, document.querySelector("input[name='technical_skills']").value]
                    ]
                }
            },

            { text: ' ', style: 'divider' },


            // ACADEMIC BACKGROUND
            document.getElementById("toggleAcademic").checked
                ? { text: 'Academic Background', style: 'sectionTitle' }
                : {},

            document.getElementById("toggleAcademic").checked
                ? {
                    table: {
                        widths: ['30%', '30%', '20%', '20%'],
                        body: [
                            [{ text: 'Institute', bold: true, fillColor: 'black', color: 'white' },
                            { text: 'Degree', bold: true, fillColor: 'black', color: 'white' },
                            { text: 'Year', bold: true, fillColor: 'black', color: 'white' },
                            { text: 'Grade', bold: true, fillColor: 'black', color: 'white' }]
                        ].concat(
                            Array.from(document.querySelectorAll("#academicContainer .academic-entry")).map(entry => [
                                entry.querySelector("input[name='institute[]']").value,
                                entry.querySelector("input[name='degree[]']").value,
                                entry.querySelector("input[name='year[]']").value,
                                entry.querySelector("input[name='grade[]']").value
                            ])
                        )
                    }
                }
                : {},

            { text: ' ', style: 'divider' },

            // WORK EXPERIENCE
            document.getElementById("toggleWork").checked
                ? { text: 'Work Experience', style: 'sectionTitle' }
                : {},

            document.getElementById("toggleWork").checked
                ? {
                    table: {
                        widths: ['30%', '20%', '50%'],
                        body: [
                            [{ text: 'Company', bold: true, fillColor: '#ff5733', color: 'white' },
                            { text: 'Duration', bold: true, fillColor: '#ff5733', color: 'white' },
                            { text: 'Responsibilities', bold: true, fillColor: '#ff5733', color: 'white' }]
                        ].concat(
                            Array.from(document.querySelectorAll("#workContainer .work-entry")).map(entry => [
                                entry.querySelector("input[name='company_name[]']").value,
                                entry.querySelector("input[name='job_duration[]']").value,
                                entry.querySelector("textarea[name='job_responsibilities[]']").value
                            ])
                        )
                    }
                }
                : {},


            // PUBLICATIONS
            document.getElementById("togglePublications").checked
                ? { text: 'Projects/Publications', style: 'sectionTitle' }
                : {},

            document.getElementById("togglePublications").checked
                ? {
                    ul: Array.from(document.querySelectorAll("#publicationsContainer .publication-entry textarea")).map(entry => entry.value)
                }
                : {}
        ],
        styles: {
            header: { fontSize: 22, bold: true, color: 'black', alignment: 'center', margin: [0, 0, 0, 10] },
            subheader: { fontSize: 14, italics: true, color: '#ff5733', alignment: 'center', margin: [0, 0, 0, 10] },
            sectionTitle: { fontSize: 16, bold: true, color: 'black', margin: [0, 10, 0, 5] },
            divider: { fontSize: 10, color: '#ff5733', alignment: 'center', margin: [0, 5, 0, 5] }
        }
    };

    pdfMake.createPdf(docDefinition).download("portfolio_creative.pdf");
}
