import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import nanum_font from "../../../../../../style/fonts/nanum/Nanum_Base64";
import theme from "../../../../../../style/theme";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";

import PreviewPaper from "./PreviewPaper";

import useGetLogo from "../../../../../../libs/hooks/Teacher/MyPage/useGetLogo";
import usePostCreateQuestion from "../../../../../../libs/apis/Teacher/Prepare/postCreateQuestion";

const ThirdStep = ({
  closeModal,
  selectedQuestions,
  selectedConcepts,
  title,
  setTitle,
  makerName,
  setMakerName,
  paperGrade,
  setCreateStep,
  school,
  grade,
  semester,
  category,
  questionTag,
  level,
  sortOption,
  addBlank,
  setAddBlank,
  isOnlyConcept,
}) => {
  const { logoUrl, teacherName } = useGetLogo();
  const { postCreateQuestion } = usePostCreateQuestion();
  const colorList = ["#00E000", "#FF0064", "#AB00FF", "#FFAE00", "#0086FF"];
  const [selectedColor, setSelectedColor] = useState(colorList[0]);
  const [tamplateNum, setTamplateNum] = useState(1);

  const [minChapterId, setMinChapterId] = useState(null);
  const [maxChapterId, setMaxChapterId] = useState(null);
  const mergedArray = selectedConcepts.map((concept) => {
    const relatedQuestions = selectedQuestions
      .filter((question) => question.chapterId === concept.chapterId)
      .map((question) => ({ imageUrl: question.imageURL, chapterDescription: question.chapterDescription }));

    return {
      chapterId: concept.chapterId,
      conceptImgUrl: concept.image,
      conceptBlankUrl: concept.blankImage,
      questions: relatedQuestions,
    };
  });
  const [conceptAtFront, setConceptAtFront] = useState(true);
  useEffect(() => {
    if (sortOption !== `default`) setConceptAtFront(true);
  }, [sortOption]);
  const [showChapterName, setShowChapterName] = useState(false);
  const [lineUpFourDiv, setLineUpFourDiv] = useState(true);

  useEffect(() => {
    if (selectedQuestions.length > 0) {
      const tempQues = [...selectedQuestions];
      tempQues.sort((a, b) => a.chapterId - b.chapterId);
      setMinChapterId({ id: tempQues[0].chapterId, description: tempQues[0].chapterDescription });
      setMaxChapterId({
        id: tempQues[tempQues.length - 1].chapterId,
        description: tempQues[tempQues.length - 1].chapterDescription,
      });
    }
    if (isOnlyConcept && selectedConcepts.length > 0) {
      setMinChapterId({ id: selectedConcepts[0].chapterId });
      setMaxChapterId({ id: selectedConcepts[selectedConcepts.length - 1].chapterId });
    }
  }, [selectedConcepts]);
  useEffect(() => {
    if (makerName === "" && teacherName !== "") {
      setMakerName(teacherName);
    }
  }, [teacherName]);
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
  const generatePDF = async () => {
    const pdf = new jsPDF();
    let today = new Date();
    let formattedDate = `${("0" + today.getHours()).slice(-2)}:${("0" + today.getMinutes()).slice(-2)}`;

    pdf.addFileToVFS("NanumGothic.ttf", nanum_font.normal);
    pdf.addFont("NanumGothic.ttf", "nanum", "normal");
    pdf.addFileToVFS("NanumGothicBold.ttf", nanum_font.bold);
    pdf.addFont("NanumGothicBold.ttf", "nanumBold", "bold");
    pdf.addFileToVFS("NanumGothicExtraBold.ttf", nanum_font.extraBold);
    pdf.addFont("NanumGothicExtraBold.ttf", "nanumExtra", "extraBold");

    let pageNum = 1;
    addPageNum(pdf, 1);

    let gradeText = `${paperGrade} `;
    let titleText =
      title !== ""
        ? `${title}`
        : !isOnlyConcept
        ? `${paperGrade + "  " + formattedDate}`
        : addBlank
        ? `${paperGrade + "  개념(빈칸)  " + formattedDate}`
        : `${paperGrade + "  개념  " + formattedDate}`;
    let textPosY = 20;
    addTextWithStyle(pdf, gradeText, 10, textPosY, "nanumExtra", "extraBold", 16, selectedColor);
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
    if (!isOnlyConcept) {
      let chapterScopeText = `${minChapterId.description} ~ ${maxChapterId.description}`;
      addTextWithStyle(pdf, chapterScopeText, 10, textPosY, "nanumBold", "bold", 10, theme.colors.gray60);
    }
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
        logoWidth,
        logoHeight
      );
    } catch (error) {
      console.error(error);
    }

    textPosY += 19;
    let dateAndMakerText = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
      today.getDate()
    ).padStart(2, "0")} | ${
      isOnlyConcept ? `개념 ${selectedConcepts.length}개` : `${selectedQuestions.length} 문제`
    } | ${makerName === "" ? "" : `${makerName}선생님 | `}이름 ____________________`;
    addTextWithStyle(pdf, dateAndMakerText, 10, textPosY, "nanum", "normal", 9, theme.colors.gray70);

    pdf.setDrawColor(190, 190, 190);
    pdf.setLineWidth(0.1);
    textPosY += 10;
    pdf.line(5, textPosY, 205, textPosY);
    pdf.line(105, textPosY, 105, 282);

    let posX = 9;
    let posY = textPosY + 10;

    // 개념 및 문제 이미지 삽입 부분
    if (isOnlyConcept) {
      /** 개념만 삽입하기*/
      for (const [index, concept] of selectedConcepts.entries()) {
        try {
          const url = addBlank ? concept.blankImage : concept.image;
          const img = await loadImage(url);
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;

          const imgurl = `${url}?r=` + Math.floor(Math.random() * 100000);
          const pdfImgWidth = 87;
          const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

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

          pdf.addImage(imgurl, "JPEG", posX, posY, pdfImgWidth, pdfImgHeight);
          if (lineUpFourDiv) posY = posY + pdfImgHeight + 10 < (posY + 282) / 2 ? (posY + 282) / 2 : 290;
          else posY += pdfImgHeight + 10;
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      if (conceptAtFront) {
        /** 개념 전방 배치*/
        for (const [index, concept] of selectedConcepts.entries()) {
          try {
            const url = addBlank ? concept.blankImage : concept.image;
            const img = await loadImage(url);
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            const imgurl = `${url}?r=` + Math.floor(Math.random() * 100000);
            const pdfImgWidth = 87;
            const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

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

            pdf.addImage(imgurl, "JPEG", posX, posY, pdfImgWidth, pdfImgHeight);

            if (lineUpFourDiv) posY = posY + pdfImgHeight + 10 < (posY + 282) / 2 ? (posY + 282) / 2 : 290;
            else posY += pdfImgHeight + 10;
          } catch (error) {
            console.error(error);
          }
        }
        /** 그 다음 문제 배치 */
        for (const [index, ques] of selectedQuestions.entries()) {
          try {
            const img = await loadImage(ques.imageURL); // imageURL을 imageUrl로 변경
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            const imgurl = `${ques.imageURL}?r=` + Math.floor(Math.random() * 100000);
            const pdfImgWidth = 75;
            const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

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

            if (showChapterName) {
              const quesChapterText = `| ${ques.chapterDescription} |`;
              addTextWithStyle(pdf, quesChapterText, posX, posY, "nanum", "normal", 8, theme.colors.gray60);
              posY += 5;
            }
            const indexText = `${String(index + 1).padStart(2, "0")}`;
            addTextWithStyle(pdf, indexText, posX, posY + 5, "nanumExtra", "extraBold", "20", selectedColor);
            pdf.addImage(imgurl, "JPEG", posX + 11, posY, pdfImgWidth, pdfImgHeight);

            if (lineUpFourDiv) posY = posY + pdfImgHeight + 10 < (posY + 282) / 2 ? (posY + 282) / 2 : 290;
            else posY += pdfImgHeight + 10;
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        /** 개념 해당 문제 앞에 배치 */
        let questionOrder = 1;
        for (const chapter of mergedArray) {
          try {
            const url = addBlank ? chapter.conceptBlankUrl : chapter.conceptImgUrl;
            const img = await loadImage(url);
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            const imgurl = `${url}?r=` + Math.floor(Math.random() * 100000);
            const pdfImgWidth = 87;
            const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

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

            pdf.addImage(imgurl, "JPEG", posX, posY, pdfImgWidth, pdfImgHeight);

            if (lineUpFourDiv) posY = posY + pdfImgHeight + 10 < (posY + 282) / 2 ? (posY + 282) / 2 : 290;
            else posY += pdfImgHeight + 10;
          } catch (error) {
            console.error(error);
          }
          for (const [index, ques] of chapter.questions.entries()) {
            try {
              const img = await loadImage(ques.imageUrl); // imageURL을 imageUrl로 변경
              const imgWidth = img.naturalWidth;
              const imgHeight = img.naturalHeight;

              const imgurl = `${ques.imageUrl}?r=` + Math.floor(Math.random() * 100000);
              const pdfImgWidth = 75;
              const pdfImgHeight = (pdfImgWidth * imgHeight) / imgWidth;

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

              const quesChapterText = `| ${ques.chapterDescription} |`;
              addTextWithStyle(pdf, quesChapterText, posX, posY, "nanum", "normal", 8, theme.colors.gray60);
              posY += 5;
              const indexText = `${String(questionOrder).padStart(2, "0")}`;
              addTextWithStyle(pdf, indexText, posX, posY + 5, "nanumExtra", "extraBold", "20", selectedColor);
              pdf.addImage(imgurl, "JPEG", posX + 11, posY, pdfImgWidth, pdfImgHeight);
              questionOrder += 1;
              if (lineUpFourDiv) posY = posY + pdfImgHeight + 10 < (posY + 282) / 2 ? (posY + 282) / 2 : 290;
              else posY += pdfImgHeight + 10;
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }

    //window.open(pdf.output("bloburl"));
    const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
    const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };

    const pdfBlob = pdf.output("blob");
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${numToEng[semester - 1]}1`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }
    await postCreateQuestion(
      school,
      sem,
      sub,
      level,
      titleText,
      makerName,
      category,
      questionTag,
      selectedQuestions,
      pdfBlob,
      minChapterId,
      maxChapterId,
      tamplateNum,
      selectedColor
    );
    closeModal();
  };

  const onCreateClicked = async () => {
    await generatePDF();
  };
  const scrollContainerRef = useRef(null);
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const onWheel = (event) => {
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    };

    scrollContainer.addEventListener("wheel", onWheel);

    return () => {
      scrollContainer.removeEventListener("wheel", onWheel);
    };
  }, []);

  const RenderSettings = () => {
    return (
      <SET.SettingSection>
        <SET.PropLine>
          <SET.PropContainer>
            <SET.PropLabel>학습지 명</SET.PropLabel>
            <SET.InputBox
              value={title}
              onChange={(e) => {
                if (e.target.value.length < 30) setTitle(e.target.value);
              }}
              maxLength={35}
              placeholder="학습지 제목을 입력하세요"
            />
          </SET.PropContainer>
          <SET.PropContainer>
            <SET.PropLabel>출제자</SET.PropLabel>
            <SET.InputBox
              value={makerName}
              onChange={(e) => {
                setMakerName(e.target.value);
              }}
              placeholder="출제 선생님 이름을 입력하세요"
            />
          </SET.PropContainer>
        </SET.PropLine>
        <SET.PropLine>
          <SET.PropContainer>
            <SET.PropLabel>학년</SET.PropLabel>
            <SELECT.DropDown>
              <SELECT.DropdownLabel>{paperGrade}</SELECT.DropdownLabel>
            </SELECT.DropDown>
          </SET.PropContainer>
          {isOnlyConcept ? (
            <SET.PropContainer>
              <SET.PropLabel>빈칸 뚫기</SET.PropLabel>
              <SET.BtnLine>
                <SET.RadioLabel
                  onClick={() => {
                    setAddBlank(true);
                  }}
                >
                  <SET.RadioBtn $selected={addBlank}>{addBlank && <FontAwesomeIcon icon={faCircle} />}</SET.RadioBtn>
                  빈칸 O
                </SET.RadioLabel>
                <SET.RadioLabel
                  onClick={() => {
                    setAddBlank(false);
                  }}
                >
                  <SET.RadioBtn $selected={!addBlank}>{!addBlank && <FontAwesomeIcon icon={faCircle} />}</SET.RadioBtn>
                  빈칸 X
                </SET.RadioLabel>
              </SET.BtnLine>
            </SET.PropContainer>
          ) : (
            <SET.PropContainer>
              <SET.PropLabel>개념 배치</SET.PropLabel>
              <SET.BtnLine>
                <SET.RadioLabel
                  onClick={() => {
                    setConceptAtFront(true);
                  }}
                >
                  <SET.RadioBtn $selected={conceptAtFront}>
                    {conceptAtFront && <FontAwesomeIcon icon={faCircle} />}
                  </SET.RadioBtn>
                  학습지 맨 앞
                </SET.RadioLabel>
                <SET.RadioLabel
                  onClick={() => {
                    setConceptAtFront(false);
                  }}
                >
                  <SET.RadioBtn $selected={!conceptAtFront}>
                    {!conceptAtFront && <FontAwesomeIcon icon={faCircle} />}
                  </SET.RadioBtn>
                  연관 문제 앞
                </SET.RadioLabel>
              </SET.BtnLine>
            </SET.PropContainer>
          )}
        </SET.PropLine>
        <SET.PropLine>
          {isOnlyConcept || (
            <SET.PropContainer>
              <SET.PropLabel>단원 이름 출력</SET.PropLabel>
              <SET.BtnLine>
                <SET.RadioLabel
                  onClick={() => {
                    setShowChapterName(true);
                  }}
                >
                  <SET.RadioBtn $selected={showChapterName}>
                    {showChapterName && <FontAwesomeIcon icon={faCircle} />}
                  </SET.RadioBtn>
                  출력함
                </SET.RadioLabel>
                {sortOption === `default` && (
                  <SET.RadioLabel
                    onClick={() => {
                      setShowChapterName(false);
                    }}
                  >
                    <SET.RadioBtn $selected={!showChapterName}>
                      {!showChapterName && <FontAwesomeIcon icon={faCircle} />}
                    </SET.RadioBtn>
                    출력하지 않음
                  </SET.RadioLabel>
                )}
              </SET.BtnLine>
            </SET.PropContainer>
          )}
          <SET.PropContainer>
            <SET.PropLabel>문제 배치</SET.PropLabel>
            <SET.BtnLine>
              <SET.RadioLabel
                onClick={() => {
                  setLineUpFourDiv(true);
                }}
              >
                <SET.RadioBtn $selected={lineUpFourDiv}>
                  {lineUpFourDiv && <FontAwesomeIcon icon={faCircle} />}
                </SET.RadioBtn>
                4분할
              </SET.RadioLabel>
              <SET.RadioLabel
                onClick={() => {
                  setLineUpFourDiv(false);
                }}
              >
                <SET.RadioBtn $selected={!lineUpFourDiv}>
                  {!lineUpFourDiv && <FontAwesomeIcon icon={faCircle} />}
                </SET.RadioBtn>
                자동
              </SET.RadioLabel>
            </SET.BtnLine>
          </SET.PropContainer>
        </SET.PropLine>
        <SET.TemplateContainer>
          <SET.TampLabel>학습지 색상 및 디자인</SET.TampLabel>
          <SET.TampDescription>색상 선택</SET.TampDescription>
          <SET.ColorBtnContainer>
            {colorList.map((color, index) => (
              <SET.ColorSelectBtn
                key={index}
                $color={color}
                onClick={() => {
                  setSelectedColor(color);
                }}
              >
                {selectedColor === color ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </SET.ColorSelectBtn>
            ))}
            <SET.ColorSelectBtn />
          </SET.ColorBtnContainer>
          <SET.TampDescription>탬플릿 선택</SET.TampDescription>
          <SET.TamplateShowWindow ref={scrollContainerRef}>
            <SET.TamplatesContainer>
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <SET.TemporaryImage
                  key={index}
                  $selected={tamplateNum === index}
                  onClick={() => setTamplateNum(index)}
                />
              ))}
            </SET.TamplatesContainer>
          </SET.TamplateShowWindow>
        </SET.TemplateContainer>
      </SET.SettingSection>
    );
  };
  const RenderPreview = () => {
    return (
      <PV.PaperSection>
        <PV.TitleLine>
          <PV.Title>학습지 미리보기</PV.Title>
          <PV.SubTitle>미리보기 화면은 실제 학습지와 약간 차이가 있습니다.</PV.SubTitle>
        </PV.TitleLine>
        <PreviewPaper
          selectedQuestions={selectedQuestions}
          selectedConcepts={selectedConcepts}
          tamplateNum={tamplateNum}
          colorTheme={selectedColor}
          title={title}
          makerName={makerName}
          paperGrade={paperGrade}
          showChapterName={showChapterName}
          lineUpFourDiv={lineUpFourDiv}
          isOnlyConcept={isOnlyConcept}
          addBlank={addBlank}
        />
        <PV.SummaryBox>
          {isOnlyConcept ? (
            <PV.QuesNumSummary>
              학습지 개념 수 <PV.EmpathizeLetter>{selectedConcepts.length}</PV.EmpathizeLetter>개
            </PV.QuesNumSummary>
          ) : (
            <PV.QuesNumSummary>
              학습지 문제 수 <PV.EmpathizeLetter>{selectedQuestions.length}</PV.EmpathizeLetter>개
            </PV.QuesNumSummary>
          )}
        </PV.SummaryBox>
        <PV.ButtonBox>
          <PV.PrevStepBtn
            onClick={() => {
              if (isOnlyConcept) {
                setCreateStep(1);
                setTitle("");
              } else setCreateStep(2);
            }}
          >
            이전
          </PV.PrevStepBtn>
          <PV.MakeBtn disabled={teacherName === ""} onClick={onCreateClicked}>
            학습지 생성
          </PV.MakeBtn>
        </PV.ButtonBox>
      </PV.PaperSection>
    );
  };
  return (
    <Step3.Wrapper>
      {RenderSettings()}
      {RenderPreview()}
    </Step3.Wrapper>
  );
};

