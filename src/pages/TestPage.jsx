import React from "react";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";

const TestPage = () => {
  const pdfurl =
    "https://s3.ap-northeast-2.amazonaws.com/science-match-bucket/question-paper/image/d8ba3237-5330-4b6a-90d9-bd1a1e40fb5d.pdf";

  const generateMergedPDF = async () => {
    // 기존 PDF 파일 URL에서 불러오기
    const existingPdfBytes = await fetch(pdfurl).then((res) => res.arrayBuffer());
    const existingPdf = await PDFDocument.load(existingPdfBytes);

    // 새로운 PDF 페이지 생성
    const newPdf = new jsPDF();

    // O 아이콘 그리기 (원의 중심 좌표와 반지름을 설정)
    const centerX = 20;
    const centerY = 20;
    const radius = 3.5; // 반지름 3.5mm -> 직경 7mm
    newPdf.circle(centerX, centerY, radius);

    // 새로운 PDF 페이지를 기존 PDF에 추가
    const newPdfBytes = newPdf.output("arraybuffer");
    const newPdfDoc = await PDFDocument.load(newPdfBytes);
    const [newPage] = await existingPdf.copyPages(newPdfDoc, [0]);
    existingPdf.addPage(newPage);

    // 병합된 PDF 다운로드
    const mergedPdfBytes = await existingPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={generateMergedPDF}>Download PDF</button>
    </div>
  );
};

export default TestPage;
