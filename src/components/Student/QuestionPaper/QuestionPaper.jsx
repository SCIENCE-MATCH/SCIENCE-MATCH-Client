import React, { useState } from "react";
import QuestionPaperHeader from "./QuestionPaperHeader";
import QuestionPaperList from "./QuestionPaperList";
import styled from "styled-components";
import Solving from "./Solving";
import Grading from "./Grading";

const QuestionPaper = () => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [status, setStatus] = useState("전체");

  const handleClickedOpenBtn = () => {
    setIsBtnClicked(true);
  };

  const handleClickedCloseBtn = () => {
    setIsBtnClicked(false);
  };

  const handleSelectedStatus = (selectedStatus) => {
    setStatus(selectedStatus);
  };

  return (
    <St.Wrapper>
      {isBtnClicked && status !== "학습완료" && (
        <Solving handleClickedCloseBtn={handleClickedCloseBtn} />
      )}
      {isBtnClicked && status === "학습완료" && (
        <Grading handleClickedCloseBtn={handleClickedCloseBtn} />
      )}

      {!isBtnClicked && (
        <>
          <QuestionPaperHeader handleSelectedStatus={handleSelectedStatus} />
          <QuestionPaperList handleSelectedStatus={handleSelectedStatus} handleClickedOpenBtn={handleClickedOpenBtn} />
        </>
      )}
    </St.Wrapper>
  );
};

export default QuestionPaper;

const St = {
  Wrapper: styled.section`
    margin: 1.9rem 15.5rem;
  `,
};
