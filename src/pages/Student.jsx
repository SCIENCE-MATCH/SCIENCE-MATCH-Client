import React, { useState } from "react";
import StudentHeader from "../components/Student/StudentHeader";
import styled from "styled-components";
import LearningStatus from "../components/Student/LearningStatus/LearningStatus";

export const NAV_LIST = ["학습 현황", "학습지", "1:1 질문지"];

const Student = () => {
  const [clickedList, setClickedList] = useState("학습 현황");

  const handleClickList = (value) => {
    setClickedList(value);
  };

  return (
    <St.Wrapper>
      <StudentHeader clickedList={clickedList} handleClickList={handleClickList} />
      {clickedList === "학습 현황" && <LearningStatus />}
    </St.Wrapper>
  );
};

const St = {
  Wrapper: styled.div`
    height: 100vh;
    overflow-y: auto;

    background-color: ${({ theme }) => theme.colors.background};
  `,
};

export default Student;
