import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled, { css } from "styled-components";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

// PDF.js worker 파일의 경로를 설정합니다.
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

const pdfWidth = 55;
const PDFViewer = ({ closeModal, paper }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPageNumber, setInputPageNumber] = useState(pageNumber);

  useEffect(() => {
    setInputPageNumber(pageNumber);
  }, [pageNumber]);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const setNum = (num) => {
    setPageNumber(num);
    setInputPageNumber(num);
  };
  const handleDownload = async () => {
    const existingPdfBytes = await fetch(paper.pdf).then((res) => res.arrayBuffer());
    const existingPdf = await PDFDocument.load(existingPdfBytes);

    // 첫 번째 페이지 가져오기
    const pages = existingPdf.getPages();
    const firstPage = pages[0];

    // 페이지에 코드(id) 추가
    firstPage.drawText(`Code: ${paper.id}`, {
      x: 465,
      y: 790,
      size: 15,
    });

    const mergedPdfBytes = await existingPdf.save();
    const fileTitle = `${paper.title}_문제지`;
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    saveAs(blob, `${fileTitle}.pdf`);
  };

  return (
    <MODAL.ModalOverlay>
      <MODAL.Modal>
        <MODAL.TitleLine>
          <MODAL.Title>학습지 미리보기</MODAL.Title>
        </MODAL.TitleLine>
        <MODAL.ContentContainer>
          <VIEWPDF.Wrapper>
            <Document file={paper.pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} width={pdfWidth * 10} />
            </Document>
            <VIEWPDF.Navigation>
              <VIEWPDF.NavigateBtn
                $onBoundary={pageNumber === 1}
                onClick={() => (pageNumber > 1 ? setNum(pageNumber - 1) : null)}
              >
                <FontAwesomeIcon icon={faCaretLeft} />
              </VIEWPDF.NavigateBtn>
              <VIEWPDF.NavigateBtn
                $onBoundary={pageNumber === numPages}
                onClick={() => (pageNumber < numPages ? setNum(pageNumber + 1) : null)}
              >
                <FontAwesomeIcon icon={faCaretRight} />
              </VIEWPDF.NavigateBtn>
            </VIEWPDF.Navigation>
          </VIEWPDF.Wrapper>
        </MODAL.ContentContainer>
        <MODAL.BtnLine>
          <MODAL.CloseBtn onClick={closeModal}>닫기</MODAL.CloseBtn>
          <VIEWPDF.PageInputBox>
            <VIEWPDF.PageInput
              $length={inputPageNumber < 9 ? 1 : inputPageNumber > 99 ? 3 : 2}
              value={inputPageNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (/^\d+$/.test(value) && value.length <= 3)) {
                  setInputPageNumber(value);
                }
              }}
              onBlur={() => {
                const pageNum = parseInt(inputPageNumber, 10);
                if (pageNum >= 1 && pageNum <= numPages) {
                  setPageNumber(pageNum);
                } else {
                  setInputPageNumber(pageNumber); // Reset to the current page number if out of bounds
                }
              }}
            />
            / {numPages}
          </VIEWPDF.PageInputBox>
          <MODAL.DownloadBtn onClick={handleDownload}>다운로드</MODAL.DownloadBtn>
        </MODAL.BtnLine>
      </MODAL.Modal>
    </MODAL.ModalOverlay>
  );
};

export default PDFViewer;

const MODAL = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    z-index: 10;
    align-items: center;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 59rem;
    min-height: 20rem;
    height: 89rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    height: 5rem;
    width: 100%;
    padding-inline: 2rem;
    display: flex;
    align-items: center;
  `,
  Title: styled.div`
    font-size: 2rem;
    font-weight: 700;
  `,
  ContentContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding-inline: 2rem;
  `,
  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    padding-inline: 2rem;
    padding-block: 1rem;
  `,

  CloseBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  DownloadBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
  `,
};

const VIEWPDF = {
  Wrapper: styled.div`
    width: ${pdfWidth}rem;
    height: ${pdfWidth * 1.414}rem;
    overflow: hidden;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-radius: 0.6rem;
    color: white;
  `,

  Navigation: styled.div`
    z-index: 10;
    display: flex;
    justify-content: space-between;
  `,
  NavigateBtn: styled.div`
    margin-top: ${pdfWidth * -1.414}rem;
    z-index: 15;
    width: 8rem;
    height: ${pdfWidth * 1.414}rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0);
    &:hover {
      ${({ $onBoundary }) =>
        $onBoundary
          ? css`
              background: rgba(0, 0, 0, 0.05);
              cursor: not-allowed;
            `
          : css`
              background: rgba(0, 0, 0, 0.2);
              color: black;
              font-size: 7rem;
              cursor: pointer;
            `}
    }
  `,
  PageInputBox: styled.div`
    z-index: 15;
    padding-right: 1rem;
    padding-left: 0.2rem;
    height: 3.5rem;
    border-radius: 0.6rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
    color: ${({ theme }) => theme.colors.gray50};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 1.6rem;
    font-weight: 600;
    margin-inline: auto;
  `,
  PageInput: styled.input`
    margin-top: 0.175rem;
    height: 3.5rem;
    width: ${({ $length }) => $length * 1 + 1.5}rem;
    max-width: 4rem;
    padding-left: 0.8rem;
    outline: none;
    border-radius: 0.6rem;
    border: 0;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 600;
  `,
};
