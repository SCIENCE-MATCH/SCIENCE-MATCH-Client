import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ReportPage = () => {
  return (
    <LD.Wrapper>
      <LD.ManageSection>보고서</LD.ManageSection>
    </LD.Wrapper>
  );
};

export default ReportPage;

const LD = {
  Wrapper: styled.div`
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 113.5rem; /*standard: 1400*/
    height: 80rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  ManageSection: styled.div`
    width: 135rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    padding-top: 1.5rem;
    overflow: hidden;
  `,
};
