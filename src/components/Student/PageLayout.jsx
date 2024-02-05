import React, { useState } from "react";
import StudentHeader from "./StudentHeader";
import styled from "styled-components";

export const NAV_LIST = ["학습 현황", "학습지", "1:1 질문지"];

const PageLayout = ({ children }) => {
  const [clickedList, setClickedList] = useState("학습 현황");

  const handleClickList = (value) => {
    setClickedList(value);
  };

  return (
    <St.Wrapper>
      <StudentHeader clickedList={clickedList} handleClickList={handleClickList} />
      {children}
    </St.Wrapper>
  );
};

export default PageLayout;

const St = {
  Wrapper: styled.div`
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
  `,
};
