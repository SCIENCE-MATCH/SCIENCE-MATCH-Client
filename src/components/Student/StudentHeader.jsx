import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { NAV_LIST } from "./PageLayout";

const StudentHeader = ({ clickedList, handleClickList }) => {
  const navigate = useNavigate();

  const handleClickInfoBtn = () => {
    // 추후 경로 확정 시, 수정 예정!
    navigate("/");
  };

  return (
    <St.HeaderWrapper>
      <St.Title>Science Match</St.Title>

      <St.NavBar>
        {NAV_LIST.map((it) => {
          return (
            <St.List key={it} $isClickedList={it === clickedList} onClick={(e) => handleClickList(e.target.innerHTML)}>
              {it}
            </St.List>
          );
        })}
      </St.NavBar>

      <St.InfoBtnWrapper>
        <St.InfoBtn type="button" onClick={handleClickInfoBtn}>
          내 정보
        </St.InfoBtn>
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

  NavBar: styled.nav`
    display: flex;
    justify-content: center;

    gap: 6rem;
  `,

  List: styled.li`
    list-style: none;

    color: ${({ theme, $isClickedList }) => ($isClickedList ? theme.colors.mainColor : theme.colors.headerLi)};
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