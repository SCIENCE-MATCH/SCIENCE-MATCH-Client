import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
const ScoreQuiz = ({ closeModal, evaluateArray }) => {
  const evaluate = async (score) => {
    if (evaluateArray.rightAnswer === score) {
      closeModal();
    } else
      try {
        const accessToken = getCookie("aToken");
        const url = "https://www.science-match.p-e.kr/teacher/grading/paperTest";

        Axios.post(
          url,
          {
            answerId: evaluateArray.answerId,
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
  return (
    <EQ.ModalOverlay>
      <EQ.Modal>
        <EQ.TitleLine>
          <EQ.Title>1:1 질문 다시 채점</EQ.Title>
        </EQ.TitleLine>
        <EQ.ContentLine>
          <EQ.QuizLabel>질문</EQ.QuizLabel>
          <EQ.TextBox>{evaluateArray.question}</EQ.TextBox>
        </EQ.ContentLine>
        <EQ.ContentLine>
          <EQ.SolutionLabel>정답</EQ.SolutionLabel>
          <EQ.AnswerBox>{evaluateArray.solution}</EQ.AnswerBox>
        </EQ.ContentLine>
        <EQ.ContentLine>
          <EQ.AnswerLabel>응답</EQ.AnswerLabel>
          <EQ.AnswerBox>{evaluateArray.submitAnswer}</EQ.AnswerBox>
        </EQ.ContentLine>
        <EQ.BtnLine>
          <EQ.CloseBtn onClick={closeModal}>닫기</EQ.CloseBtn>
          <EQ.WrognBtn
            onClick={() => {
              evaluate(false);
            }}
          >
            오답
          </EQ.WrognBtn>
          <EQ.CorrectBtn
            onClick={() => {
              evaluate(true);
            }}
          >
            정답
          </EQ.CorrectBtn>
        </EQ.BtnLine>
      </EQ.Modal>
    </EQ.ModalOverlay>
  );
};

export default ScoreQuiz;

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
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 69rem;
    min-height: 20rem;
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
    margin-bottom: 2rem;
  `,
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ContentLine: styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 3rem;
    margin-bottom: 2rem;
  `,
  SepLine: styled.div`
    margin-top: -0.5rem;
    width: 45%;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1.5rem;
    margin-left: 50%;
  `,
  QuizLabel: styled.div`
    color: ${({ theme }) => theme.colors.warning};
    font-size: 2rem;
    font-weight: 700;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  SolutionLabel: styled.div`
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 2rem;
    font-weight: 700;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
  `,
  AnswerLabel: styled.div`
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 2rem;
    font-weight: 700;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
  `,
  TextBox: styled.div`
    width: 56rem;
    min-height: 5rem;
    border-radius: 0.6rem;
    margin-left: 1.5rem;
    padding-inline: 1.5rem;
    padding-block: 1rem;
    font-size: 1.75rem;
    font-weight: 500;
    line-height: 2.5rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    margin-right: 4.5rem;
  `,
  AnswerBox: styled.div`
    width: 56rem;
    max-height: 5rem;
    border-radius: 0.6rem;
    margin-left: 1.5rem;
    padding-inline: 1.5rem;
    padding-block: 1rem;
    font-size: 1.75rem;
    font-weight: 500;
    line-height: 2.5rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    margin-right: 4.5rem;
    overflow: hidden;
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    padding-inline: 3rem;
    padding-block: 1.5rem;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  WrognBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
    margin-left: auto;
  `,
  CorrectBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    margin-left: 2rem;
  `,
};
