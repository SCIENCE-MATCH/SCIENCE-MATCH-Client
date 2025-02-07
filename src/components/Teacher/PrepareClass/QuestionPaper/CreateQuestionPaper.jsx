import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import SecondStep from "./CreateQuestionPaper/SecondStep/SecondStep";
import SelectQuestionScope from "./CreateQuestionPaper/FirstStep/SelectQeustionScope";
import DetailOfNormal from "./CreateQuestionPaper/FirstStep/DetailOfNormal";
import SelectBook from "./CreateQuestionPaper/FirstStep/SelectBook";
import DetailOfBook from "./CreateQuestionPaper/FirstStep/DetailOfBook";
import AddMoreQuestions from "./CreateQuestionPaper/SecondStep/AddMoreQuestions";
import AddConcept from "./CreateQuestionPaper/SecondStep/AddConcept";
import SelectQuestions from "./CreateQuestionPaper/SecondStep/SelectQeustions";
import ThirdStep from "./CreateQuestionPaper/ThirdStep/ThirdStep";

import usePostGetQuestions from "../../../../libs/apis/Teacher/Prepare/postGetQuestions";
import usePostGetConcepts from "../../../../libs/apis/Teacher/Prepare/postGetConcepts";
import SelectMock from "./CreateQuestionPaper/FirstStep/SelectMock";
import DetailOfMock from "./CreateQuestionPaper/FirstStep/DetailOfMock";
import usePostGetQuesByNum from "../../../../libs/apis/Teacher/Prepare/Mock/postGetQuesByNum";

