import React from "react";
import styled from "styled-components";

const QuestionPaperHeader = ({ status, handleSelectedStatus }) => {
  return (
    <St.Wrapper>
      <St.Status $isClicked={status === "전체"} onClick={(e) => handleSelectedStatus(e.target.innerHTML)}>
        전체
      </St.Status>
      <St.Status $isClicked={status === "학습대기"} onClick={(e) => handleSelectedStatus(e.target.innerHTML)}>
        학습대기
      </St.Status>
      <St.Status $isClicked={status === "풀이중"} onClick={(e) => handleSelectedStatus(e.target.innerHTML)}>
        풀이중
      </St.Status>
      <St.Status $isClicked={status === "학습완료"} onClick={(e) => handleSelectedStatus(e.target.innerHTML)}>
        학습완료
      </St.Status>
    </St.Wrapper>
  );
};

export default QuestionPaperHeader;

const St = {
  Wrapper: styled.header`
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    width: 100%;
    padding: 1.2rem 0;
    margin-bottom: 1.8rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  Status: styled.p`
    color: ${({ $isClicked, theme }) => ($isClicked ? theme.colors.mainColor : theme.colors.headerLi)};
    text-align: center;
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.9rem;
  `,
};
