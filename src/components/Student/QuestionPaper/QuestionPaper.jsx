import React from "react";
import QuestionPaperHeader from "./QuestionPaperHeader";
import QuestionPaperList from "./QuestionPaperList";
import styled from "styled-components";

const QuestionPaper = () => {
  return (
    <St.Wrapper>
      <QuestionPaperHeader />
      <QuestionPaperList />
    </St.Wrapper>
  );
};

export default QuestionPaper;

const St = {
  Wrapper: styled.section`
    margin: 1.9rem 15.5rem;
  `,
};
