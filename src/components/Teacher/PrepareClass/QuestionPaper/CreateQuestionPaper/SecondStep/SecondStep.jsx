import styled from "styled-components";
import PreviewQuestions from "./PreviewQuestions";
import React, { useEffect } from "react";

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
  activeMenu,
  selectedChapters,
}) => {
  useEffect(() => {
    setQuestionMenu("summary");
  }, []);
  return (
    <CQP.CreationContianer>
      <CQP.SecondStep_LeftSection>
        <CQP.CategoryLine>
          <CQP.CategoryBtn onClick={() => setQuestionMenu("summary")} $isSelected={questionMenu === "summary"}>
            학습지 요약
            <CQP.UnderBar $isSelected={questionMenu === "summary"} />
          </CQP.CategoryBtn>
          {activeMenu === "mock" || (
            <CQP.CategoryBtn onClick={() => setQuestionMenu("addNew")} $isSelected={questionMenu === "addNew"}>
              새 문제 추가
              <CQP.UnderBar $isSelected={questionMenu === "addNew"} />
            </CQP.CategoryBtn>
          )}
          {selectedChapters.length > 0 && (
            <CQP.ConceptBtn onClick={() => setQuestionMenu("addConcept")} $isSelected={questionMenu === "addConcept"}>
              개념 추가
              <CQP.UnderBar $isSelected={questionMenu === "addConcept"} />
            </CQP.ConceptBtn>
          )}
        </CQP.CategoryLine>
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

const CQP = {
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
  CategoryLine: styled.div`
    width: 60rem;
    height: 5rem;
    background-color: white;
    display: flex;
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
    margin-left: auto;
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
