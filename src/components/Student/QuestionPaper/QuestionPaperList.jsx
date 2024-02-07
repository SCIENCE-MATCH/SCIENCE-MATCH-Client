import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const DUMMY = [
  {
    id: 0,
    subject: "PHYSICS",
    assignStatus: "WAITING",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
  {
    id: 1,
    subject: "PHYSICS",
    assignStatus: "COMPLETE",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
  {
    id: 2,
    subject: "PHYSICS",
    assignStatus: "SOLVING",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
  {
    id: 3,
    subject: "PHYSICS",
    assignStatus: "SOLVING",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
  {
    id: 4,
    subject: "PHYSICS",
    assignStatus: "WAITING",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
  {
    id: 5,
    subject: "PHYSICS",
    assignStatus: "SOLVING",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
  {
    id: 6,
    subject: "PHYSICS",
    assignStatus: "COMPLETE",
    title: "개념+유형라이트 - 개념책 8p ~ 75p",
    questionNum: 140,
  },
];

const QuestionPaperList = ({ status, handleSelectedStatus, handleClickedOpenBtn }) => {
  const [statusEN, setStatusEN] = useState("TOTAL");

  const handleClickBtn = (e) => {
    const selectedStatus = e.target.parentNode.parentNode.children[0].innerHTML;
    handleSelectedStatus(selectedStatus);
    handleClickedOpenBtn();
  };

  useEffect(() => {
    switch (status) {
      case "전체":
        setStatusEN("TOTAL");
        break;

      case "학습대기":
        setStatusEN("WAITING");
        break;

      case "풀이중":
        setStatusEN("SOLVING");
        break;

      case "학습완료":
        setStatusEN("COMPLETE");
        break;

      default:
        break;
    }
  }, [status]);

  return (
    <St.Wrapper>
      {DUMMY.filter((v) => (statusEN === "TOTAL" ? v : v.assignStatus === statusEN)).map((it) => {
        return (
          <St.ContentsWrapper key={it.id}>
            <St.Status id="status" $status={it.assignStatus}>
              {it.assignStatus === "WAITING" && "학습대기"}
              {it.assignStatus === "SOLVING" && "풀이중"}
              {it.assignStatus === "COMPLETE" && "학습완료"}
            </St.Status>
            <St.Subject>{it.subject}</St.Subject>

            <St.QuestionPaperWrapper>
              <St.Title>{it.title}</St.Title>
              <St.QuestionNum>{it.questionNum}문제</St.QuestionNum>
            </St.QuestionPaperWrapper>

            <St.Grading>채점 전</St.Grading>

            <St.BtnWrapper>
              <St.Button type="button" onClick={handleClickBtn}>
                {it.assignStatus === "COMPLETE" ? "결과 보기" : "문제 풀기"}
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

  Grading: styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.subText};
    font-size: 2rem;
    font-weight: 500;
    line-height: 2.42rem;
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
