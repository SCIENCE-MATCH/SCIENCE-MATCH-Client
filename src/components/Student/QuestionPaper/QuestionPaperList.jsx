import React from "react";
import styled from "styled-components";

const QuestionPaperList = () => {
// api 붙이면서 추가할 기능: 상태에 따른 분기처리(Status 배경색), 채점 상태에 따른 분기처리(채점 상태, 가장 우측 버튼)
  return (
    <St.Wrapper>
      <St.ContentsWrapper>
        <St.Status>풀이중</St.Status>
        <St.Subject>지구과학2</St.Subject>

        <St.QuestionPaperWrapper>
          <St.Title>개념+유형라이트 - 개념책 8p ~ 75p</St.Title>
          <St.QuestionNum>104문제</St.QuestionNum>
        </St.QuestionPaperWrapper>

        <St.Grading>채점 전</St.Grading>

        <St.BtnWrapper>
          <St.Button type="button">문제 풀기</St.Button>
        </St.BtnWrapper>
      </St.ContentsWrapper>
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

    background-color: ${({ theme }) => theme.colors.headerPoint};

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
