import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components";
import { faFileImage } from "@fortawesome/free-regular-svg-icons";
import { faO, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import usePostGradeQuestion from "../../../../libs/apis/Teacher/Class/postGradeQuestion";
import jsPDF from "jspdf";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import nanum_font from "../../../../style/fonts/nanum/Nanum_Base64";
import theme from "../../../../style/theme";
import useGetLogo from "../../../../libs/hooks/Teacher/MyPage/useGetLogo";
import usePostGetWrong from "../../../../libs/apis/Teacher/Class/postGetWrongs";

const ScorePaper = ({ closeModal, paper, studentInfo }) => {
  const { postGradeQuestion } = usePostGradeQuestion();
  const { logoUrl } = useGetLogo();
  const { wrongQuestions, postGetWrong } = usePostGetWrong();
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const [answers, setAnswers] = useState(paper.answerResponseDtos);

  const makeRight = async (target) => {
    await postGradeQuestion(target.id, true);
    const tempPaper = answers.map((answer) => (answer.id === target.id ? { ...answer, rightAnswer: true } : answer));

    setAnswers(tempPaper); // 새 배열을 반환
  };
  const makeWrong = async (target) => {
    await postGradeQuestion(target.id, false);
    const tempPaper = answers.map((answer) => (answer.id === target.id ? { ...answer, rightAnswer: false } : answer));

    setAnswers(tempPaper); // 새 배열을 반환
  };

  const initialize = () => {
    if (paper.assignStatus === "GRADED") setAnswers(paper.answerResponseDtos);
    else {
      const tempArr = paper.answerResponseDtos.map((ques) => ({
        ...ques,
        rightAnswer: ques.category === "MULTIPLE" ? ques.rightAnswer : null,
      }));
      setAnswers(tempArr);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const wholeCorrect = () => {
    answers.map((answer) => postGradeQuestion(answer.id, true));
    setAnswers(answers.map((answer) => ({ ...answer, rightAnswer: true })));
  };
  const wholeWrong = () => {
    answers.map((answer) => postGradeQuestion(answer.id, false));
    setAnswers(answers.map((answer) => ({ ...answer, rightAnswer: false })));
  };
  const [levelPercent, setLevelPercent] = useState([]);
  const [chapterPercent, setChapterPercent] = useState([]);
  const longerGrade = (text) => {
    let result = "";
    switch (text.slice(0, 1)) {
      case "초":
        result = "초등학교";
        break;
      case "중":
        result = "중학교";
      case "고":
        result = "고등학교";
    }
    return result + " " + text.slice(1, 2) + "학년";
  };

  const levelsToKorean = { LOW: ` 하 `, MEDIUM_LOW: `중하`, MEDIUM: ` 중 `, MEDIUM_HIGH: `중상`, HIGH: ` 상 ` };
  useEffect(() => {
    // 난이도별 초기화
    const levels = ["LOW", "MEDIUM_LOW", "MEDIUM", "MEDIUM_HIGH", "HIGH"];
    const levelMap = {
      LOW: { total: 0, right: 0 },
      MEDIUM_LOW: { total: 0, right: 0 },
      MEDIUM: { total: 0, right: 0 },
      MEDIUM_HIGH: { total: 0, right: 0 },
      HIGH: { total: 0, right: 0 },
    };

    // 챕터별 데이터를 저장할 객체 초기화
    const chapterMap = {};

    // 데이터를 챕터별 및 난이도별로 분류 및 비율 계산
    paper.answerResponseDtos.forEach((item) => {
      // 챕터별 데이터 분류
      if (!chapterMap[item.chapterId]) {
        chapterMap[item.chapterId] = {
          chapterDescription: item.chapterDescription,
          total: 0,
          right: 0,
        };
      }
      chapterMap[item.chapterId].total += 1;
      if (item.rightAnswer) {
        chapterMap[item.chapterId].right += 1;
      }

      // 난이도별 데이터 분류
      if (levels.includes(item.level)) {
        levelMap[item.level].total += 1;
        if (item.rightAnswer) {
          levelMap[item.level].right += 1;
        }
      }
    });

    // 챕터별 백분율 계산 및 배열 생성
    const chapterPercent = Object.keys(chapterMap).map((chapterId) => {
      const chapter = chapterMap[chapterId];
      const percent = Math.floor((chapter.right / chapter.total) * 100); // 백분율을 정수로
      return {
        chapterDescription: chapter.chapterDescription,
        percent: percent,
      };
    });

    // chapterId를 기준으로 정렬
    chapterPercent.sort((a, b) => parseInt(a.chapterId) - parseInt(b.chapterId));

    // 난이도별 백분율 계산 및 배열 생성
    const levelPercent = levels.map((level) => {
      const levelData = levelMap[level];
      const percent = levelData.total === 0 ? 0 : Math.floor((levelData.right / levelData.total) * 100); // 백분율을 정수로
      return percent;
    });

    // setLevelPercent 및 setChapterPercent 호출
    setLevelPercent(levelPercent);
    setChapterPercent(chapterPercent);
  }, [paper]);

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

  const chartRef = useRef(null);
  const generateChart = () => {
    return new Promise((resolve) => {
      const canvas = chartRef.current;
      const ctx = canvas.getContext("2d");

      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      // 새로운 차트 생성
      chartRef.current.chartInstance = new Chart(ctx, {
        type: "bar", // 기본 차트 타입
        plugins: [ChartDataLabels], // 데이터 레이블 플러그인 활성화
        data: {
          labels: ["하", "중하", "중", "중상", "상"],
          datasets: [
            {
              type: "line", // 꺾은선 차트 데이터셋
              label: "Line Dataset",
              data: levelPercent.map((value) => (value === 0 ? null : value)),
              borderColor: "rgb(75, 192, 192)",
              fill: false,
              tension: 0,
              datalabels: {
                align: "end",
                anchor: "end",
                formatter: (value) => `${value}%`,
              },
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              color: "black",
              font: {
                weight: "bold",
                size: 20, // 데이터 레이블 폰트 크기
              },
            },
            legend: {
              display: false, // 범례 숨기기
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // x축 그리드 라인 제거
              },
              ticks: {
                font: {
                  size: 25, // x축 폰트 크기
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false, // y축 그리드 라인 제거
              },
              ticks: {
                stepSize: 10, // y축 간격을 10 단위로 설정
                font: {
                  size: 25, // y축 폰트 크기
                },
              },
            },
          },
          animation: {
            onComplete: () => {
              setTimeout(() => {
                const dataUrl = canvas.toDataURL("image/png", 1.0);
                resolve(dataUrl);
              }, 100); // 애니메이션이 완료된 후 100ms 대기
            },
          },
        },
      });
    });
  };
  const generatePDF = async () => {
    const pdf = new jsPDF();

    const chartDataUrl = await generateChart();

    pdf.addFileToVFS("NanumGothic.ttf", nanum_font.normal);
    pdf.addFont("NanumGothic.ttf", "nanum", "normal");
    pdf.addFileToVFS("NanumGothicBold.ttf", nanum_font.bold);
    pdf.addFont("NanumGothicBold.ttf", "nanumBold", "bold");
    pdf.addFileToVFS("NanumGothicExtraBold.ttf", nanum_font.extraBold);
    pdf.addFont("NanumGothicExtraBold.ttf", "nanumExtra", "extraBold");

    let textPosY = 20;
    const date = new Date();
    const year = String(date.getFullYear()); // 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 일

    addTextWithStyle(pdf, `${year}.${month}.${day}`, 10, textPosY, "nanumExtra", "extraBold", 16, theme.colors.gray80);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    textPosY += 5;
    pdf.line(10, textPosY, 200, textPosY);

    textPosY += 80;
    addTextWithStyle(pdf, `ONE`, 12, textPosY, "nanumExtra", "extraBold", 110, theme.colors.mainColor);
    textPosY += 40;
    addTextWithStyle(pdf, `REPORT`, 12, textPosY, "nanumExtra", "extraBold", 110, theme.colors.mainColor);
    textPosY += 25;
    addTextWithStyle(pdf, `${studentInfo.name}`, 14, textPosY, "nanum", "normal", 25, theme.colors.gray90);
    textPosY += 9;
    addTextWithStyle(
      pdf,
      `${longerGrade(studentInfo.grade)}`,
      14,
      textPosY,
      "nanum",
      "normal",
      12,
      theme.colors.gray90
    );
    textPosY += 7;
    addTextWithStyle(pdf, `${paper.title}`, 14, textPosY, "nanum", "normal", 11, theme.colors.gray90);

    let logoWidth = 0;
    let logoHeight = 0;
    try {
      const img = await loadImage(logoUrl);
      let tempWidth = img.naturalWidth;
      let tempHeight = img.naturalHeight;
      if (tempWidth * 3 > tempHeight * 8) {
        logoHeight = (tempHeight * 80) / tempWidth;
        logoWidth = 80;
      } else {
        logoWidth = (tempWidth * 30) / tempHeight;
        logoHeight = 30;
      }
      pdf.addImage(
        `${logoUrl}?r=` + Math.floor(Math.random() * 100000),
        "JPEG",
        105 - logoWidth / 2,
        textPosY + 50 - logoHeight / 2,
        logoWidth,
        logoHeight
      );
    } catch (error) {
      console.error(error);
    }

    pdf.addPage();
    textPosY = 15;
    addTextWithStyle(pdf, `one report`, 15, textPosY, "nanumExtra", "extraBold", 16, theme.colors.gray80);
    textPosY -= 2;
    pdf.line(45, textPosY, 200, textPosY);
    textPosY += 17;
    addTextWithStyle(pdf, `RESULT`, 15, textPosY, "nanum", "normal", 25, theme.colors.mainColor);
    addTextWithStyle(pdf, `진단결과`, 48, textPosY, "nanum", "normal", 17, theme.colors.mainColor);

    textPosY += 30;
    addTextWithStyle(pdf, `점수`, 80, textPosY, "nanum", "normal", 15, theme.colors.mainColor);
    textPosY += 4;
    addTextWithStyle(
      pdf,
      paper.totalScore === 0 ? `0` : `${Math.floor((paper.score / paper.totalScore) * 100)}`,
      110,
      textPosY,
      "nanumExtra",
      "extraBold",
      50,
      theme.colors.mainColor
    );
    textPosY += 30;
    addTextWithStyle(pdf, `난이도별 정답률`, 15, textPosY, "nanumBold", "bold", 17, `black`);
    textPosY += 10;
    pdf.addImage(chartDataUrl, "PNG", 15, textPosY, 185, 69);

    textPosY += 90;
    addTextWithStyle(pdf, `단원별 정답률`, 15, textPosY, "nanumBold", "bold", 17, `black`);

    pdf.setDrawColor(theme.colors.mainColor);
    pdf.setLineWidth(0.5);
    textPosY += 15;
    chapterPercent.map((chapter) => {
      if (textPosY > 282) {
        pdf.addPage();
        textPosY = 15;
        addTextWithStyle(pdf, `one report`, 15, textPosY, "nanumExtra", "extraBold", 16, theme.colors.gray80);
        textPosY -= 2;
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(45, textPosY, 200, textPosY);
        textPosY += 17;
        addTextWithStyle(pdf, `RESULT`, 15, textPosY, "nanum", "normal", 25, theme.colors.mainColor);
        addTextWithStyle(pdf, `진단결과`, 48, textPosY, "nanum", "normal", 17, theme.colors.mainColor);
        textPosY += 20;
        addTextWithStyle(pdf, `단원별 정답률 (이어서)`, 15, textPosY, "nanumBold", "bold", 17, `black`);
        textPosY += 15;
        pdf.setDrawColor(theme.colors.mainColor);
        pdf.setLineWidth(0.5);
      }
      addTextWithStyle(pdf, `${chapter.chapterDescription}`, 15, textPosY, "nanumBold", "bold", 12, `black`);
      textPosY -= 1;
      pdf.line(90, textPosY, 90 + chapter.percent, textPosY);
      pdf.circle(91 + chapter.percent, textPosY, 1);
      textPosY += 1;
      addTextWithStyle(
        pdf,
        `${chapter.percent}%`,
        95 + chapter.percent,
        textPosY,
        "nanumBold",
        "bold",
        10,
        theme.colors.gray40
      );
      textPosY += 10;
    });
    pdf.addPage();
    textPosY = 15;
    addTextWithStyle(pdf, `one report`, 15, textPosY, "nanumExtra", "extraBold", 16, theme.colors.gray80);
    textPosY -= 2;
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(45, textPosY, 200, textPosY);
    textPosY += 17;
    addTextWithStyle(pdf, `RESULT`, 15, textPosY, "nanum", "normal", 25, theme.colors.mainColor);
    addTextWithStyle(pdf, `진단결과`, 48, textPosY, "nanum", "normal", 17, theme.colors.mainColor);
    textPosY += 20;

    addTextWithStyle(pdf, `문항별 진단`, 15, textPosY, "nanumBold", "bold", 17, `black`);
    textPosY += 15;
    pdf.setLineWidth(1);
    paper.answerResponseDtos.map((question, index) => {
      if (textPosY > 282) {
        pdf.addPage();
        textPosY = 15;
        addTextWithStyle(pdf, `one report`, 15, textPosY, "nanumExtra", "extraBold", 16, theme.colors.gray80);
        textPosY -= 2;
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(45, textPosY, 200, textPosY);
        textPosY += 17;
        addTextWithStyle(pdf, `RESULT`, 15, textPosY, "nanum", "normal", 25, theme.colors.mainColor);
        addTextWithStyle(pdf, `진단결과`, 48, textPosY, "nanum", "normal", 17, theme.colors.mainColor);
        textPosY += 20;
        addTextWithStyle(pdf, `문항별 진단 (이어서)`, 15, textPosY, "nanumBold", "bold", 17, `black`);
        textPosY += 15;
        pdf.setLineWidth(1);
      }
      addTextWithStyle(pdf, `${index + 1}번`, 22, textPosY, "nanum", "normal", 10, theme.colors.gray50);
      addTextWithStyle(pdf, `${question.chapterDescription}`, 32, textPosY, "nanumBold", "bold", 12, `black`);
      addTextWithStyle(
        pdf,
        `${levelsToKorean[question.level]}`,
        140 - pdf.getTextWidth(levelsToKorean[question.level]) / 2,
        textPosY,
        "nanumBold",
        "bold",
        12,
        theme.colors.gray70
      );
      const oxPos = 170;
      if (question.rightAnswer) {
        pdf.setDrawColor(theme.colors.mainColor);
        pdf.circle(oxPos, textPosY - 1, 3.5);
      } else {
        pdf.setDrawColor(theme.colors.warning);
        pdf.line(oxPos - 3, textPosY - 4, oxPos + 3, textPosY + 2);
        pdf.line(oxPos - 3, textPosY + 2, oxPos + 3, textPosY - 4);
      }
      textPosY += 12;
    });

    // const pdfBlob = pdf.output("blob");
    // setPdfUrl(pdfBlob);
    // window.open(pdf.output("bloburl"));
    pdf.save(`${studentInfo.name}_원클릭보고서_${paper.title}.pdf`);
  };

  const makeWrongPaper = async () => {
    await postGetWrong(paper.id);
  };
  return (
    <EQ.ModalOverlay>
      <EQ.Modal>
        <canvas ref={chartRef} style={{ display: "none" }} width="2000" height="750"></canvas>
        <EQ.TitleLine>
          <EQ.Title>{paper.title}</EQ.Title>
          <EQ.SubmitDateBox></EQ.SubmitDateBox>
          <EQ.ScoreBox>
            {paper.totalScore === 0 ? `0점` : `${Math.floor((paper.score / paper.totalScore) * 100)}점`}
          </EQ.ScoreBox>
          <EQ.ReportBtn onClick={generatePDF}>원클릭 보고서 다운로드</EQ.ReportBtn>
          <EQ.CreateBtn onClick={makeWrongPaper}>오답학습지 만들기</EQ.CreateBtn>
          <EQ.CloseBtn onClick={closeModal}>
            <FontAwesomeIcon icon={faXmark} />
          </EQ.CloseBtn>
        </EQ.TitleLine>
        <EQ.ScoreSection>
          <EQ.AnswerSection>
            <EQ.Header>
              채점 기록은 즉시 저장됩니다.
              <EQ.HeaderBtn onClick={initialize}>전체 취소</EQ.HeaderBtn>
              <EQ.HeaderBtn onClick={wholeCorrect}>전체 정답</EQ.HeaderBtn>
              <EQ.HeaderBtn onClick={wholeWrong}>전체 오답</EQ.HeaderBtn>
            </EQ.Header>

            <EQ.AnswerContainer>
              {answers.map((answer, index) => (
                <EQ.AnswerLine $isCorrect={answer.rightAnswer}>
                  <EQ.IndexBox>{index + 1}번</EQ.IndexBox>
                  <EQ.AnswerBox $isMultiple={answer.category === "MULTIPLE"}>{answer.submitAnswer}</EQ.AnswerBox>
                  <EQ.PreviewBtn
                    $isSelected={selectedQuestion.number === index + 1}
                    onClick={() => {
                      setSelectedQuestion({ ...answer, number: index + 1 });
                    }}
                  >
                    <FontAwesomeIcon icon={faFileImage} />
                  </EQ.PreviewBtn>
                  <EQ.RightBtn
                    $isCorrect={answer.rightAnswer}
                    onClick={async () => {
                      await makeRight(answer);
                    }}
                  >
                    <FontAwesomeIcon icon={faO} />
                  </EQ.RightBtn>
                  <EQ.WrongBtn
                    $isCorrect={answer.rightAnswer === false}
                    onClick={async () => {
                      await makeWrong(answer);
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </EQ.WrongBtn>
                </EQ.AnswerLine>
              ))}
            </EQ.AnswerContainer>
          </EQ.AnswerSection>
          {selectedQuestion ? (
            <EQ.PreviewSection>
              <EQ.QuestionLabel>{selectedQuestion.number}번 문제</EQ.QuestionLabel>
              <EQ.QuestionImg src={selectedQuestion.questionImg} />
              <EQ.SolutionLabel>{selectedQuestion.number}번 해설</EQ.SolutionLabel>
              <EQ.SolutionImg src={selectedQuestion.solutionImg} />
            </EQ.PreviewSection>
          ) : (
            <EQ.PreviewSection>
              <EQ.SelectedNothing>
                선택된 문제가 없습니다.
                <br />
                상세 이미지를 열람하려면
                <br />
                이미지 파일 아이콘을 클릭하세요.
              </EQ.SelectedNothing>
            </EQ.PreviewSection>
          )}
        </EQ.ScoreSection>
      </EQ.Modal>
    </EQ.ModalOverlay>
  );
};

export default ScorePaper;

const EQ = {
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
  `,
  Modal: styled.div`
    background: ${({ theme }) => theme.colors.gray10};
    border-radius: 1rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 135rem;
    min-height: 80rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    background-color: white;
    height: 7rem;
    width: 100%;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,
  Title: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
  `,
  SubmitDateBox: styled.div`
    margin-left: auto;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray30};
  `,
  ScoreBox: styled.div`
    width: 6rem;
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
  `,
  ReportBtn: styled.button`
    width: 22rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.mainColor};
    background-color: ${({ theme }) => theme.colors.brightMain};
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 2rem;
  `,
  CreateBtn: styled.button`
    width: 22rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 2rem;
  `,
  CloseBtn: styled.button`
    width: 4rem;
    height: 4rem;
    font-size: 2.5rem;
    font-weight: 200;
    color: ${({ theme }) => theme.colors.gray40};
    margin-left: 2rem;
    margin-right: 2rem;
  `,

  ScoreSection: styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
  `,
  AnswerSection: styled.div`
    display: flex;
    flex-direction: column;
    width: 80rem;
  `,
  Header: styled.div`
    width: 80rem;
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.4rem;
    padding-left: 3rem;
    padding-right: 1.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray60};
  `,
  HeaderBtn: styled.button`
    width: 9rem;
    height: 4.5rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    background-color: ${({ theme }) => theme.colors.gray00};
    border-radius: 0.6rem;
    margin-left: 1rem;
    &:first-child {
      margin-left: auto;
    }
    font-size: 1.6rem;
  `,
  AnswerContainer: styled.div`
    background-color: ${({ theme }) => theme.colors.gray00};
    width: 100%;
    height: 66rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 0rem;
    }
  `,
  AnswerLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 1rem;
    background-color: ${({ $isCorrect, theme }) =>
      $isCorrect === null ? theme.colors.gray00 : $isCorrect ? theme.colors.brightMain : theme.colors.softWarning};
    border-top: 0.05rem solid
      ${({ $isCorrect, theme }) =>
        $isCorrect === null ? theme.colors.gray20 : $isCorrect ? theme.colors.mainColor : theme.colors.warning};
    &:last-child {
      border-bottom: 0.05rem solid
        ${({ $isCorrect, theme }) =>
          $isCorrect === null ? theme.colors.gray20 : $isCorrect ? theme.colors.mainColor : theme.colors.warning};
    }
  `,
  IndexBox: styled.div`
    width: 5rem;
    margin-right: 3rem;
    font-size: 1.8rem;
    font-weight: 600;
    text-align: right;
  `,
  AnswerBox: styled.div`
    font-size: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    ${({ $isMultiple, theme }) =>
      $isMultiple
        ? css`
            width: 2.8rem;
            height: 2.8rem;
            font-size: 2.3rem;
            justify-content: center;
            border: 0.01rem solid black;
            border-radius: 100rem;
          `
        : css``}
  `,
  PreviewBtn: styled.button`
    width: 4rem;
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray00};
    color: ${({ $isSelected, theme }) => ($isSelected ? `black` : theme.colors.gray40)};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    font-size: 2.4rem;
    margin-left: auto;
    margin-right: 0.5rem;
  `,
  RightBtn: styled.button`
    width: 8rem;
    height: 4rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    font-size: 2.5rem;
    color: ${({ $isCorrect, theme }) => ($isCorrect ? theme.colors.mainColor : theme.colors.gray30)};
  `,
  WrongBtn: styled.button`
    width: 8rem;
    font-size: 3rem;
    color: ${({ $isCorrect, theme }) => ($isCorrect ? theme.colors.warning : theme.colors.gray30)};
  `,

  PreviewSection: styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 2rem;
    border-left: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    background-color: white;
    width: 55rem;
    height: 72rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 0.75rem;
    }
    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      background: white;
    }
    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  QuestionLabel: styled.div`
    width: 10rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 2rem;
  `,
  QuestionImg: styled.img`
    width: 49rem;
    height: auto;
  `,
  SolutionLabel: styled.div`
    width: 10rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.lightMain};
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 3rem;
    margin-bottom: 2rem;
  `,
  SolutionImg: styled.img`
    width: 49rem;
    height: auto;
  `,
  SelectedNothing: styled.div`
    margin-top: 2rem;
    width: 51rem;
    height: 68rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.gray10};
    border-radius: 1rem;
    font-size: 1.8rem;
    font-weight: 600;
    line-height: 2.5rem;
  `,
};
