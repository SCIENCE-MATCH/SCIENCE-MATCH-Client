import React, { useState } from "react";
import QuestionPaperHeader from "./QuestionPaperHeader";
import QuestionPaperList from "./QuestionPaperList";
import styled from "styled-components";
import Solving from "./Solving";
import Grading from "./Grading";

const QuestionPaper = () => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [status, setStatus] = useState("전체");
  const [assignStatus, setAssignStatus] = useState("WAITING");
  const [questionPaperId, setQuestionPaperId] = useState(0);
  const [originId, setOriginId] = useState(0);
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
        <Solving
          handleClickedCloseBtn={handleClickedCloseBtn}
          id={questionPaperId}
          originId={originId}
          questionNum={questionNum}
        />
      )}
      {isBtnClicked && status === "학습완료" && (
        <Grading handleClickedCloseBtn={handleClickedCloseBtn} id={questionPaperId} assignStatus={assignStatus} />
      )}

      {!isBtnClicked && (
        <>
          <QuestionPaperHeader handleSelectedStatus={handleSelectedStatus} />
          <QuestionPaperList
            handleSelectedStatus={handleSelectedStatus}
            handleClickedOpenBtn={handleClickedOpenBtn}
            handleENStatus={(status) => setAssignStatus(status)}
            clickedQuestionPaperId={(id) => setQuestionPaperId(id)}
            clickedOriginId={(originId) => setOriginId(originId)}
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
    margin: 7rem 15.5rem 0 15.5rem;
    @media only screen and (max-width: 900px) {
      margin: 12rem 1rem 0 1rem;
    }
  `,
};
