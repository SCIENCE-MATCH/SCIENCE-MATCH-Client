import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import useGetQuestionPaperDownload from "../../../../libs/hooks/Teacher/Prepare/useGetQuestionPaperDownload";
import nanum_font from "../../../../style/fonts/nanum/Nanum_Base64";
import theme from "../../../../style/theme";

const DownloadModal = ({ closeModal, paper, paperIds }) => {
  const { imgsAndSolutions, getPaperToDownload } = useGetQuestionPaperDownload();
  const [solutions, setSolutions] = useState([]);
  const [includePaper, setIncludePaper] = useState(true);
  const [includeFastAnswer, setIncludeFastAnswer] = useState(false);
  const [includeSolution, setIncludeSolution] = useState(true);
  const [onePdf, setOnePdf] = useState(true);

  useEffect(() => {
    if (paper === null) {
      getPaperToDownload(paperIds.map((paper) => paper.id));
    } else {
      getPaperToDownload([paper.id]);
    }
  }, []);

  useEffect(() => {
    if (imgsAndSolutions.length > 0) {
      setSolutions(imgsAndSolutions);
    }
  }, [imgsAndSolutions]);

  const onDownload = async () => {
    if (paper === null) {
      if (onePdf) {
        const pdfBlobs = [];
        for (let i = 0; i < paperIds.length; i++) {
          const { blob } = await generateMergedPDF(i);
          pdfBlobs.push(blob); // 각 PDF의 Blob을 배열에 추가
        }

        // 모든 PDF를 하나로 병합하고 다운로드
        await mergePDFs(pdfBlobs);
      } else {
        for (let i = 0; i < paperIds.length; i++) {
          const { blob, fileTitle } = await generateMergedPDF(i);
          saveAs(blob, `${fileTitle}.pdf`);
        }
      }
    } else {
      const { blob, fileTitle } = await generateMergedPDF(0);
      saveAs(blob, `${fileTitle}.pdf`);
    }
  };
  const mergePDFs = async (pdfBlobs) => {
    // 새로운 PDFDocument 생성
    const mergedPdf = await PDFDocument.create();

    for (const pdfBlob of pdfBlobs) {
      // 각 PDFBlob을 PDFDocument로 로드
      const pdf = await PDFDocument.load(await pdfBlob.arrayBuffer());

      // 모든 페이지 복사
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      // 복사된 페이지를 병합된 PDF에 추가
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    // 병합된 PDF 저장
    const mergedPdfBytes = await mergedPdf.save();

    const mergedTitle = `${paperIds[0].title} 및 ${paperIds.length}개 학습지${includePaper ? `_문제지` : ``}${
      includeFastAnswer ? `_빠른정답` : ``
    }${includeSolution ? `_해설` : ``}`;
    // 다운로드
    saveAs(new Blob([mergedPdfBytes], { type: "application/pdf" }), `${mergedTitle}.pdf`);
  };
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  };
  const addTextWithStyle = (pdf, text, x, y, font, weight, size, color) => {
    pdf.setFont(font, weight);
    pdf.setFontSize(size);
    pdf.setTextColor(color);
    pdf.text(text, x, y);
  };
  const addPageNum = (pdf, pageNum) => {
    const pageNumText = `${pageNum}`;
    pdf.setFont("nanum", "normal");
    pdf.setFontSize(15);
    pdf.setTextColor(theme.colors.gray80);
    pdf.text(pageNumText, 105, 289, "center");
  };

  const generateMergedPDF = async (index) => {
    // 새로운 PDF 페이지 생성
    const newPdf = new jsPDF();

    newPdf.addFileToVFS("NanumGothic.ttf", nanum_font.normal);
    newPdf.addFont("NanumGothic.ttf", "nanum", "normal");
    // newPdf.addFileToVFS("NanumGothicBold.ttf", nanum_font.bold);
    // newPdf.addFont("NanumGothicBold.ttf", "nanumBold", "bold");
    newPdf.addFileToVFS("NanumGothicExtraBold.ttf", nanum_font.extraBold);
    newPdf.addFont("NanumGothicExtraBold.ttf", "nanumExtra", "extraBold");

    newPdf.setDrawColor(190, 190, 190);
    newPdf.setLineWidth(0.1);
    const circleNums = ["①", "②", "③", "④", "⑤"];
    const regex = /^[1-5]$/;

    const initSolPosX = 10;
    let solPosX = initSolPosX;
    let solPosY = 20;
    let pageNum = 1;
    let imgPosY = 15;

    let title = "";
    if (paper === null) title = paperIds[index].title;
    else title = paper.title;

    //                       ==============   빠른 정답 추가 부분   ==============
    if (includeFastAnswer) {
      let longSolutions = [];
      addTextWithStyle(newPdf, `빠른 정답`, 175, 15, "nanumExtra", "extraBold", 16, theme.colors.black);
      addTextWithStyle(newPdf, title, 10, 15, "nanumExtra", "extraBold", 16, theme.colors.black);

      newPdf.line(5, solPosY, 205, solPosY);
      solutions[index].solutions.forEach((solution, solIndex) => {
        if (solIndex % 5 === 0) {
          solPosX = initSolPosX;
          solPosY += 10;
          if (solPosY > 280) {
            newPdf.addPage();
            pageNum += 1;
            addPageNum(newPdf, pageNum);

            newPdf.line(5, 20, 205, 20);
            addTextWithStyle(newPdf, `빠른 정답`, 183, 15, "nanumExtra", "extraBold", 12, theme.colors.gray80);
            addTextWithStyle(newPdf, title, 10, 15, "nanumExtra", "extraBold", 12, theme.colors.gray80);
            solPosY = 30;
          }
        }
        let numberText = `${String(solIndex + 1).padStart(2, "0")}. `;
        addTextWithStyle(newPdf, numberText, solPosX, solPosY, "nanum", "normal", 13, theme.colors.gray70);

        if (newPdf.getTextWidth(solution) > 23) {
          longSolutions.push({ index: solIndex + 1, solution: solution });
          addTextWithStyle(
            newPdf,
            `하단 참조`,
            solPosX + newPdf.getTextWidth(numberText),
            solPosY,
            "nanumExtra",
            "extraBold",
            13,
            theme.colors.gray50
          );
        } else {
          addTextWithStyle(
            newPdf,
            `${regex.test(solution) ? circleNums[solution - 1] : solution}`,
            solPosX + newPdf.getTextWidth(numberText),
            solPosY,
            "nanumExtra",
            "extraBold",
            13,
            theme.colors.gray90
          );
        }
        solPosX += 37.5;
      });

      solPosY += 7.5;
      newPdf.line(5, solPosY, 205, solPosY);
      if (longSolutions.length > 0) {
        longSolutions.forEach((it) => {
          solPosY += 10;
          if (solPosY > 270) {
            newPdf.addPage();
            pageNum += 1;
            addPageNum(newPdf, pageNum);
            newPdf.line(5, 20, 205, 20);
            addTextWithStyle(newPdf, `빠른 정답`, 183, 15, "nanum", "normal", 12, theme.colors.gray80);
            addTextWithStyle(newPdf, title, 10, 15, "nanumExtra", "extraBold", 12, theme.colors.gray80);
            solPosY = 30;
          }
          let numberText = `${String(it.index + 1).padStart(2, "0")}. `;
          addTextWithStyle(newPdf, numberText, initSolPosX, solPosY, "nanum", "normal", 13, theme.colors.gray70);

          let currentLine = "";
          let words = it.solution.split(" ");
          let lineHeight = 7;

          words.forEach((word, index) => {
            // 가로 길이가 190을 초과하는지 확인
            if (newPdf.getTextWidth(currentLine + word) > 183) {
              // 초과하면 현재 줄을 출력하고 새 줄로 이동
              addTextWithStyle(
                newPdf,
                currentLine.trim(),
                initSolPosX + newPdf.getTextWidth(numberText),
                solPosY,
                "nanumExtra",
                "extraBold",
                13,
                theme.colors.gray90
              );
              currentLine = word + " ";
              solPosY += lineHeight; // 줄바꿈을 위해 Y 좌표를 이동
            } else {
              currentLine += word + " ";
            }
          });

          // 남아있는 텍스트 출력
          if (currentLine.trim()) {
            addTextWithStyle(
              newPdf,
              currentLine.trim(),
              initSolPosX + newPdf.getTextWidth(numberText),
              solPosY,
              "nanumExtra",
              "extraBold",
              13,
              theme.colors.gray90
            );
          }
        });
      }
      imgPosY = solPosY + 25;
    }

    //                       ==============   정답 해설 추가 부분   ==============
    if (includeSolution) {
      if (imgPosY > 170) {
        newPdf.addPage();
        pageNum += 1;
        imgPosY = 15;
      }
      addTextWithStyle(newPdf, `정답 및 해설`, 170, imgPosY, "nanumExtra", "extraBold", 16, theme.colors.black);
      addTextWithStyle(newPdf, title, 10, imgPosY, "nanumExtra", "extraBold", 16, theme.colors.black);
      imgPosY += 5;
      newPdf.line(5, imgPosY, 205, imgPosY);
      newPdf.line(105, imgPosY, 105, 282);
      addPageNum(newPdf, pageNum);

      let posX = 9;
      let posY = imgPosY + 10;
      for (const [imgIndex, imageUrl] of solutions[index].solutionImages.entries()) {
        try {
          const img = await loadImage(imageUrl); // imageURL을 imageUrl로 변경
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;

          const imgurl = `${imageUrl}?r=` + Math.floor(Math.random() * 100000);
          const pdfImgWidth = 75;
          const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

          if (posY + pdfImgHeight > 282) {
            if (posX < 20) {
              posX += 105;
              posY = imgPosY + 10;
            } else {
              newPdf.addPage();
              pageNum += 1;
              addPageNum(newPdf, pageNum);
              addTextWithStyle(newPdf, "정답 및 해설", 178, 15, "nanumExtra", "extraBold", 12, theme.colors.gray80);
              addTextWithStyle(newPdf, title, 10, 15, "nanumExtra", "extraBold", 12, theme.colors.gray80);
              solPosY = 30;
              newPdf.line(5, 20, 205, 20);
              newPdf.line(105, 20, 105, 282);
              imgPosY = 20;
              posX = 9;
              posY = imgPosY + 10;
            }
          }
          const indexText = `${String(imgIndex + 1).padStart(2, "0")}`;
          addTextWithStyle(newPdf, indexText, posX, posY + 5, "nanumExtra", "extraBold", "20", theme.colors.black);
          newPdf.addImage(imgurl, "JPEG", posX + 11, posY, pdfImgWidth, pdfImgHeight);

          posY += pdfImgHeight + 15;
        } catch (error) {}
      }
    }

    if (includePaper) {
      // 기존 PDF 파일 URL에서 불러오기
      const existingPdfBytes =
        paper === null
          ? await fetch(paperIds[index].pdf).then((res) => res.arrayBuffer())
          : await fetch(paper.pdf).then((res) => res.arrayBuffer());
      const existingPdf = await PDFDocument.load(existingPdfBytes);

      // 첫 번째 페이지 가져오기
      const pages = existingPdf.getPages();
      const firstPage = pages[0];

      // 페이지에 코드(id) 추가
      firstPage.drawText(`Code: ${paper === null ? paperIds[index].id : paper.id}`, {
        x: 465,
        y: 790,
        size: 15,
      });
      // 답지는 짝수 페이지부터 나오도록 빈 페이지 추가
      if (pages.length % 2 == 1) existingPdf.addPage();

      if (includeFastAnswer || includeSolution) {
        // 새로운 PDF 페이지를 기존 PDF에 추가
        const newPdfBytes = newPdf.output("arraybuffer");
        const newPdfDoc = await PDFDocument.load(newPdfBytes);

        // 모든 페이지를 복사
        const copiedPages = await existingPdf.copyPages(newPdfDoc, newPdfDoc.getPageIndices());

        // 복사된 모든 페이지를 추가
        copiedPages.forEach((page) => {
          existingPdf.addPage(page);
        });

        const mergedPages = existingPdf.getPages();
        if (mergedPages.length % 2 == 1) existingPdf.addPage();
      }

      // 병합된 PDF 다운로드
      const mergedPdfBytes = await existingPdf.save();
      const fileTitle = `${title}_문제지${includeFastAnswer ? `_빠른정답` : ``}${includeSolution ? `_해설` : ``}`;
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      return { blob, fileTitle };
    } else {
      const fileTitle = `${title}${includeFastAnswer ? `_빠른정답` : ``}${includeSolution ? `_해설` : ``}`;
      const blob = newPdf.output("blob");
      return { blob, fileTitle };
    }
  };

  return (
    <DOWNLOAD.ModalOverlay>
      <DOWNLOAD.Modal>
        <DOWNLOAD.TitleLine>
          <DOWNLOAD.Title>학습지 {paper === null && `${paperIds.length}개 일괄 `}다운로드</DOWNLOAD.Title>
        </DOWNLOAD.TitleLine>
        <DOWNLOAD.BtnLine>
          <DOWNLOAD.LineLabel>분류 선택</DOWNLOAD.LineLabel>
          <DOWNLOAD.CategoryBtn
            $isSelected={includePaper}
            onClick={() => {
              setIncludePaper((prev) => !prev);
            }}
          >
            문제지
          </DOWNLOAD.CategoryBtn>
          <DOWNLOAD.CategoryBtn
            $isSelected={includeFastAnswer}
            onClick={() => {
              setIncludeFastAnswer((prev) => !prev);
            }}
          >
            빠른 정답
          </DOWNLOAD.CategoryBtn>
          <DOWNLOAD.CategoryBtn
            $isSelected={includeSolution}
            onClick={() => {
              setIncludeSolution((prev) => !prev);
            }}
          >
            정답 해설
          </DOWNLOAD.CategoryBtn>
        </DOWNLOAD.BtnLine>
        <DOWNLOAD.BtnLine>
          <DOWNLOAD.LineLabel>다운 방식</DOWNLOAD.LineLabel>
          <DOWNLOAD.RadioLabel
            onClick={() => {
              setOnePdf(true);
            }}
          >
            <DOWNLOAD.RadioBtn $selected={onePdf}>{onePdf && <FontAwesomeIcon icon={faCircle} />}</DOWNLOAD.RadioBtn>
            하나의 PDF로 받기
          </DOWNLOAD.RadioLabel>
          {paper === null && (
            <DOWNLOAD.RadioLabel
              onClick={() => {
                setOnePdf(false);
              }}
            >
              <DOWNLOAD.RadioBtn $selected={!onePdf}>
                {!onePdf && <FontAwesomeIcon icon={faCircle} />}
              </DOWNLOAD.RadioBtn>
              개별 PDF로 받기
            </DOWNLOAD.RadioLabel>
          )}
        </DOWNLOAD.BtnLine>
        <DOWNLOAD.BottomLine>
          <DOWNLOAD.CloseBtn onClick={closeModal}>닫기</DOWNLOAD.CloseBtn>
          <DOWNLOAD.SubmitBtn
            onClick={onDownload}
            disabled={(includePaper || includeFastAnswer || includeSolution) === false}
          >
            다운로드
          </DOWNLOAD.SubmitBtn>
        </DOWNLOAD.BottomLine>
      </DOWNLOAD.Modal>
    </DOWNLOAD.ModalOverlay>
  );
};

