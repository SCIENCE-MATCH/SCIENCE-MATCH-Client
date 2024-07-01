import styled from "styled-components";
import jsPDF from "jspdf";
import nanum_font from "../../../../../style/fonts/nanum/Nanum_Base64";
import theme from "../../../../../style/theme";
import Axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../../../libs/cookie";
const MakePaper = ({ selectedQuestions, title, makerName, colorTheme, paperGrade }) => {
  /*{
  "title": "새로 만든 문제지",
  "makerName": "오펜하이머",
  "questionIds": [
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24
  ],
  "questionNum": 8,
  "school": "HIGH",
  "semester": "FIRST",
  "category": "MULTIPLE",
  "questionTag": "NORMAL",
  "subject": "BIOLOGY"
} 
*/
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState("");
  const tempQues = [...selectedQuestions];
  tempQues.sort((a, b) => a.chapterId - b.chapterId);
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  };

  /**pdf, 텍스트, x, y, 크기, 색상, 폰트, 굵기 */
  const addTextWithStyle = (pdf, text, x, y, font, weight, size, color) => {
    pdf.setFont(font, weight);
    pdf.setFontSize(size); // 글자 크기 설정
    pdf.setTextColor(color); // 글자 색상 설정
    pdf.text(text, x, y); // 텍스트 추가
  };
  const addPageNum = (pdf, pageNum) => {
    const pageNumText = `${pageNum}`;
    pdf.setFont("nanum", "normal");
    pdf.setFontSize(15); // 글자 크기 설정
    pdf.setTextColor(theme.colors.gray80); // 글자 색상 설정
    pdf.text(pageNumText, 105, 289, "center"); // 텍스트 추가
  };
  const getLogo = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/mypage";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLogoUrl(response.data.data.logo);
    } catch (error) {
      // API 요청이 실패한 경우
      alert("로고를 불러오지 못했습니다.");
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
      navigate("/");
    }
  };
  const generatePDF = async () => {
    const pdf = new jsPDF();
    await getLogo();

    pdf.addFileToVFS("NanumGothic.ttf", nanum_font.normal); //_fonts 변수는 Base64 형태로 변환된 내용입니다.
    pdf.addFont("NanumGothic.ttf", "nanum", "normal");
    pdf.addFileToVFS("NanumGothicBold.ttf", nanum_font.bold);
    pdf.addFont("NanumGothicBold.ttf", "nanumBold", "bold");
    pdf.addFileToVFS("NanumGothicExtraBold.ttf", nanum_font.extraBold);
    pdf.addFont("NanumGothicExtraBold.ttf", "nanumExtra", "extraBold");

    //첫 페이지.
    let pageNum = 1;

    addPageNum(pdf, 1);
    let gradeText = `${paperGrade} `;
    let titleText = `${title}`;
    let textPosY = 20;
    addTextWithStyle(pdf, gradeText, 10, textPosY, "nanumExtra", "extraBold", 16, colorTheme);
    addTextWithStyle(
      pdf,
      titleText,
      10 + pdf.getTextWidth(gradeText),
      textPosY,
      "nanumExtra",
      "extraBold",
      16,
      "black"
    );

    textPosY += 6;
    let chapterScopeText = `${tempQues[0].description} ~ ${tempQues.pop().description}`;
    addTextWithStyle(pdf, chapterScopeText, 10, textPosY, "nanumBold", "bold", 10, theme.colors.gray60);
    let logoWidth = 0;
    let logoHeight = 0;
    try {
      const img = await loadImage(logoUrl);
      let tempWidth = img.naturalWidth;
      let tempHeight = img.naturalHeight;
      if (tempWidth * 3 > tempHeight * 8) {
        logoHeight = (tempHeight * 40) / tempWidth;
        logoWidth = 40;
      } else {
        logoWidth = (tempWidth * 15) / tempHeight;
        logoHeight = 15;
      }
      pdf.addImage(
        `${logoUrl}?r=` + Math.floor(Math.random() * 100000),
        "JPEG",
        175 - logoWidth / 2,
        textPosY + 4 - logoHeight / 2,
        logoWidth, //최대 80
        logoHeight //최대 30
      );
    } catch (error) {}
    //로고 이미지

    textPosY += 19;
    let today = new Date();
    let dateAndMakerText = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
      today.getDate()
    ).padStart(2, "0")} | ${selectedQuestions.length} 문제 | ${makerName}선생님 | 이름 ____________________`;
    addTextWithStyle(pdf, dateAndMakerText, 10, textPosY, "nanum", "normal", 9, theme.colors.gray70);

    pdf.setDrawColor(190, 190, 190);
    pdf.setLineWidth(0.1);
    //pdf.rect(10, 10, 190, 277);
    textPosY += 10;
    pdf.line(5, textPosY, 205, textPosY);
    pdf.line(105, textPosY, 105, 282);

    let posX = 9;
    let posY = textPosY + 10;

    //문제 삽입
    for (const [index, ques] of selectedQuestions.entries()) {
      try {
        const img = await loadImage(ques.imageURL);
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        const imgurl = `${ques.imageURL}?r=` + Math.floor(Math.random() * 100000);
        const pdfImgWidth = 75;
        const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

        /**문제가 들어갈 공간에 따라 배치 */
        if (posY + pdfImgHeight > 282) {
          if (posX < 20) {
            posX += 105;
            posY = textPosY + 10;
          } else {
            pdf.addPage();
            pageNum += 1;
            addPageNum(pdf, pageNum);
            addTextWithStyle(pdf, dateAndMakerText, 10, 15, "nanum", "normal", 9, theme.colors.gray70);
            pdf.line(5, 20, 205, 20);
            pdf.line(105, 20, 105, 282);
            textPosY = 20;
            posX = 9;
            posY = textPosY + 10;
          }
        }

        /**문제 번호 및 이미지 추가 */
        const quesChapterText = `| ${ques.chapterDescription} |`;
        addTextWithStyle(pdf, quesChapterText, posX, posY, "nanum", "normal", 8, theme.colors.gray60);
        posY += 5;
        const indexText = `${String(index + 1).padStart(2, "0")}`;
        addTextWithStyle(pdf, indexText, posX, posY + 5, "nanumExtra", "extraBold", "20", colorTheme);
        pdf.addImage(imgurl, "JPEG", posX + 11, posY, pdfImgWidth, pdfImgHeight);
        posY += pdfImgHeight + 15;
      } catch (error) {
        console.error(error);
      }
    }
    window.open(pdf.output("bloburl"));
    pdf.save(`${title}.pdf`);
  };
  return (
    <MAKEPAPER.MakeBtn
      onClick={() => {
        generatePDF();
      }}
    >{`학습지 만들기`}</MAKEPAPER.MakeBtn>
  );
};
export default MakePaper;

const MAKEPAPER = {
  MakeBtn: styled.button`
    width: 15rem;
    height: 5rem;
    margin-left: auto;
    border-radius: 1rem;
    font-size: 1.75rem;
    font-weight: bold;
    color: white;
    background-color: ${({ theme }) => theme.colors.mainColor};
  `,
};