export default ThirdStep;

const Step3 = {
  Wrapper: styled.div`
    padding-top: 1rem;
    padding-inline: 1.5rem;
    display: flex;
    flex-direction: row;
  `,
};
const SET = {
  SettingSection: styled.div`
    background-color: white;
    width: 70rem;
    height: 74rem;
    margin-right: 2rem;
    border-radius: 1rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    overflow: hidden;
    padding: 1.5rem;
    padding-top: 2.5rem;
    padding-right: 0rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 0rem; /* 세로 스크롤바의 너비 */
    }
  `,
  PropLine: styled.div`
    height: 8rem;
    width: 66rem;
    margin-bottom: 3rem;
    margin-left: 1rem;
    display: flex;
    flex-direction: row;
  `,
  PropContainer: styled.div`
    width: 30rem;
    margin-right: 3rem;
  `,
  PropLabel: styled.div`
    height: 2rem;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  `,
  InputBox: styled.input`
    width: 30rem;
    height: 5rem;
    border-radius: 0.8rem;
    border: 0.05rem solid ${({ theme }) => theme.colors.gray30};
    padding: 1rem;
    font-size: 1.75rem;
  `,
  BtnLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  RadioBtn: styled.div`
    width: 2rem;
    height: 2rem;
    border: 0.2rem solid ${({ $selected, theme }) => ($selected ? theme.colors.mainColor : `black`)};
    color: ${({ $selected, theme }) => ($selected ? theme.colors.mainColor : `black`)};
    border-radius: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-right: 0.5rem;
  `,
  RadioLabel: styled.div`
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 3rem;
    cursor: pointer;
  `,
  TemplateContainer: styled.div`
    height: auto;
    width: 67rem;
    border-radius: 2rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    padding-inline: 2.5rem;
    padding-top: 3.5rem;
    padding-bottom: 1.5rem;
  `,
  TampLabel: styled.div`
    height: 4rem;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  `,
  TampDescription: styled.div`
    height: 3rem;
    color: ${({ theme }) => theme.colors.gray45};
    font-size: 1.25rem;
    font-weight: 600;
  `,
  TamplateShowWindow: styled.div`
    height: 31rem;
    overflow: hidden;
    &:hover {
      overflow-x: scroll;
    }
    &::-webkit-scrollbar {
      height: 0.5rem; /* 세로 스크롤바의 너비 */
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.gray40}; /* 핸들의 배경 색상 */
      border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  TamplatesContainer: styled.div`
    width: max-content;
    display: flex;
    flex-direction: row;
  `,
  TemporaryImage: styled.div`
    width: 21rem;
    height: 29.7rem;
    background-color: white;
    margin-right: 1.5rem;
    border: solid
      ${({ $selected, theme }) => ($selected ? `0.2rem ${theme.colors.mainColor}` : `0.1rem ${theme.colors.gray15}`)};
    cursor: pointer;
    &:last-child {
      margin-right: 0rem;
    }
  `,
  TamplateImage: styled.img`
    width: 21rem;
    height: 29.7rem;
    margin-right: 1.5rem;
    border: solid
      ${({ $selected, theme }) => ($selected ? `0.2rem ${theme.colors.mainColor}` : `0.1rem ${theme.colors.gray15}`)};
    cursor: pointer;
    &:last-child {
      margin-right: 0rem;
    }
  `,
  ColorBtnContainer: styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
  `,
  ColorSelectBtn: styled.div`
    background-color: ${({ $color }) => $color};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    width: 4rem;
    height: 4rem;
    margin-right: 1.5rem;
    border-radius: 100rem;
    cursor: pointer;
  `,
};
const SELECT = {
  DropDown: styled.div`
    width: 10rem;
    height: 5rem;
    display: in;
    flex-direction: column;
    align-items: center;
  `,
  DropdownLabel: styled.div`
    background-color: white;
    border-radius: 0.8rem;
    border: 0.05rem solid ${({ theme }) => theme.colors.gray30};
    height: 5rem;
    width: 10rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: black;
    font-size: 1.75rem;
  `,
  DropdownContainor: styled.div`
    position: relative;
    height: 25rem;
    margin-top: 0.5rem;
    border-radius: 0.8rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    width: 10rem;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0rem; /* 세로 스크롤바의 너비 */
    }

    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      //background: #f1f1f1; /* 트랙의 배경 색상 */
      //border-radius: 1rem; /* 트랙의 모서리 둥글게 */
    }

    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
      //border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }

    /* 스크롤바 핸들에 마우스 호버시 스타일 */
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  DropdownOption: styled.button`
    width: 9rem;
    height: 2.8rem;
    font-size: 1.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray50};
    cursor: pointer;
    background-color: white;
    border-radius: 0.8rem;
    border: 0.05rem solid ${({ theme }) => theme.colors.gray30};
    margin-top: 0.5rem;

    &:hover {
      color: black;
      width: 10rem;
      height: 3rem;
    }
  `,
};

const PV = {
  PaperSection: styled.div`
    background-color: white;
    width: 60rem;
    height: 74rem;
    border-radius: 1rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    overflow: hidden;
    padding: 1.5rem;
    padding-top: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  TitleLine: styled.div`
    width: 57rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1.5rem;
  `,
  Title: styled.div`
    font-size: 1.75rem;
    font-weight: 600;
  `,
  SubTitle: styled.div`
    margin-left: 1rem;
    font-weight: 600;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray60};
  `,
  SummaryBox: styled.div`
    display: flex;
    width: 60rem;
    margin-top: auto;
    background-color: ${({ theme }) => theme.colors.gray05};
    align-items: center;
    justify-content: center;
  `,
  QuesNumSummary: styled.div`
    height: 8rem;
    display: flex;
    align-items: center;
    font-size: 2.2rem;
    font-weight: 600;
  `,
  EmpathizeLetter: styled.p`
    margin-left: 0.6rem;
    font-size: 2.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.mainColor};
  `,
  ButtonBox: styled.div`
    display: flex;
    flex-direction: row;
    width: 60rem;
    padding-top: 1.5rem;
    padding-inline: 2.5rem;
  `,
  PrevStepBtn: styled.button`
    width: 12rem;
    height: 5rem;
    border-radius: 1rem;
    font-size: 1.75rem;
    font-weight: bold;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    &:hover {
      background-color: ${({ theme }) => theme.colors.softWarning};
      color: ${({ theme }) => theme.colors.warning};
      border: 0.1rem solid ${({ theme }) => theme.colors.warning};
    }
  `,
  MakeBtn: styled.button`
    width: 15rem;
    height: 5rem;
    margin-left: auto;
    border-radius: 1rem;
    font-size: 1.75rem;
    font-weight: bold;
    color: white;
    background-color: ${({ theme }) => theme.colors.mainColor};
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray30};
      cursor: default;
    }
  `,
};