export default DownloadModal;

const DOWNLOAD = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 50.5rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    height: 7rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
  `,
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ContentLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6rem;
  `,
  ContentBox: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,
  BtnLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 3rem;
  `,
  LineLabel: styled.div`
    font-size: 1.65rem;
    font-weight: 600;
    width: 10rem;
  `,
  CategoryBtn: styled.button`
    height: 4rem;
    border-radius: 4rem;
    margin-right: 2rem;

    padding-inline: 2rem;
    box-shadow: 0 0 0
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem${theme.colors.mainColor} inset` : `0.0rem${theme.colors.unselected} inset`};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray60)};
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  `,
  RadioBtn: styled.div`
    width: 2rem;
    height: 2rem;
    border: 0.1rem solid ${({ $selected, theme }) => ($selected ? theme.colors.mainColor : `black`)};
    color: ${({ $selected, theme }) => ($selected ? theme.colors.mainColor : `black`)};
    border-radius: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-right: 1rem;
  `,
  RadioLabel: styled.div`
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 400;
    margin-right: 3rem;
    cursor: pointer;
    &:last-child {
      margin-right: 0rem;
    }
  `,

  BottomLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    margin-top: auto;
    padding-inline: 3rem;
    padding-block: 1.5rem;
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  SubmitBtn: styled.button`
    margin-left: 1rem;
    width: 13rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    margin-left: auto;
    &:disabled {
      cursor: default;
      background-color: ${({ theme }) => theme.colors.gray30};
    }
  `,
};
