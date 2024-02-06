import React, { useState } from "react";
import StudentHeader from "../components/Student/StudentHeader";
import styled from "styled-components";
import LearningStatus from "../components/Student/LearningStatus/LearningStatus";
import StudMyPage from "../components/Student/Info/StudMyPage";

export const HEADER_DATA = ["학습 현황", "학습지", "1:1 질문지", "내 정보"];

const Student = () => {
  const [clickedList, setClickedList] = useState("학습 현황");

  const handleClickList = (value) => {
    setClickedList(value);
  };

  const handleReturnCom = (clickedList) => {
    switch (clickedList) {
      case "학습 현황":
        return <LearningStatus />;
      case "내 정보":
        return <StudMyPage />;
      default:
        return <LearningStatus />;
    }
  };

  return (
    <St.Wrapper>
      <StudentHeader clickedList={clickedList} handleClickList={handleClickList} />
      {handleReturnCom(clickedList)}
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
