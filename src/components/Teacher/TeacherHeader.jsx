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
          {tabs[activeTab].map((subTab, i) => (
            <Te.TabBox
              key={`subtab_${i}`}
              id={subTab}
              onClick={() => {
                setSubTab(subTab);
              }}
              $isSelected={activeSubTab === subTab}
            >
              {subTab}
              <Te.UnderBar $selected={activeSubTab === subTab} />
            </Te.TabBox>
          ))}
        </Te.NavBar>
      </Te.SubHeader>
    );
  };

  return (
    <Te.HeaderWrapper $onMyPage={activeTab === "MyPage"}>
      <Te.MainHeader $isOnlyHeader={activeTab === "MyPage"}>
        <Te.Title>
          Science
          <Te.ColoredTitle>Match</Te.ColoredTitle>
        </Te.Title>
        <Te.NavBar>
          {Object.keys(tabs).map((tab, i) => (
            <Te.TabBox
              key={`tab_${i}`}
              id={tab}
              onClick={() => {
                setTab(tab);
                setSubTab(tabs[tab][0]);
              }}
              $isSelected={activeTab === tab}
            >
              {tab}
              <Te.UnderBar $selected={activeTab === tab} />
            </Te.TabBox>
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
    min-width: 135rem;
    height: ${({ $onMyPage }) => ($onMyPage ? "4.9rem" : "10rem")};
    background-color: ${({ theme }) => theme.colors.headerBg};
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  MainHeader: styled.header`
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.headerBg};
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    display: grid;
    align-items: center;
    ${({ $isOnlyHeader, theme }) =>
      $isOnlyHeader
        ? css`
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
          `
        : css`
            border-bottom: 0.2rem solid ${theme.colors.gray20};
          `}
  `,
  SubHeader: styled.header`
    height: 5rem; // 헤더 높이 설정
    background-color: ${({ theme }) => theme.colors.subHeaderBg}; // theme에서 SubHeader 배경색 설정 필요
    width: 100%; // 부모의 전체 너비를 차지하도록 설정
    display: flex;
    align-items: center;
    justify-content: center; // 내용을 중앙 정렬
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
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
    flex-direction: row;
    align-items: center;
    justify-content: center;

    gap: 6rem;
  `,
  TabBox: styled.div`
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.headerLi)};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15rem;
    height: 5rem;
    font-weight: bold;
    font-size: 2rem;
    position: relative;
    cursor: pointer;
  `,
  UnderBar: styled.div`
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $selected }) => ($selected ? `7.5rem` : 0)};
    height: 0.4rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
  `,
  SelectedTab: styled.div`
    color: ${({ theme }) => theme.colors.mainColor};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15rem;
    height: 5rem;
    font-weight: bold;
    font-size: 2.5rem;
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
