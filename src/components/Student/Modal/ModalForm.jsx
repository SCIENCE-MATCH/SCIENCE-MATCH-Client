import React from "react";
import styled, { css } from "styled-components";

const ModalForm = ({ setModalOn }) => {
  return (
    <St.Wrapper>
      <St.ContentsWrapper>
        <St.Title>비밀번호 변경</St.Title>

        <St.FormWrapper>
          <St.Form>
            <St.Label htmlFor="currentPw">현재 비밀번호</St.Label>
            <St.Input id="currentPw" type="password" placeholder="현재 비밀번호를 입력해주세요" />
          </St.Form>

          <St.Form>
            <St.Label htmlFor="newPw">새로운 비밀번호</St.Label>
            <St.Input id="newPw" type="password" placeholder="새로운 비밀번호를 입력해주세요" />
          </St.Form>

          <St.Form>
            <St.Label htmlFor="checkPw">비밀번호 확인</St.Label>
            <St.Input id="checkPw" type="password" placeholder="다시 한 번 입력해주세요" />
          </St.Form>
        </St.FormWrapper>

        <St.Warning>
          <St.WarningText>6자 이상 길이로 만들어주세요.</St.WarningText>
          <St.WarningText>영문 대/소문자, 숫자, 특수 문자 중 2가지를 조합해주세요.</St.WarningText>
        </St.Warning>

        <St.BtnWrapper>
          <St.Button type="button" onClick={() => setModalOn(false)} $isCancleBtn={true}>
            취소
          </St.Button>
          <St.Button type="button" $isCancleBtn={false}>
            저장하기
          </St.Button>
        </St.BtnWrapper>
      </St.ContentsWrapper>
    </St.Wrapper>
  );
};

export default ModalForm;

const St = {
  Wrapper: styled.section`
    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    left: 0;
    top: 0;

    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  `,

  ContentsWrapper: styled.article`
    display: flex;
    align-items: center;
    flex-direction: column;

    padding: 5.5rem 4rem;

    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  Title: styled.p`
    font-weight: 600;
    font-size: 2rem;
    line-height: 1.936rem;
  `,

  FormWrapper: styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    margin: 3rem 0;

    gap: 2rem;
  `,

  Form: styled.div`
    display: grid;
    grid-template-columns: 1.5fr 3.5fr;
    justify-content: space-between;
    align-items: center;
  `,

  Label: styled.label`
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.936rem;
  `,

  Input: styled.input`
    padding: 0.75rem;

    border: 0.15rem solid ${({ theme }) => theme.colors.headerLi};
    border-radius: 0.3rem;

    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1.936rem;
  `,

  Warning: styled.article`
    width: 100%;
    padding: 2.5rem 3rem;

    border-radius: 0.5rem;

    background-color: ${({ theme }) => theme.colors.brightGray};
  `,

  WarningText: styled.p`
    color: ${({ theme }) => theme.colors.headerLi};
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1.936rem;
  `,

  BtnWrapper: styled.div`
    display: flex;

    margin-top: 3rem;

    gap: 1rem;
  `,

  Button: styled.button`
    width: 8.5rem;
    padding: 1rem 0;

    border-radius: 0.5rem;

    ${({ $isCancleBtn, theme }) =>
      $isCancleBtn
        ? css`
            background-color: ${theme.colors.background};
            color: ${theme.colors.headerLi};
          `
        : css`
            background-color: ${theme.colors.mainColor};
            color: ${theme.colors.headerBg};
          `};

    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.936rem;
  `,
};
