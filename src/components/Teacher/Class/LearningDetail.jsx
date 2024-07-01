import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LearningDetail = () => {
  return <LD.Wrapper>학습 내역</LD.Wrapper>;
};

export default LearningDetail;

const LD = {
  Wrapper: styled.div`
    width: 113.5rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding-top: 1.5rem;
    background-color: skyblue;
  `,
};
