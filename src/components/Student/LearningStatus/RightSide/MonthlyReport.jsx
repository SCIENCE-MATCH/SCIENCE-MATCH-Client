import React from "react";
import styled from "styled-components";
import HorizontalBarChart from "./HorizontalBarChart";
import MonthlyPieChart from "./MonthlyPieChart";

const MonthlyReport = () => {
  return (
    <St.Wrapper>
      <St.CorrectRateWrapper>
        <St.Title>이번달 문제 난이도별 정답률</St.Title>
        <HorizontalBarChart />
      </St.CorrectRateWrapper>

      <St.MonthlyReportWrapper>
        <St.Title>이번달 보고서</St.Title>

        <St.ContentsWrapper>
          <St.Contents>학습 기간 | 5월 2일 ~ 5월 30일</St.Contents>
          <St.Contents>학습 범위 | 1 - 1 단원 ~ 2 - 3 단원</St.Contents>
        </St.ContentsWrapper>

        <St.ReportWrapper>
          <St.GradeWrapper>
            <St.Grade>1</St.Grade>
            <St.Label>종합 등급</St.Label>
          </St.GradeWrapper>

          <MonthlyPieChart />
        </St.ReportWrapper>
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

    margin: 5.1rem 4.7rem 5.9rem 0;

    gap: 4.4rem;
  `,

  CorrectRateWrapper: styled.article`
    display: flex;
    flex-direction: column;

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

  ReportWrapper: styled.div`
    display: grid;
    grid-template-columns: 0.7fr 3fr;
    align-items: center;

    margin-top: 3rem;
  `,

  GradeWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    border-right: 0.1rem solid ${({ theme }) => theme.colors.logoutBtn};

    gap: 2rem;
  `,

  Grade: styled.p`
    font-weight: 600;
    font-size: 3rem;
    line-height: 2.42rem;
  `,

  Label: styled.p`
    color: ${({ theme }) => theme.colors.headerLi};
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 2.42rem;
  `,
};
