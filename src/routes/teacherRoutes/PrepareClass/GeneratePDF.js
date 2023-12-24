import React, { useEffect } from "react";
import jsPDF from "jspdf";

const PdfGenerator = (questionSet) => {
  const generatePdf = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Set font size, font type, and font style
    pdf.setFontSize(25);
    pdf.setFont("Arial", "bold");

    // Add "TITLE" text
    pdf.text("PDF genetrated", 10, 30);

    // Load an existing image from a URL and add it to the PDF
    const imageUrl =
      "https://science-match-bucket.s3.ap-northeast-2.amazonaws.com/question/image/949819a6-3530-4f04-a60f-6e01f516affe.jpg" +
      "?r=" +
      Math.floor(Math.random() * 100000); // Replace with your image URL
    pdf.addImage(imageUrl, "JPEG", 50, 100, 100, 100); // Adjust the coordinates and size as needed

    // Save or display the PDF
    //pdf.save("generated.pdf");
    window.open(pdf.output("bloburl"));
  };

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
      <img src="https://science-match-bucket.s3.ap-northeast-2.amazonaws.com/question/image/949819a6-3530-4f04-a60f-6e01f516affe.jpg" />
    </div>
  );
};

export default PdfGenerator;
