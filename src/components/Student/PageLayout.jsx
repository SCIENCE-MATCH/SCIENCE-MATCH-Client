import React from "react";
import StudentHeader from "./StudentHeader";
import styled from "styled-components";

const PageLayout = ({ children }) => {
  return (
    <St.Wrapper>
      <StudentHeader />
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
