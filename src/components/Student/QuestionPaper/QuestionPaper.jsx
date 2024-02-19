import React, { useState } from "react";
import QuestionPaperHeader from "./QuestionPaperHeader";
import QuestionPaperList from "./QuestionPaperList";
import styled from "styled-components";
import Solving from "./Solving";
import Grading from "./Grading";

const QuestionPaper = () => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [status, setStatus] = useState("전체");
  const [questionPaperId, setQuestionPaperId] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);

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
        <Solving handleClickedCloseBtn={handleClickedCloseBtn} id={questionPaperId} questionNum={questionNum} />
      )}
      {isBtnClicked && status === "학습완료" && (
        <Grading handleClickedCloseBtn={handleClickedCloseBtn} id={questionPaperId} />
      )}

      {!isBtnClicked && (
        <>
          <QuestionPaperHeader handleSelectedStatus={handleSelectedStatus} />
          <QuestionPaperList
            handleSelectedStatus={handleSelectedStatus}
            handleClickedOpenBtn={handleClickedOpenBtn}
            clickedQuestionPaperId={(id) => setQuestionPaperId(id)}
            clickedQuestionNum={(num) => setQuestionNum(num)}
          />
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
