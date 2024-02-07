import styled, { css } from "styled-components";

const PageLayout = ({ handleClickedCloseBtn, isCompleted, children }) => {
  const handleClickSubmitBtn = () => {
    // 여기 post 함수 추가 예정
    handleClickedCloseBtn();
  };
  return (
    <St.Wrapper>
      <St.ContentsWrapper>{children}</St.ContentsWrapper>

      <St.BtnWrapper>
        <St.CloseBtn type="button" onClick={handleClickedCloseBtn}>
          닫기
        </St.CloseBtn>
        {!isCompleted && (
          <St.SubmitBtn type="submit" onClick={handleClickSubmitBtn}>
            제출
          </St.SubmitBtn>
        )}
      </St.BtnWrapper>
    </St.Wrapper>
  );
};

export default PageLayout;

const btnStyle = css`
  padding: 0.5rem 3.7rem;

  border-radius: 1rem;

  color: ${({ theme }) => theme.colors.headerBg};
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 2.9rem;
`;

const St = {
  Wrapper: styled.article`
    display: flex;
    flex-direction: column;

    padding: 2.1rem 1.5rem;

    min-height: calc(100vh - 10.8rem);

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  ContentsWrapper: styled.article`
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    margin: 0 0 3.5rem 0.9rem;
  `,

  BtnWrapper: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;

    width: 100%;
  `,

  CloseBtn: styled.button`
    ${btnStyle}

    background-color: ${({ theme }) => theme.colors.warning};
  `,

  SubmitBtn: styled.button`
    ${btnStyle}

    background-color: ${({ theme }) => theme.colors.mainColor};
  `,
};
