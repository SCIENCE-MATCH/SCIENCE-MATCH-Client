import React from "react";
import styled, { css } from "styled-components";

const StudMyPage = ({ handleClickChangePW }) => {
  return (
    <St.Wrapper>
      <St.ContentsWrapper>
        <St.Contents>
          <St.Category>이름</St.Category>
          <St.Info $isBold={false} $addBorder={false}>
            김학생
          </St.Info>
        </St.Contents>

        <St.Contents>
          <St.Category>학생 ID</St.Category>
          <St.Info $isBold={true} $addBorder={false}>
            S012345678
          </St.Info>
        </St.Contents>

        <St.Contents>
          <St.Category>비밀번호</St.Category>
          <St.Info $isBold={true} $addBorder={true} onClick={handleClickChangePW}>
            비밀번호 변경
          </St.Info>
        </St.Contents>

        <St.Contents>
          <St.Category>연락처</St.Category>
          <St.Info $isBold={false} $addBorder={false}>
            010-1234-5678
          </St.Info>
        </St.Contents>

        <St.Contents>
          <St.Category>학부모 연락처</St.Category>
          <St.Info $isBold={false} $addBorder={false}>
            010-2345-6789
          </St.Info>
        </St.Contents>
      </St.ContentsWrapper>
    </St.Wrapper>
  );
};

export default StudMyPage;

const St = {
  Wrapper: styled.section`
    min-height: calc(100vh - 12.8rem);
    margin: 3.1rem 15.5rem;
    padding: 7.5rem 0 0 11.3rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  ContentsWrapper: styled.article`
    display: flex;
    flex-direction: column;

    width: fit-content;

    gap: 3rem;
  `,

  Contents: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
  `,

  Category: styled.p`
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 1.936rem;
  `,

  Info: styled.p`
    ${({ $addBorder, theme }) =>
      $addBorder &&
      css`
        margin: -0.7rem 0;
        padding: 0.7rem;

        border: 0.7rem solid ${theme.colors.mainColor};

        text-align: center;
      `};

    font-weight: ${({ $isBold }) => ($isBold ? 600 : 500)};
    font-size: 1.6rem;
    line-height: 1.936rem;
  `,
};
