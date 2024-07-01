import styled, { css } from "styled-components";

const TeacherHeader = ({ activeTab, setTab, activeSubTab, setSubTab }) => {
  const tabs = {
    "수업 준비": ["학습지", "1:1 질문지"],
    수업: ["학습내역", "학습지", "1:1 질문지", "보고서"],
    관리: ["학생관리", "반관리"],
  };
  const handleMyPageClick = () => {
    setTab("MyPage");
  };

  const handleReturnSubTab = () => {
    return activeTab === "MyPage" ? (
      <></>
    ) : (
      <Te.SubHeader>
        <Te.NavBar>
          {tabs[activeTab].map((subTab) => (
            <Te.TabBoxStyle
              id={subTab}
              onClick={() => {
                setSubTab(subTab);
              }}
              $isSelected={activeSubTab === subTab}
            >
              {subTab}
              <Te.UnderBar $selected={activeSubTab === subTab} />
            </Te.TabBoxStyle>
          ))}
        </Te.NavBar>
      </Te.SubHeader>
    );
  };

  return (
    <Te.HeaderWrapper $onMyPage={activeTab === "MyPage"}>
      <Te.MainHeader>
        <Te.Title>
          Science
          <Te.ColoredTitle>Match</Te.ColoredTitle>
        </Te.Title>
        <Te.NavBar>
          {Object.keys(tabs).map((tab) => (
            <Te.TabBoxStyle
              id={tab}
              onClick={() => {
                setTab(tab);
                setSubTab(tabs[tab][0]);
              }}
              $isSelected={activeTab === tab}
            >
              {tab}
              <Te.UnderBar $selected={activeTab === tab} />
            </Te.TabBoxStyle>
          ))}
        </Te.NavBar>
        <Te.MyPageBtnWrapper>
          <Te.MyPageBtn onClick={handleMyPageClick} $isMyPage={activeTab === "MyPage"}>
            내 정보
          </Te.MyPageBtn>
        </Te.MyPageBtnWrapper>
      </Te.MainHeader>
      {handleReturnSubTab()}
    </Te.HeaderWrapper>
  );
};

export default TeacherHeader;

const Te = {
  HeaderWrapper: styled.header`
    height: ${({ $onMyPage }) => ($onMyPage ? "5rem" : "10rem")}; // 전체 높이
    background-color: ${({ theme }) => theme.colors.headerBg};
    display: flex; // flexbox를 사용하여 두 헤더를 수직으로 정렬
    flex-direction: column; // 자식 요소들을 세로로 배열
    align-items: center; // 가운데 정렬
    border-bottom: 0.2rem solid ${({ theme }) => theme.colors.gray20};
  `,
  MainHeader: styled.header`
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.headerBg};
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    display: grid;
    align-items: center;
    border-bottom: 0.2rem solid ${({ theme }) => theme.colors.gray20}; // 구분선 추가
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
    min-width: 180rem; // 변경됨
    height: 5rem; // 변경됨
    top: 0.5rem; // 변경됨
    background-color: white;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    border-bottom: 0.2rem solid ${({ theme }) => theme.colors.gray20}; // 변경됨
  `,
  NavBar: styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;

    gap: 6rem;
  `,
  TabBoxStyle: styled.div`
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.headerPoint : theme.colors.unsellected)};
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
    width: ${({ $selected }) => ($selected ? `7.5rem` : 0)};
    height: 0.4rem;
    background-color: ${({ theme }) => theme.colors.headerPoint};
  `,
  SelectedTab: styled.div`
    color: ${({ theme }) => theme.colors.headerPoint};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15rem; // 변경됨
    height: 5rem; // 변경됨
    font-weight: bold;
    font-size: 2.5rem; // 변경됨
  `,
  MyPageBtnWrapper: styled.div`
    margin-right: 2.6rem;

    text-align: right;
  `,
  MyPageBtn: styled.button`
    padding: 0.7rem 2rem;
    border-radius: 3rem;
    line-height: 1.936rem;
    font-weight: 700;
    font-size: 1.6rem;
    ${({ $isMyPage, theme }) =>
      $isMyPage
        ? css`
            border: 0.15rem solid ${theme.colors.headerPoint};
            color: ${theme.colors.headerPoint};
          `
        : css`
            border: 0.1rem solid black;
            color: ${theme.colors.black};
          `}
  `,
};
