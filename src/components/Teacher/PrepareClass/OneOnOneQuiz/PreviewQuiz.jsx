import styled from "styled-components";
const PreviewQuiz = ({ closeModal, questionText }) => {
  return (
    <CTEAM.ModalOverlay>
      <CTEAM.Modal>
        <CTEAM.TitleLine>
          <CTEAM.Title>1:1 질문 상세보기</CTEAM.Title>
        </CTEAM.TitleLine>
        <CTEAM.ContentLine>
          <CTEAM.TextLabel>질문 전문</CTEAM.TextLabel>
        </CTEAM.ContentLine>
        <CTEAM.ContentLine>
          <CTEAM.TextBox>{questionText}</CTEAM.TextBox>
        </CTEAM.ContentLine>
        <CTEAM.BtnLine>
          <CTEAM.CloseBtn onClick={closeModal}>닫기</CTEAM.CloseBtn>
        </CTEAM.BtnLine>
      </CTEAM.Modal>
    </CTEAM.ModalOverlay>
  );
};

export default PreviewQuiz;

const CTEAM = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 69rem;
    min-height: 20rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    height: 7rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
  `,
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ContentLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  ContentBox: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,
  TextLabel: styled.div`
    height: 4rem;
    width: 10rem;

    font-size: 1.75rem;
    font-weight: 700;
    margin-left: 3rem;
    display: flex;
    align-items: center;
  `,
  TextBox: styled.div`
    width: 62.9rem;
    min-height: 5rem;
    border-radius: 0.6rem;
    margin-left: 3rem;
    padding-inline: 1.5rem;
    padding-block: 1rem;

    font-size: 1.75rem;
    font-weight: 500;
    line-height: 2.5rem;
    border: 0.2rem solid ${({ $isEmpty, theme }) => ($isEmpty ? theme.colors.warning : theme.colors.unselected)};
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    margin-top: 2rem;
    padding-inline: 3rem;
    padding-block: 1.5rem;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;

    font-size: 1.75rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
};
