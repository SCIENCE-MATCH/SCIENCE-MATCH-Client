import React from "react";
import styled from "styled-components";

const NAV_LIST = ["학습 현황", "학습지", "1:1 질문지"];

const StudentHeader = () => {
  return (
    <St.HeaderWrapper>
      <St.Title>Science Match</St.Title>

      <St.BtnWrapper>
        {NAV_LIST.map((it) => {
          return <St.Btn>{it}</St.Btn>;
        })}
      </St.BtnWrapper>

      <St.InfoBtnWrapper>
        <St.InfoBtn type="button">내 정보</St.InfoBtn>
      </St.InfoBtnWrapper>
    </St.HeaderWrapper>
  );
};

export default StudentHeader;

const St = {
  HeaderWrapper: styled.header`
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr;

    height: 6.6rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  Title: styled.p`
    margin-left: 2.6rem;

    line-height: 3.631rem;
    font-weight: 400;
    font-size: 3rem;
  `,

  BtnWrapper: styled.div`
    display: flex;
    justify-content: center;
    gap: 6rem;
  `,

  Btn: styled.button`
    color: ${({ theme }) => theme.colors.headerLi};
    line-height: 2.606rem;
    font-weight: 700;
    font-size: 1.8rem;
  `,

  InfoBtnWrapper: styled.div`
    margin-right: 2.6rem;

    text-align: right;
  `,

  InfoBtn: styled.button`
    padding: 0.7rem 2rem;

    border-radius: 3rem;
    border: 0.05rem solid #000000;

    color: ${({ theme }) => theme.colors.infoBtn};
    line-height: 1.936rem;
    font-weight: 700;
    font-size: 1.6rem;
  `,
};
