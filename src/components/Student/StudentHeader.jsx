import React from "react";
import styled, { css } from "styled-components";
import { HEADER_DATA } from "../../pages/Student";

const StudentHeader = ({ clickedList, handleClickList }) => {
  const lastData = HEADER_DATA.length - 1;

  return (
    <St.HeaderWrapper>
      <St.Title>
        Science
        <St.ColoredTitle>Match</St.ColoredTitle>
      </St.Title>
      <St.NavBar>
        {HEADER_DATA.slice(0, lastData).map((it) => {
          return (
            <St.List key={it} $isClickedList={it === clickedList} onClick={(e) => handleClickList(e.target.innerHTML)}>
              {it}
            </St.List>
          );
        })}
      </St.NavBar>

      <St.InfoBtnWrapper>
        <St.InfoBtn
          type="button"
          $isClickedList={HEADER_DATA[lastData] === clickedList}
          onClick={(e) => handleClickList(e.target.innerHTML)}
        >
          {HEADER_DATA[lastData]}
        </St.InfoBtn>
      </St.InfoBtnWrapper>
    </St.HeaderWrapper>
  );
};

export default StudentHeader;

const St = {
  HeaderWrapper: styled.header`
    position: absolute;
    width: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.headerBg};
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    z-index: 10;

    @media only screen and (max-width: 900px) {
      height: 10rem; /* 높이를 자동으로 설정하여 모든 내용이 표시되도록 함 */
      grid-template-columns: 50% 50%; /* 첫 번째 줄의 두 요소가 50%씩 차지 */
      grid-template-rows: auto auto; /* 두 번째 줄에 한 요소가 100% 차지 */
      text-align: center;

      & > :nth-child(1),
      & > :nth-child(3) {
        grid-column: span 1; /* 각각 50% 너비 */
      }

      & > :nth-child(2) {
        grid-column: span 2; /* 100% 너비 */
        order: 3;
      }
    }
  `,

  Title: styled.p`
    width: 20rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 2.6rem;

    font-weight: 600;
    font-size: 3rem;

    @media only screen and (max-width: 900px) {
      width: 17rem;
      margin-left: 1.6rem;
      font-size: 2.5rem;
    }
  `,
  ColoredTitle: styled.p`
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 3rem;
    @media only screen and (max-width: 900px) {
      font-size: 2.5rem;
    }
  `,

  NavBar: styled.nav`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-inline: 3rem;

    gap: 6rem;
    @media only screen and (max-width: 1100px) {
      padding-inline: 2rem;
      gap: 1rem;
    }
    @media only screen and (max-width: 900px) {
      font-size: 2.5rem;
      gap: 3rem;
    }
    @media only screen and (max-width: 600px) {
      font-size: 2.5rem;
      gap: 2rem;
    }
  `,

  List: styled.li`
    list-style: none;

    color: ${({ theme, $isClickedList }) => ($isClickedList ? theme.colors.mainColor : theme.colors.headerLi)};
    display: flex;
    align-items: center;
    justify-content: center;

    line-height: 2.606rem;
    font-weight: 700;
    font-size: 2rem;
    width: 13rem;
    cursor: pointer;
  `,

  InfoBtnWrapper: styled.div`
    margin-right: 2.6rem;

    text-align: right;
    @media only screen and (max-width: 900px) {
      margin-right: 1.6rem;
    }
  `,

  InfoBtn: styled.button`
    padding: 0.7rem 2rem;

    border-radius: 3rem;
    ${({ $isClickedList, theme }) =>
      $isClickedList
        ? css`
            border: 0.05rem solid ${theme.colors.headerPoint};
            color: ${theme.colors.headerPoint};
          `
        : css`
            border: 0.05rem solid #000000;
            color: ${theme.colors.infoBtn};
          `};

    line-height: 1.936rem;
    font-weight: 700;
    font-size: 1.6rem;
  `,
};
