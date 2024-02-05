import React from "react";
import styled from "styled-components";
import ResolvedQuestionGraph from "./ResolvedQuestionGraph";

const WeeklyStatus = () => {
  return (
    <St.Wrapper>
      <St.WeeklyWrapper>
        <St.Title>이번 주 현황</St.Title>

        <St.WeeklyContentsWrapper>
          <St.ContentsWrapper>
            <St.Text>문제 수</St.Text>
            <St.Text>100문제</St.Text>
          </St.ContentsWrapper>

          <St.ContentsWrapper>
            <St.Text>정답률</St.Text>
            <St.Text>80%</St.Text>
          </St.ContentsWrapper>
        </St.WeeklyContentsWrapper>
      </St.WeeklyWrapper>

      <St.MonthlyQuestionWrapper>
        <St.Title>최근 한달간 푼 문제</St.Title>

        <ResolvedQuestionGraph />
      </St.MonthlyQuestionWrapper>
    </St.Wrapper>
  );
};

export default WeeklyStatus;

const St = {
  Wrapper: styled.article`
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin: 9.1rem 0 5.9rem 16.4rem;

    gap: 9.1rem;
  `,

  WeeklyWrapper: styled.article`
    display: flex;
    flex-direction: column;
    justify-content: center;

    gap: 3.2rem;
  `,

  Title: styled.p`
    font-weight: 600;
    font-size: 3.2rem;
    line-height: 3.873rem;
  `,

  WeeklyContentsWrapper: styled.div`
    display: flex;

    gap: 10.9rem;
  `,

  ContentsWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 1.8rem;
  `,

  Text: styled.p`
    font-weight: 600;
    font-size: 3rem;
    line-height: 3.631rem;
  `,

  MonthlyQuestionWrapper: styled.article`
    display: flex;
    flex-direction: column;
    justify-content: center;

    gap: 3.2rem;
  `,
};
