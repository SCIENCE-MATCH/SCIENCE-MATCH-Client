import React from "react";
import styled from "styled-components";
import MonthlyReport from "./RightSide/MonthlyReport";
import WeeklyStatus from "./LeftSide/WeeklyStatus";
import useGetQuestionPaperList from "../../../libs/hooks/Student/useGetQuestionPaperList";

const LearningStatus = () => {
  localStorage.clear();
  const { data } = useGetQuestionPaperList();
  return (
    <St.Wrapper>
      <WeeklyStatus data={data} />
      <MonthlyReport />
    </St.Wrapper>
  );
};

export default LearningStatus;

const St = {
  Wrapper: styled.section`
    display: grid;
    align-items: center;
    grid-template-columns: repeat(2, 1fr);

    min-height: calc(100vh - 10.8rem);
    margin: 1.9rem 15.5rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,
};
