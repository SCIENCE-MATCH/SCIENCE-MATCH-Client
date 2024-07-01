import React from "react";
import styled, { css } from "styled-components";
import useGetQuestionPaperList from "../../../libs/hooks/Student/useGetQuestionPaperList";

const QuestionPaperList = ({
  handleSelectedStatus,
  handleClickedOpenBtn,
  handleENStatus,
  clickedQuestionPaperId,
  clickedQuestionNum,
}) => {
  const status = localStorage.getItem("status");

  const { data } = useGetQuestionPaperList();

  const handleClickBtn = (id, questionNum, status) => {
    const selectedStatus = document.getElementById(`status_${id}`).innerHTML;

    handleENStatus(status);
    handleSelectedStatus(selectedStatus);
    clickedQuestionPaperId(id);
    clickedQuestionNum(questionNum);
    handleClickedOpenBtn();
  };

  const filterStatus = (data) => {
    switch (status) {
      case "전체":
        return data;

      case "학습대기":
        return data.assignStatus === "WAITING";

      case "풀이중":
        return data.assignStatus === "SOLVING";

      case "학습완료":
        return data.assignStatus === "COMPLETE" || data.assignStatus === "GRADED";

      default:
        return data;
    }
  };

  return (
    <St.Wrapper>
      {data &&
        data
          .filter((v) => filterStatus(v))
          .map((it) => {
            const id = it.id;
            const questionNum = it.questionNum;
            const status = it.assignStatus;

            return (
              <St.ContentsWrapper key={it.id}>
                <St.Status id={`status_${it.id}`} $status={it.assignStatus}>
                  {it.assignStatus === "WAITING" && "학습대기"}
                  {it.assignStatus === "SOLVING" && "풀이중"}
                  {it.assignStatus === "COMPLETE" && "학습완료"}
                  {it.assignStatus === "GRADED" && "학습완료"}
                </St.Status>
                <St.Subject>{it.subject}</St.Subject>

                <St.QuestionPaperWrapper>
                  <St.Title>{it.title}</St.Title>
                  <St.QuestionNum>{it.questionNum}문제</St.QuestionNum>
                </St.QuestionPaperWrapper>

                <St.GradingWrapper>
                  {it.assignStatus === "COMPLETE" && (
                    <St.Grading $isCorrectNum={false} $status={it.assignStatus}>
                      채점 전
                    </St.Grading>
                  )}
                  {it.assignStatus === "GRADED" && (
                    <>
                      <St.Grading $isCorrectNum={true} $status={it.assignStatus}>
                        {it.score}
                      </St.Grading>
                      <St.Grading $isCorrectNum={false} $status={it.assignStatus}>{`/ ${it.totalScore} 점`}</St.Grading>
                    </>
                  )}
                </St.GradingWrapper>

                <St.BtnWrapper>
                  <St.Button type="button" onClick={() => handleClickBtn(id, questionNum, status)}>
                    {it.assignStatus === "COMPLETE" || it.assignStatus === "GRADED" ? "결과 보기" : "문제 풀기"}
                  </St.Button>
                </St.BtnWrapper>
              </St.ContentsWrapper>
            );
          })}
    </St.Wrapper>
  );
};

export default QuestionPaperList;

const St = {
  Wrapper: styled.article`
    display: flex;
    flex-direction: column;

    min-height: calc(100vh - 16.6rem);
    padding: 0 4.4rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  ContentsWrapper: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 3.5fr 1.5fr 1.5fr;
    align-items: center;

    padding: 2.4rem 0;

    border-bottom: 0.1rem solid #f5f5f5;
  `,

  Status: styled.p`
    width: 9rem;
    padding: 0.3rem 0;

    border-radius: 0.8rem;

    background-color: ${({ $status, theme }) => {
      switch ($status) {
        case "WAITING":
          return css`
            ${theme.colors.statusWaiting}
          `;

        case "SOLVING":
          return css`
            ${theme.colors.headerPoint}
          `;

        case "COMPLETE":
          return css`
            ${theme.colors.statusComplete}
          `;

        case "GRADED":
          return css`
            ${theme.colors.statusComplete}
          `;

        default:
          break;
      }
    }};

    text-align: center;
    color: ${({ theme }) => theme.colors.headerBg};
    font-size: 2rem;
    font-weight: 700;
    line-height: 2.42rem;
  `,

  Subject: styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.headerLi};
    font-size: 2rem;
    font-weight: 700;
    line-height: 2.42rem;
  `,

  QuestionPaperWrapper: styled.div`
    display: flex;
    flex-direction: column;

    gap: 0.5rem;
  `,

  Title: styled.p`
    color: ${({ theme }) => theme.colors.headerLi};
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.42rem;
  `,

  QuestionNum: styled.p`
    color: ${({ theme }) => theme.colors.statusWaiting};
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.2rem;
  `,

  GradingWrapper: styled.div`
    display: flex;
    align-items: end;
    justify-content: center;

    gap: 0.7rem;
  `,

  Grading: styled.p`
    ${({ $isCorrectNum, $status, theme }) =>
      $isCorrectNum
        ? css`
            font-size: 2.4rem;
            font-weight: 700;
            line-height: 0.8;
          `
        : css`
            color: ${theme.colors.subText};
            font-size: ${$status === "GRADED" ? css`1.6rem` : css`2rem`};
            font-weight: 500;
          `};
  `,

  BtnWrapper: styled.div`
    text-align: end;
  `,

  Button: styled.button`
    padding: 0.8rem 2rem;

    border: 0.05rem solid ${({ theme }) => theme.colors.subText};
    border-radius: 0.8rem;

    font-size: 2rem;
    font-weight: 600;
    line-height: 2.42rem;
  `,
};
