import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
const DetailOfBook = ({ selectedQuestions, selectedChapters, setCreateStep, preventNext, setSimpleChapters }) => {
  //=====================================
  //문제 개수 설정

  return (
    <CQP.QuestionSettings>
      <CQP.LabelContainer>
        <CQP.SettingLabel
          onClick={() => {
            console.log(selectedQuestions);
          }}
        >
          학습지 구성
        </CQP.SettingLabel>
      </CQP.LabelContainer>

      <QT.SummaryBox>
        학습지 문제 수 <QT.QuesNumber>{selectedQuestions.length}</QT.QuesNumber> 개 | 개념 {selectedChapters.length}개
      </QT.SummaryBox>
      <QT.NextStepBtn
        onClick={() => {
          setSimpleChapters([]);
          setCreateStep((prev) => prev + 1);
        }}
        disabled={preventNext}
        $available={!preventNext}
      >
        {`다음 단계 `}
        <FontAwesomeIcon icon={faArrowRight} />
      </QT.NextStepBtn>
    </CQP.QuestionSettings>
  );
};

export default DetailOfBook;

const CQP = {
  QuestionSettings: styled.div`
    background-color: ${({ theme }) => theme.colors.headerBg};
    width: 45rem;
    height: 74rem;
    border-radius: 1rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    overflow: hidden;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  LabelContainer: styled.div`
    width: 100%;
    height: 5rem;
    justify-content: left;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  SettingLabel: styled.div`
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.6rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gray};
  `,
  AdditoinalDescription: styled.a`
    font-size: 1.4rem;
    font-weight: normal;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  NumLabelContainer: styled.div`
    width: 100%;
    height: 4rem;
    padding: 0 0.5rem 0 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  NumberLabel: styled.div`
    width: 4rem;
    height: 4rem;
    align-content: center;
    text-align: center;
    font-size: 1.6rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  SettingLine: styled.div`
    padding: 0 1rem 0 1rem;
    height: 5rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 3rem;
  `,
  BtnContainer: styled.div`
    padding: 0 1rem 0 0;
    height: 5rem;
    width: 27.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
  `,
  DetailBtn: styled.button`
    flex: 1;
    height: 4rem;
    border-radius: 0.4rem;
    margin: 0 0.5rem 0 0.5rem;
    border: 1px solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    font-size: 1.5rem;
    font-weight: bold;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
  `,
  InputNumber: styled.input`
    width: 6rem;
    height: 3.75rem;
    margin: 0 0.5rem 0 1.5rem;
    border-radius: 0.4rem;
    border: 1px solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};

    font-size: 1.4rem;
    text-align: center;
  `,
};
const QT = {
  GrayBox: styled.div`
    padding: 2rem 0 0 0;
    width: 41rem;
    height: 12rem;
    border-radius: 1.5rem;
    margin-bottom: 2rem;
    background-color: ${({ theme }) => theme.colors.brightGray};
  `,
  AutoGrading: styled.div`
    width: 10rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ $isAuto, theme }) => ($isAuto ? theme.colors.gray : theme.colors.unselected)};
  `,
  SummaryBox: styled.div`
    width: 45rem;
    height: 8rem;
    background-color: ${({ theme }) => theme.colors.brightGray};
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.deepDark};
    text-align: center;
    align-content: center;
    margin-top: auto;
  `,
  QuesNumber: styled.a`
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.mainColor};
    cursor: default;
  `,
  NextStepBtn: styled.button`
    width: 15rem;
    height: 5rem;
    border-radius: 1rem;
    margin-top: 2rem;
    margin-left: 24rem;
    font-size: 1.75rem;
    font-weight: bold;
    color: white;
    background-color: ${({ $available, theme }) => ($available ? theme.colors.mainColor : theme.colors.unselected)};
  `,
};
