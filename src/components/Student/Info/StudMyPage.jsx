import React from "react";
import styled, { css } from "styled-components";
import useGetStudInfo from "../../../libs/hooks/useGetStudInfo";
import { removeCookie } from "../../_Common/cookie";
import { useNavigate } from "react-router";

const StudMyPage = ({ handleClickChangePW }) => {
  localStorage.clear();
  
  const navigate = useNavigate();
  const { data } = useGetStudInfo();
  if (!data) {
    return;
  }
  const { name, parentNum, phoneNum } = data;

  const STUD_INFO = [
    {
      id: 0,
      category: "이름",
      info: name,
    },
    {
      id: 1,
      category: "학생 ID",
      info: phoneNum,
    },
    {
      id: 2,
      category: "비밀번호",
      info: "비밀번호 변경",
    },
    {
      id: 3,
      category: "연락처",
      info: phoneNum && `${phoneNum.slice(0, 3)}-${phoneNum.slice(3, 7)}-${phoneNum.slice(7, 12)}`,
    },
    {
      id: 4,
      category: "학부모 연락처",
      info: parentNum && `${parentNum.slice(0, 3)}-${parentNum.slice(3, 7)}-${parentNum.slice(7, 12)}`,
    },
  ];

  const handleClickLogoutBtn = () => {
    removeCookie("aToken");
    navigate("/");
  };

  return (
    <St.Wrapper>
      <St.ContentsWrapper>
        {STUD_INFO.map((student) => (
          <St.Contents key={student.id}>
            <St.Category>{student.category}</St.Category>
            <St.Info
              $isBold={student.id === 1 || student.id === 2}
              $addBorder={student.id === 2}
              onClick={student.id === 2 ? handleClickChangePW : undefined}
            >
              {student.info}
            </St.Info>
          </St.Contents>
        ))}

        <St.LogoutBtn type="button" onClick={handleClickLogoutBtn}>
          로그아웃
        </St.LogoutBtn>
      </St.ContentsWrapper>
    </St.Wrapper>
  );
};

export default StudMyPage;

const St = {
  Wrapper: styled.section`
    min-height: calc(100vh - 10.8rem);
    margin: 1.9rem 15.5rem;
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

  LogoutBtn: styled.button`
    width: fit-content;

    padding: 1.4rem 3.2rem;
    margin-top: 1rem;

    border-radius: 0.5rem;

    background-color: ${({ theme }) => theme.colors.logoutBtn};

    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.81rem;
    letter-spacing: 0;
  `,
};
