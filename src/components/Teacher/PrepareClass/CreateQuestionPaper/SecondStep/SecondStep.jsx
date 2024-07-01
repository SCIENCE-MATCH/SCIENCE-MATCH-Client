import styled from "styled-components";
import PreviewQuestions from "./PreviewQuestions";

const SecondStep = ({
  questionMenu,
  setQuestionMenu,
  selectedQuestions,
  setSelectedQuestions,
  setCreateStep,
  sortOption,
  setSortOption,
  QuestionSetModification,
  numberOfQuestions,
}) => {
  return (
    <CQP.CreationContianer>
      <CQP.SecondStep_LeftSection>
        <CQP.CategoryBtn onClick={() => setQuestionMenu("summary")} $isSelected={questionMenu === "summary"}>
          학습지 요약
          <CQP.UnderBar $isSelected={questionMenu === "summary"} />
        </CQP.CategoryBtn>
        <CQP.CategoryBtn onClick={() => setQuestionMenu("addNew")} $isSelected={questionMenu === "addNew"}>
          새 문제 추가
          <CQP.UnderBar $isSelected={questionMenu === "addNew"} />
        </CQP.CategoryBtn>
        <CQP.CategoryBtn onClick={() => setQuestionMenu("twinQues")} $isSelected={questionMenu === "twinQues"}>
          쌍둥이·유사문제
          <CQP.UnderBar $isSelected={questionMenu === "twinQues"} />
        </CQP.CategoryBtn>
        <CQP.ConceptBtn onClick={() => setQuestionMenu("addConcept")} $isSelected={questionMenu === "addConcept"}>
          개념 추가
          <CQP.UnderBar $isSelected={questionMenu === "addConcept"} />
        </CQP.ConceptBtn>
        <CQP.TopLine />
        {QuestionSetModification()}
      </CQP.SecondStep_LeftSection>
      <PreviewQuestions
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
        setCreateStep={setCreateStep}
        sortOption={sortOption}
        setSortOption={setSortOption}
        numberOfQuestions={numberOfQuestions}
      />
    </CQP.CreationContianer>
  );
};

export default SecondStep;

const modalWidth = 135;
const CQP = {
  Modal_Overlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
  `,
  Modal: styled.div`
    background: ${({ theme }) => theme.colors.brightGray};
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    margin-top: 7rem;
    width: ${modalWidth}rem;
    height: 81.5rem;
  `,
  NavigationBar: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${modalWidth}rem;
    height: 5rem;
  `,
  StepBox: styled.div`
    color: black;
    width: 7rem;
    height: 5rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 2rem;
    align-content: center; /* 수직 중앙 정렬 */
    color: ${({ theme }) => theme.colors.stepLabel};
  `,
  StepDescipt: styled.div`
    height: 5rem;
    font-size: 1.8rem;
    font-weight: bold;
    align-content: center; /* 수직 중앙 정렬 */
  `,
  StepSpotBox: styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
  `,
  StepSpot: styled.div`
    font-size: ${({ $isOnStep }) => ($isOnStep ? "1.6rem" : "1.4rem")};
    color: ${({ $isOnStep, theme }) => ($isOnStep ? "black" : theme.colors.unselected)};
    margin-left: 0.75rem;
    font-weight: bold;
  `,
  Closebutton: styled.button`
    width: 8rem;
    height: 4rem;
    border-radius: 0.5rem;
    font-size: 1.8rem;
    font-weight: bold;
    margin-left: 3rem;
    margin-right: 1rem;
    border: 0.1rem ${({ theme }) => theme.colors.unselected} solid;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.unselected};
    &:hover {
      color: ${({ theme }) => theme.colors.deepDark};
    }
  `,
  /**내비게이션 바 끝 */
  CreationContianer: styled.div`
    padding: 1.5rem;
    padding-top: 1rem;
    display: flex;
    flex-direction: row;
  `,
  CategorySection: styled.div`
    background-color: white;
    width: 90rem;
    height: 74rem;
    margin-right: 2rem;
    border-radius: 1rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    overflow: hidden;
  `,
  CategoryBtn: styled.button`
    width: 13rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    position: relative;
    color: ${({ $isSelected, theme }) => ($isSelected ? "black" : theme.colors.unselected)};
  `,
  ConceptBtn: styled.button`
    width: 10rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    position: relative;
    color: ${({ $isSelected, theme }) => ($isSelected ? "black" : theme.colors.unselected)};
    margin-left: 11rem;
  `,
  UnderBar: styled.div`
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $isSelected }) => ($isSelected ? "9rem" : "0rem")};
    height: 0.25rem;
    background-color: black;
  `,
  TopLine: styled.div`
    position: absolute;
    top: 5rem;
    width: 100%;
    height: 0.05rem;
    background-color: ${({ theme }) => theme.colors.background};
  `,
  /**챕터 선택 영역 */
  ScopeContainer: styled.div`
    width: 90rem;
    height: 71rem;
  `,
  SecondStep_LeftSection: styled.div`
    //background-color: white;
    width: 60rem;
    height: 74rem;
    margin-right: 2rem;
    position: relative;
    border-radius: 1rem;

    overflow: hidden;
  `,
};
