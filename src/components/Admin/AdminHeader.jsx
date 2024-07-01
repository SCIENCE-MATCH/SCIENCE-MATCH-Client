import React from "react";
import styled from "styled-components";
import useLogOut from "../../libs/hooks/Teacher/MyPage/useLogOut";
// React Component
const AdminHeader = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) => {
  const { logOut } = useLogOut();
  const tabs = {
    회원: ["선생님"],
    문제: ["추가", "검색"],
    개념: ["개념"],
  };

  return (
    <Ad.HeaderWrapper>
      <Ad.MainHeader>
        <Ad.Title>
          Science
          <Ad.ColoredTitle>Match</Ad.ColoredTitle>
        </Ad.Title>
        <Ad.NavBar>
          {Object.keys(tabs).map((tab) => (
            <Ad.TabBoxStyle
              id={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveSubTab(tabs[tab][0]);
              }}
              $issellected={activeTab === tab}
            >
              {tab}
              <Ad.UnderBar $sellected={activeTab === tab} />
            </Ad.TabBoxStyle>
          ))}
        </Ad.NavBar>
        <Ad.LogOutBtnWrapper>
          <Ad.LogOutBtn onClick={logOut}>로그 아웃</Ad.LogOutBtn>
        </Ad.LogOutBtnWrapper>
      </Ad.MainHeader>
      <Ad.SubHeader>
        <Ad.NavBar>
          {tabs[activeTab].map((subTab) => (
            <Ad.TabBoxStyle
              id={subTab}
              onClick={() => {
                setActiveSubTab(subTab);
              }}
              $issellected={activeSubTab === subTab}
            >
              {subTab}
              <Ad.UnderBar $sellected={activeSubTab === subTab} />
            </Ad.TabBoxStyle>
          ))}
        </Ad.NavBar>
      </Ad.SubHeader>
    </Ad.HeaderWrapper>
  );
};

export default AdminHeader;

const Ad = {
  HeaderWrapper: styled.header`
    height: 10rem; // 전체 높이
    background-color: ${({ theme }) => theme.colors.headerBg};
    display: flex; // flexbox를 사용하여 두 헤더를 수직으로 정렬
    flex-direction: column; // 자식 요소들을 세로로 배열
    align-items: center; // 가운데 정렬
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  MainHeader: styled.header`
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.headerBg};
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    display: grid;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20}; // 구분선 추가
  `,
  SubHeader: styled.header`
    height: 5rem; // 헤더 높이 설정
    background-color: ${({ theme }) => theme.colors.subHeaderBg}; // theme에서 SubHeader 배경색 설정 필요
    width: 100%; // 부모의 전체 너비를 차지하도록 설정
    display: flex;
    align-items: center;
    justify-content: center; // 내용을 중앙 정렬
  `,
  Title: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 2.6rem;

    line-height: 3.631rem;
    font-weight: 600;
    font-size: 3rem;
  `,
  ColoredTitle: styled.p`
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 3rem;
  `,

  SubTabs: styled.div`
    width: 100%;
    min-width: 180rem;
    height: 5rem;
    top: 0.5rem;
    background-color: white;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    border-bottom: 0.2rem solid ${({ theme }) => theme.colors.gray20};
  `,
  NavBar: styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;

    gap: 6rem;
  `,
  TabBoxStyle: styled.div`
    color: ${({ $issellected, theme }) => ($issellected ? theme.colors.mainColor : theme.colors.unsellected)};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15rem; // 변경됨
    height: 5rem;
    font-weight: bold;
    font-size: 2rem; // 변경됨
    position: relative;
  `,
  UnderBar: styled.div`
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $sellected }) => ($sellected ? `7.5rem` : 0)};
    height: 0.4rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
  `,
  SelectedTab: styled.div`
    color: ${({ theme }) => theme.colors.mainColor};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15rem; // 변경됨
    height: 5rem; // 변경됨
    font-weight: bold;
    font-size: 2.5rem; // 변경됨
  `,

  LogOutBtnWrapper: styled.div`
    margin-right: 2.6rem;

    text-align: right;
  `,
  LogOutBtn: styled.button`
    padding: 0.7rem 2rem;
    border-radius: 3rem;
    line-height: 1.936rem;
    font-weight: 700;
    font-size: 1.6rem;
    border: 1px solid black;
    color: black;
  `,
};
