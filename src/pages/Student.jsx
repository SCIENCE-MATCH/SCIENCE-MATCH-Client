import React, { useState } from "react";
import StudentHeader from "../components/Student/StudentHeader";
import styled from "styled-components";
import LearningStatus from "../components/Student/LearningStatus/LearningStatus";
import StudMyPage from "../components/Student/Info/StudMyPage";
import ChangePwModal from "../components/Student/Modal/ChangePwModal";
import PaperTest from "../components/Student/PaperTest/PaperTest";

export const HEADER_DATA = ["학습 현황", "학습지", "1:1 질문지", "내 정보"];

const Student = () => {
  const [clickedList, setClickedList] = useState("학습 현황");
  const [modalOn, setModalOn] = useState(false);

  const handleClickList = (value) => {
    setClickedList(value);
  };

  const handleClickChangePW = () => {
    setModalOn(true);
  };

  const handleReturnCom = (clickedList) => {
    switch (clickedList) {
      case "학습 현황":
        return <LearningStatus />;
      case "1:1 질문지":
        return <PaperTest />;
      case "내 정보":
        return <StudMyPage handleClickChangePW={handleClickChangePW} />;
      default:
        break;
    }
  };

  return (
    <St.Wrapper>
      <StudentHeader clickedList={clickedList} handleClickList={handleClickList} />
      {handleReturnCom(clickedList)}

      {modalOn && <ChangePwModal setModalOn={setModalOn} />}
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
