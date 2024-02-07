import React, { useState } from "react";
import styled from "styled-components";

const STATUS = ["전체", "학습대기", "풀이중", "학습완료"];

const QuestionPaperHeader = () => {
  const [isClickedStatus, setIsClickedStatus] = useState("전체");

  const handleClickStatus = (e) => {
    setIsClickedStatus(e.target.innerHTML);
  };

  return (
    <St.Wrapper>
      {STATUS.map((it) => {
        return (
          <St.Status key={it} $isClicked={isClickedStatus === it} onClick={handleClickStatus}>
            {it}
          </St.Status>
        );
      })}
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
