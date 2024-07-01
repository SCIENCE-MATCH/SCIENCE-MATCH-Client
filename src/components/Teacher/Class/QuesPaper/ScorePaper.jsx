import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import styled, { css } from "styled-components";
import { faFileImage, faImage } from "@fortawesome/free-regular-svg-icons";
import { faO, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const ScorePaper = ({ closeModal, paper }) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const [answers, setAnswers] = useState(paper.answerResponseDtos);
  const score = async (score) => {
    if (paper.rightAnswer === score) {
      closeModal();
    } else
      try {
        const accessToken = getCookie("aToken");
        const url = "https://www.science-match.p-e.kr/teacher/grading/paperTest";

        Axios.post(
          url,
          {
            answerId: paper.answerId,
            rightAnswer: score,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        alert("채점 실패");
      } finally {
        closeModal();
      }
  };
  const makeRight = (target) => {
    const tempPaper = answers.map((answer) => (answer.id === target.id ? { ...answer, rightAnswer: true } : answer));

    setAnswers(tempPaper); // 새 배열을 반환
  };
  const makeWrong = (target) => {
    const tempPaper = answers.map((answer) => (answer.id === target.id ? { ...answer, rightAnswer: false } : answer));

    setAnswers(tempPaper); // 새 배열을 반환
  };

  const initialize = () => {
    setAnswers(paper.answerResponseDtos);
    console.log(paper.answerResponseDtos);
  };
  const wholeCorrect = () => {
    setAnswers(answers.map((answer) => ({ ...answer, rightAnswer: true })));
  };
  const wholeWrong = () => {
    setAnswers(answers.map((answer) => ({ ...answer, rightAnswer: false })));
  };
  /**
            {
                "id": 415,
                "submitAnswer": "3",
                "solution": "5",
                "solutionImg": "https://s3.ap-northeast-2.amazonaws.com/science-match-bucket/solution/image/5dce5cfc-e3ce-43b1-b4cf-10fa0cc6d1b1.jpg",
                "category": "MULTIPLE",
                "rightAnswer": false
            }, */

  const circleNumbers = [`①`, `②`, `③`, `④`, `⑤`];

  return (
    <EQ.ModalOverlay>
      <EQ.Modal>
        <EQ.TitleLine>
          <EQ.Title>{paper.title}</EQ.Title>
          <EQ.SubmitDateBox>날짜</EQ.SubmitDateBox>
          <EQ.ScoreBox>0점</EQ.ScoreBox>
          <EQ.ReportBtn>원클릭 보고서</EQ.ReportBtn>
          <EQ.CreateBtn>오답학습지 만들기</EQ.CreateBtn>
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
                <EQ.AnswerLine $isCorrect={answer.category === "MULTIPLE" ? answer.rightAnswer : null}>
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
                    onClick={() => {
                      makeRight(answer);
                    }}
                  >
                    <FontAwesomeIcon icon={faO} />
                  </EQ.RightBtn>
                  <EQ.WrongBtn
                    $isCorrect={answer.rightAnswer === false}
                    onClick={() => {
                      makeWrong(answer);
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
              <EQ.QuestionImg src={selectedQuestion.solutionImg} />
              <EQ.SolutionLabel>{selectedQuestion.number}번 해설</EQ.SolutionLabel>
              <EQ.SolutionImg src={selectedQuestion.solutionImg} />
            </EQ.PreviewSection>
          ) : (
            <EQ.PreviewSection>없음</EQ.PreviewSection>
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
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 135rem;
    min-height: 80rem;
    display: flex;
    flex-direction: column;
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
    width: 5rem;
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
  `,
  ReportBtn: styled.button`
    width: 18rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.mainColor};
    background-color: ${({ theme }) => theme.colors.brightMain};
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 3rem;
  `,
  CreateBtn: styled.button`
    width: 22rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 1rem;
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
};
