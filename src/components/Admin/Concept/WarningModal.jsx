import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const WarningModal = ({ deleteFunc, closeModal, warningText }) => {
  return (
    <CONFIRMMODAL.ModalOverlay>
      <CONFIRMMODAL.Modal>
        <CONFIRMMODAL.TitleLine>
          <CONFIRMMODAL.Title>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
            주의
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginLeft: `1rem`, color: `white` }} />
          </CONFIRMMODAL.Title>
        </CONFIRMMODAL.TitleLine>
        <CONFIRMMODAL.ContentLine>{warningText}</CONFIRMMODAL.ContentLine>
        <CONFIRMMODAL.ContentLine>연결된 모든 데이터가 망가질 수 있습니다.</CONFIRMMODAL.ContentLine>
        <CONFIRMMODAL.WarningLine>삭제시 되돌릴 수 없습니다.</CONFIRMMODAL.WarningLine>
        <CONFIRMMODAL.BtnLine>
          <CONFIRMMODAL.CloseBtn
            onClick={() => {
              closeModal();
            }}
          >
            닫기
          </CONFIRMMODAL.CloseBtn>
          <CONFIRMMODAL.WrognBtn
            onClick={() => {
              deleteFunc();
              closeModal();
            }}
          >
            삭제하기
          </CONFIRMMODAL.WrognBtn>
        </CONFIRMMODAL.BtnLine>
      </CONFIRMMODAL.Modal>
    </CONFIRMMODAL.ModalOverlay>
  );
};

export default WarningModal;

const CONFIRMMODAL = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    z-index: 10;
    align-items: center;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 70rem;
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
    justify-content: center;
    margin-bottom: 1rem;
  `,
  Title: styled.div`
    font-size: 3rem;
    font-weight: 700;
    margin-top: 2rem;
    color: ${({ theme }) => theme.colors.warning};
  `,
  ContentLine: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-inline: 3rem;
    font-size: 2rem;
    font-weight: 600;
    line-height: 3rem;
  `,
  WarningLine: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-inline: 3rem;
    font-size: 2rem;
    font-weight: 600;
    line-height: 3rem;
    color: ${({ theme }) => theme.colors.warning};
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    padding-inline: 3rem;
    padding-block: 1.5rem;
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    margin-left: auto;
  `,
  WrognBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
    margin-left: 6rem;
    margin-right: auto;
  `,
};
