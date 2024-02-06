import React from "react";
import styled from "styled-components";
import MonthlyReport from "./RightSide/MonthlyReport";
import WeeklyStatus from "./LeftSide/WeeklyStatus";

const LearningStatus = () => {
  return (
    <St.Wrapper>
      <WeeklyStatus />
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

    margin: 3.1rem 10.3rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,
};
