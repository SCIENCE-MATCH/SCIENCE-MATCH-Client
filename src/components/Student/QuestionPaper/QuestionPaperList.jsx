import React from "react";
import styled, { css } from "styled-components";
import useGetQuestionPaperList from "../../../libs/hooks/Student/useGetQuestionPaperList";

const QuestionPaperList = ({
  handleSelectedStatus,
  handleClickedOpenBtn,
  handleENStatus,
  clickedQuestionPaperId,
  clickedOriginId,
  clickedQuestionNum,
}) => {
  const status = localStorage.getItem("status");

  const { data } = useGetQuestionPaperList();

  const handleClickBtn = (id, originId, questionNum, status) => {
    const selectedStatus = document.getElementById(`status_${id}`).innerHTML;

    handleENStatus(status);
    handleSelectedStatus(selectedStatus);
    clickedQuestionPaperId(id);
    clickedOriginId(originId);
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
  const getKoreanGrade = (school, subject, semester) => {
    // 학교명을 한글로 변환
    const schoolNames = { ELEMENTARY: "초", MIDDLE: "중", HIGH: "고" };

    // 과목명을 한글로 변환
    const subjectNames = { SCIENCE: "과학", PHYSICS: "물", CHEMISTRY: "화", BIOLOGY: "생", EARTH_SCIENCE: "지" };

    // 학기명을 서수로 변환
    const semesterNames = {
      FIRST1: "1-1",
      FIRST2: "1-2",
      SECOND1: "2-1",
      SECOND2: "2-2",
      THIRD1: "3-1",
      THIRD2: "3-2",
      FOURTH1: "4-1",
      FOURTH2: "4-2",
      FIFTH1: "5-1",
      FIFTH2: "5-2",
      SIXTH1: "6-1",
      SIXTH2: "6-2",
    };

    // subject가 SCIENCE인 경우
    if (subject === "SCIENCE") {
      const schoolNameKorean = schoolNames[school];
      const grade = semesterNames[semester];
      if (schoolNameKorean && grade) {
        return `${schoolNameKorean}${grade}`;
      } else {
        return "Invalid input";
      }
    }

    // subject가 SCIENCE가 아닌 경우
    const subjectNameKorean = subjectNames[subject];
    if (subjectNameKorean) {
      const semesterNumber = semester.includes("FIRST") ? "1" : "2";
      return `${subjectNameKorean}${semesterNumber}`;
    }

    return "Invalid input";
  };

  return (
    <St.Wrapper>
      {data &&
        data
          .filter((v) => filterStatus(v))
          .map((it) => {
            const id = it.id;
            const originId = it.originQuestionPaperId;
            const questionNum = it.questionNum;
            const status = it.assignStatus;

            return (
              <St.ContentsWrapper key={id}>
                <St.Status id={`status_${id}`} $status={status}>
                  {status === "WAITING" && "학습대기"}
                  {status === "SOLVING" && "풀이중"}
                  {status === "COMPLETE" && "학습완료"}
                  {status === "GRADED" && "학습완료"}
                </St.Status>
                <St.Subject>{getKoreanGrade(it.school ?? "HIGH", it.subject, it.semester ?? "FIRST1")}</St.Subject>

                <St.QuestionPaperWrapper>
                  <St.Title>{it.title}</St.Title>
                  <St.QuestionNum>{questionNum}문제</St.QuestionNum>
                </St.QuestionPaperWrapper>

                <St.GradingWrapper>
                  {status === "COMPLETE" && (
                    <St.Grading $isCorrectNum={false} $status={status}>
                      채점 전
                    </St.Grading>
                  )}
                  {status === "GRADED" && (
                    <>
                      <St.Grading $isCorrectNum={true} $status={status}>
                        {it.score}
                      </St.Grading>
                      <St.Grading $isCorrectNum={false} $status={status}>{`/ ${it.totalScore} 점`}</St.Grading>
                    </>
                  )}
                </St.GradingWrapper>

                <St.BtnWrapper>
                  <St.Button type="button" onClick={() => handleClickBtn(id, originId, questionNum, status)}>
                    {status === "COMPLETE" || status === "GRADED" ? "결과 보기" : "문제 풀기"}
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
    height: 40rem;
    overflow-y: scroll;
    padding: 0 4.4rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
    @media only screen and (max-width: 900px) {
      padding: 0 1.4rem;
    }
  `,

  ContentsWrapper: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 3.5fr 1.5fr 1.5fr;
    align-items: center;

    padding: 2.4rem 0;

    border-bottom: 0.1rem solid #f5f5f5;
    @media only screen and (max-width: 900px) {
    }
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
    @media only screen and (max-width: 900px) {
      font-size: 1.5rem;
    }
  `,
};
