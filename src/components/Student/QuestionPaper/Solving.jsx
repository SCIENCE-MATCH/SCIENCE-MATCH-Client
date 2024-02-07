import React from "react";
import styled from "styled-components";
import PageLayout from "./PageLayout";

const Solving = ({ handleClickedCloseBtn }) => {
  return (
    <PageLayout handleClickedCloseBtn={handleClickedCloseBtn}>
      <St.QuestionWrapper>
        {/* 추후 학습지 이미지로 대체할 예정 */}
        <St.QuestionImg></St.QuestionImg>
      </St.QuestionWrapper>
    </PageLayout>
  );
};

export default Solving;

const St = {
  QuestionWrapper: styled.div`
    width: 100%;
    height: 65rem;

    padding: 2.8rem 5.8rem;

    border-radius: 1.5rem;

    background-color: ${({ theme }) => theme.colors.brightGray};
  `,

  QuestionImg: styled.div`
    width: 100%;
    height: 100%;
  `,
};
