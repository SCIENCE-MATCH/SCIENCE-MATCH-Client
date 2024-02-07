import React, { useState } from "react";
import QuestionPaperHeader from "./QuestionPaperHeader";
import QuestionPaperList from "./QuestionPaperList";
import styled from "styled-components";
import Solving from "./Solving";

const QuestionPaper = () => {
  // isBtnClicked -> 채점 완료/ 문제 풀기
  // !isBtnClicked -> 홈 뷰

  const [isBtnClicked, setIsBtnClicked] = useState(false);

  const handleClickedOpenBtn = () => {
    setIsBtnClicked(true);
  };

  const handleClickedCloseBtn = () => {
    setIsBtnClicked(false);
  };

  return (
    <St.Wrapper>
      {isBtnClicked ? (
        <Solving handleClickedCloseBtn={handleClickedCloseBtn} />
      ) : (
        <>
          <QuestionPaperHeader />
          <QuestionPaperList handleClickedOpenBtn={handleClickedOpenBtn} />
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
