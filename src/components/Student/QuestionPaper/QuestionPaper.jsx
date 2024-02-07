import React, {  useState } from "react";
import QuestionPaperHeader from "./QuestionPaperHeader";
import QuestionPaperList from "./QuestionPaperList";
import styled from "styled-components";
import Solving from "./Solving";
import Grading from "./Grading";

const QuestionPaper = () => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [status, setStatus] = useState("학습대기");

  const handleClickedOpenBtn = () => {
    setIsBtnClicked(true);
  };

  const handleClickedCloseBtn = () => {
    setIsBtnClicked(false);
  };

  return (
    <St.Wrapper>
      {isBtnClicked && status !== "학습완료" && (
        <Solving handleClickedCloseBtn={handleClickedCloseBtn} isCompleted={false} />
      )}
      {isBtnClicked && status === "학습완료" && (
        <Grading handleClickedCloseBtn={handleClickedCloseBtn} isCompleted={true} />
      )}

      {!isBtnClicked && (
        <>
          <QuestionPaperHeader />
          <QuestionPaperList
            handleClickedOpenBtn={handleClickedOpenBtn}
            checkingStatus={(clickedStatus) => setStatus(clickedStatus)}
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