const CreateQuestionPaper = ({ closeModal }) => {
  const { questionData, getQuestions } = usePostGetQuestions(); //챕터로 문제 조회
  const { conceptData, getConcepts } = usePostGetConcepts(); //개념(이미지) 조회
  const { questionsByNum, getQuesByNum } = usePostGetQuesByNum(); //모의고사 번호로 문제 조회

  const [createStep, setCreateStep] = useState(1);
  const [simpleChapter, setSimpleChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [preventNext, setPreventNextLevel] = useState(true);
  const [isOnlyConcept, setIsOnlyConcept] = useState(false);

  const [mockList, setMockList] = useState([]); //모의고사 배열
  const [mockChapters, setMockChapters] = useState([]); //단원으로 모의고사 선택시 필요한 배열

  //Step3 변수들
  const [title, setTitle] = useState("");
  const [makerName, setMakerName] = useState("");
  const [paperGrade, setPaperGrade] = useState("초3-1");

  //챕터 받아오기
  const [school, setSchool] = useState("초");
  const [grade, setGrade] = useState("3");
  const [semester, setSemester] = useState("1");

  const manageCanGoNext = () => {
    setPreventNextLevel(true);
    switch (createStep) {
      case 1:
        if (mockList.some((mock) => mock.selected)) setPreventNextLevel(false);
        else if (selectedChapters.length === 0) setPreventNextLevel(true);
        else setPreventNextLevel(false);
        break;
      case 2:
        if (selectedQuestions.length === 0) setPreventNextLevel(true);
        break;
      case 3:
        if ("") setPreventNextLevel(false);
        break;
    }
  };

  const [activeMenu, setActiveMenu] = useState("normal");
  const [questionMenu, setQuestionMenu] = useState("summary");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [selectedConceptIds, setSelectedConceptIds] = useState([]);
  const [questionTag, setQuestionTag] = useState("NORMAL");

  const handleGetQuestionByChapter = async () => {
    const sortedChapters = selectedChapters.sort((a, b) => (a.id > b.id ? 1 : -1));
    setSelectedChapters(sortedChapters);

    await getQuestions(sortedChapters, quesNum, paperDifficulty, quesTypes, mockIncluded === "모의고사 포함");
  };

  useEffect(() => {
    const sortedQuestions = questionData.sort((a, b) => a.chapterId - b.chapterId);
    setSelectedQuestions(sortedQuestions);
  }, [questionData]);

  const handleGetQuestionOfMock = async (mock, score) => {
    setPaperGrade("고1");
    await getQuesByNum(mock, score);
  };
  useEffect(() => {
    if (questionsByNum.length > 0) {
      setSelectedQuestions(questionsByNum);
    }
  }, [questionsByNum]);

  const [quesNum, setQuesNum] = useState(25);
  const [paperDifficulty, setPaperDifficulty] = useState("중");
  const [quesTypes, setQuesTypes] = useState(["MULTIPLE", "SUBJECTIVE", "DESCRIPTIVE"]);
  const [mockIncluded, setMockIncluded] = useState("모의고사 포함");

  const createPaperSequence = () => {
    switch (createStep) {
      case 1:
        return "학습지 종류 및 범위 선택";
      case 2:
        return "학습지 상세 편집";
      case 3:
        return "학습지 설정";
    }
  };

  useEffect(() => {
    if (selectedQuestions.length > 0) {
      if (selectedQuestions[0].page) {
        const includedPages = selectedQuestions.map((ques) => ques.page);
        includedPages.sort((a, b) => b - a); // 내림차순 정렬
        setTitle(`${selectedBook.title}_${includedPages[includedPages.length - 1]}p~${includedPages[0]}p`);
      }
    }
  }, [selectedQuestions]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [localBookChapters, setLocalBookChapters] = useState([]);
  const [addBlank, setAddBlank] = useState(false);
  const TypeAndScope = () => {
    switch (activeMenu) {
      case "normal":
        return (
          <CQP.ScopeContainer>
            <SelectQuestionScope
              setSchool={setSchool}
              setSemester={setSemester}
              setGrade={setGrade}
              simpleChapter={simpleChapter}
              setSimpleChapters={setSimpleChapters}
              setSelectedChapters={setSelectedChapters}
            />
          </CQP.ScopeContainer>
        );
      case "textbook":
        return (
          <CQP.ScopeContainer>
            <SelectBook
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              localBookChapters={localBookChapters}
              setLocalBookChapters={setLocalBookChapters}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              setSelectedChapters={setSelectedChapters}
              setPaperGrade={setPaperGrade}
            />
          </CQP.ScopeContainer>
        );
      case "mock":
        return (
          <CQP.ScopeContainer>
            <SelectMock
              mockList={mockList}
              setMockList={setMockList}
              mockChapters={mockChapters}
              setMockChapters={setMockChapters}
            />
          </CQP.ScopeContainer>
        );
      default:
        return <CQP.ScopeContainer>기본 컨텐츠...</CQP.ScopeContainer>;
    }
  };

  const onOnlyConceptClick = async () => {
    setSelectedConceptIds([]);
    const selectedConcepts = [];
    const groupedConcepts = [];

    const traverseChapters = (chapters) => {
      const result = [];

      chapters.forEach((chapter) => {
        if (chapter.children.length > 0) {
          const selectedChildren = traverseChapters(chapter.children);

          if (selectedChildren.length > 0) {
            groupedConcepts.push({
              ...chapter,
              expansion: false,
              children: selectedChildren,
            });
          }
        } else if (chapter.selected) {
          result.push({ ...chapter, expansion: false, selected: false });
          selectedConcepts.push({ ...chapter, expansion: false, selected: false });
        }
      });
      return result;
    };
    traverseChapters(simpleChapter);
    const selectedConceptIds = selectedConcepts.map((concept) => concept.id);

    await getConcepts(selectedConceptIds);
  };
  useEffect(() => {
    setSelectedConcepts(conceptData);
  }, [conceptData]);

  const DetailOfScope = () => {
    switch (activeMenu) {
      case "normal":
        return (
          <DetailOfNormal
            quesNum={quesNum}
            setQuesNum={setQuesNum}
            quesTypes={quesTypes}
            setQuesTypes={setQuesTypes}
            mockIncluded={mockIncluded}
            setMockIncluded={setMockIncluded}
            paperDifficulty={paperDifficulty}
            setPaperDifficulty={setPaperDifficulty}
            selectedChapters={selectedChapters}
            setCreateStep={setCreateStep}
            preventNext={preventNext}
            getQuestions={handleGetQuestionByChapter}
            setIsOnlyConcept={setIsOnlyConcept}
            onOnlyConceptClick={onOnlyConceptClick}
          />
        );
      case "textbook":
        return (
          <DetailOfBook
            selectedQuestions={selectedQuestions}
            selectedChapters={selectedChapters}
            setCreateStep={setCreateStep}
            preventNext={preventNext}
            setSimpleChapters={setSimpleChapters}
          />
        );
      case "mock":
        return (
          <DetailOfMock
            selectedQuestions={selectedQuestions}
            setCreateStep={setCreateStep}
            preventNext={preventNext}
            setSimpleChapters={setSimpleChapters}
            mockList={mockList}
            mockChapters={mockChapters}
            handleGetQuestionOfMock={handleGetQuestionOfMock}
          />
        );
      default:
        return <React.Fragment>기본 컨텐츠...</React.Fragment>;
    }
  };
  const [numberOfQuestions, setNumberOfQues] = useState({ 하: 0, 중하: 0, 중: 0, 중상: 0, 상: 0 });
  const QuestionSetModification = () => {
    switch (questionMenu) {
      case "summary":
        return (
          <SelectQuestions
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            setSortOption={setSortOption}
            numberOfQuestions={numberOfQuestions}
            setNumberOfQues={setNumberOfQues}
          />
        );
      case "addNew":
        return (
          <AddMoreQuestions
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            selectedChapters={selectedChapters}
            paperDifficulty={paperDifficulty}
            quesTypes={quesTypes}
            mockIncluded={mockIncluded}
            setSortOption={setSortOption}
            setQuestionTag={setQuestionTag}
          />
        );
      case "addConcept":
        return (
          <AddConcept
            selectedChapters={selectedChapters}
            simpleChapter={simpleChapter}
            setSelectedConcepts={setSelectedConcepts}
            selectedConceptIds={selectedConceptIds}
            setSelectedConceptIds={setSelectedConceptIds}
            addBlank={addBlank}
            setAddBlank={setAddBlank}
          />
        );
      default:
        return <div>오류입니다.</div>;
    }
  };

  const RenderSteps = () => {
    switch (createStep) {
      case 1:
        return (
          <CQP.CreationContianer>
            <CQP.CategorySection>
              <CQP.CategoryBtn onClick={() => setActiveMenu("normal")} $isSelected={activeMenu == "normal"}>
                단원·유형별
                <CQP.UnderBar $isSelected={activeMenu == "normal"} />
              </CQP.CategoryBtn>
              <CQP.CategoryBtn onClick={() => setActiveMenu("textbook")} $isSelected={activeMenu == "textbook"}>
                시중교재
                <CQP.UnderBar $isSelected={activeMenu == "textbook"} />
              </CQP.CategoryBtn>
              <CQP.CategoryBtn onClick={() => setActiveMenu("mock")} $isSelected={activeMenu == "mock"}>
                수능/모의고사
                <CQP.UnderBar $isSelected={activeMenu == "mock"} />
              </CQP.CategoryBtn>
              {TypeAndScope()}
            </CQP.CategorySection>
            {DetailOfScope()}
          </CQP.CreationContianer>
        );
      case 2:
        return (
          <SecondStep
            questionMenu={questionMenu}
            setQuestionMenu={setQuestionMenu}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            setCreateStep={setCreateStep}
            sortOption={sortOption}
            setSortOption={setSortOption}
            QuestionSetModification={QuestionSetModification}
            numberOfQuestions={numberOfQuestions}
            activeMenu={activeMenu}
            selectedChapters={selectedChapters}
          />
        );
      case 3:
        return (
          <ThirdStep
            closeModal={closeModal}
            selectedQuestions={selectedQuestions}
            selectedConcepts={selectedConcepts}
            title={title}
            setTitle={setTitle}
            makerName={makerName}
            setMakerName={setMakerName}
            paperGrade={paperGrade}
            setPaperGrade={setPaperGrade}
            setCreateStep={setCreateStep}
            school={school}
            grade={grade}
            semester={semester}
            category={quesTypes}
            questionTag={questionTag}
            level={paperDifficulty}
            sortOption={sortOption}
            addBlank={addBlank}
            setAddBlank={setAddBlank}
            isOnlyConcept={isOnlyConcept}
          />
        );
    }
  };

  useEffect(() => {
    setTitle("");
    switch (activeMenu) {
      case "normal":
        setQuestionTag("NORMAL");
        break;
      case "textbook":
        setQuestionTag("TEXT_BOOK");
        break;
      case "mock":
        setQuestionTag("MOCK_EXAM");
        break;
      default:
        setQuestionTag("NORMAL");
    }
  }, [activeMenu]);
  useEffect(() => {
    setSelectedBook(null);
    setSelectedQuestions([]);
    setSelectedChapters([]);
  }, [activeMenu]);

  useEffect(() => {
    manageCanGoNext();
  }, [selectedChapters, mockList]);
  useEffect(() => {
    const getKoreanGrade = (school, grade, semester) => {
      if (isNaN(grade)) {
        return `${grade.slice[(0, 1)]}${semester}`;
      } else {
        return `${school} ${grade}-${semester}`;
      }
    };
    setPaperGrade(getKoreanGrade(school, grade, semester));
  }, [school, grade, semester]);
  return (
    <CQP.Modal_Overlay>
      <CQP.Modal>
        <CQP.NavigationBar>
          <CQP.StepBox>STEP {createStep}</CQP.StepBox>
          <CQP.StepDescipt>{createPaperSequence()}</CQP.StepDescipt>
          <CQP.StepSpotBox>
            <CQP.StepSpot $isOnStep={createStep == 1}>① 범위 선택</CQP.StepSpot>
            <CQP.StepSpot $isOnStep={createStep == 2}>② 상세 편집</CQP.StepSpot>
            <CQP.StepSpot $isOnStep={createStep == 3}>③ 구성 설정</CQP.StepSpot>
          </CQP.StepSpotBox>
          <CQP.Closebutton onClick={closeModal}>
            <FontAwesomeIcon icon={faXmark} /> 닫기
          </CQP.Closebutton>
        </CQP.NavigationBar>
        {RenderSteps()}
      </CQP.Modal>
    </CQP.Modal_Overlay>
  );
};

export default CreateQuestionPaper;

const modalWidth = 135;
const CQP = {
  Modal_Overlay: styled.div`
    z-index: 10; /* Ensure the dropdown is above other elements */
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
    background: ${({ theme }) => theme.colors.brightGray};
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
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
    //border: 0.1rem black solid;
    position: relative;
    color: ${({ $isSelected, theme }) => ($isSelected ? "black" : theme.colors.unselected)};
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
