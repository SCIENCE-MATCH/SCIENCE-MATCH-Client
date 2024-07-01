import React from "react";
import styled, { css } from "styled-components";
import useGetStudInfo from "../../../libs/hooks/Student/useGetStudInfo";
import { removeCookie } from "../../../libs/cookie";
import { useNavigate } from "react-router";

const StudMyPage = ({ handleClickChangePW }) => {
  localStorage.clear();

  const navigate = useNavigate();
  const handleClickLogoutBtn = () => {
    removeCookie("aToken");
    navigate("/");
  };

  const { data } = useGetStudInfo();
  if (!data) {
    return (
      <St.Wrapper>
        <St.ContentsWrapper>
          <St.Contents>
            <St.Category>정보를 불러올 수 없습니다.</St.Category>
          </St.Contents>

          <St.LogoutBtn type="button" onClick={handleClickLogoutBtn}>
            로그아웃
          </St.LogoutBtn>
        </St.ContentsWrapper>
      </St.Wrapper>
    );
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
    //width: 135rem;
    min-height: calc(70vh - 10.8rem);
    border-radius: 1rem;
    margin: 1.9rem 15.5rem;
    padding: 7.5rem 0 0 11.3rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  ContentsWrapper: styled.article`
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin-right: 40rem;
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
        margin: -0.7rem 0 -0.7rem;
        padding: 0.7rem;
        text-align: center;
        width: 14rem;
        height: 4rem;
        border-radius: 0.5rem;
        background-color: ${theme.colors.gray05};
        border: 0.01rem solid ${theme.colors.gray15};
        font-size: 1.5rem;
        font-weight: normal;
        cursor: pointer;
        &:hover {
          background-color: ${theme.colors.lightMain};
          border: 0.01rem solid ${theme.colors.mainColor};
          color: ${theme.colors.main80};
        }
      `};

    font-weight: ${({ $isBold }) => ($isBold ? 600 : 500)};
    font-size: 1.6rem;
    line-height: 1.936rem;
  `,

  LogoutBtn: styled.button`
    margin-top: 1rem;

    width: 12rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.01rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 1.5rem;
    font-weight: normal;
    &:hover {
      background-color: ${({ theme }) => theme.colors.lightMain};
      border: 0.01rem solid ${({ theme }) => theme.colors.mainColor};
      color: ${({ theme }) => theme.colors.main80};
    }
  `,
};
