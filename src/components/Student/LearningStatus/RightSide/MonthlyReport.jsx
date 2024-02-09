import React from "react";
import styled from "styled-components";

const MonthlyReport = () => {
  return (
    <St.Wrapper>
      <St.CorrectRateWrapper>
        <St.Title>이번달 문제 난이도별 정답률</St.Title>

        {/* 피그마 상에서 그래프 들어가는 부분 */}
      </St.CorrectRateWrapper>

      <St.MonthlyReportWrapper>
        <St.Title>이번달 보고서</St.Title>

        <St.ContentsWrapper>
          <St.Contents>학습 기간 | 5월 2일 ~ 5월 30일</St.Contents>
          <St.Contents>학습 범위 | 1 - 1 단원 ~ 2 - 3 단원</St.Contents>
        </St.ContentsWrapper>

        {/* 피그마 상에서 그래프 들어가는 부분 */}
      </St.MonthlyReportWrapper>
    </St.Wrapper>
  );
};

export default MonthlyReport;

const St = {
  Wrapper: styled.article`
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin: 5.1rem 0 5.9rem 4.7rem;

    gap: 4.4rem;
  `,

  CorrectRateWrapper: styled.article`
    display: flex;
    flex-direction: column;

    // 추후 사라져야 할 부분 ! (그래프 들어갈 공간 띄워둠)
    margin-bottom: 25.8rem;

    gap: 4.8rem;
  `,

  Title: styled.p`
    font-weight: 600;
    font-size: 3.2rem;
    line-height: 3.873rem;
  `,

  MonthlyReportWrapper: styled.article`
    display: flex;
    flex-direction: column;

    // 추후 사라져야 할 부분 ! (그래프 들어갈 공간 띄워둠)
    margin-bottom: 14rem;

    gap: 1.3rem;
  `,

  ContentsWrapper: styled.div`
    display: flex;
    flex-direction: column;

    gap: 0.7rem;
  `,

  Contents: styled.p`
    font-weight: 600;
    font-size: 2rem;
    line-height: 2.42rem;
  `,
};
