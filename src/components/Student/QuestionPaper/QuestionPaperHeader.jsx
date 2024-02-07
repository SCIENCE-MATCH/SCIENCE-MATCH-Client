import React from "react";
import styled from "styled-components";

const QuestionPaperHeader = ({ handleSelectedStatus }) => {
  const status = localStorage.getItem("status") ? localStorage.getItem("status") : "전체";

  const handleClickFn = (e) => {
    handleSelectedStatus(e.target.innerHTML);
    localStorage.setItem("status", e.target.innerHTML);
  };
  return (
    <St.Wrapper>
      <St.Status $isClicked={status === "전체"} onClick={handleClickFn}>
        전체
      </St.Status>
      <St.Status $isClicked={status === "학습대기"} onClick={handleClickFn}>
        학습대기
      </St.Status>
      <St.Status $isClicked={status === "풀이중"} onClick={handleClickFn}>
        풀이중
      </St.Status>
      <St.Status $isClicked={status === "학습완료"} onClick={handleClickFn}>
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
