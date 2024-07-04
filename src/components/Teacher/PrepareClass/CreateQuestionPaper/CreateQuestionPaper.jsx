import { useState, useEffect } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import SecondStep from "./SecondStep/SecondStep";
import ThirdStep from "./ThirdStep/ThirdStep";
import SelectQuestionScope from "./FirstStep/SelectQeustionScope";
import SelectQuestions from "./SecondStep/SelectQeustions";
import DetailOfNormal from "./FirstStep/DetailOfNormal";
import SelectCategory from "./FirstStep/SelectCategory";
import AddConcept from "./SecondStep/AddConcept";
import SelectBook from "./FirstStep/SelectBook";
import DetailOfBook from "./FirstStep/DetailOfBook";

import usePostGetQuestions from "../../../../libs/apis/Teacher/Prepare/postGetQuestions";
import AddMoreQuestions from "./SecondStep/AddMoreQuestions";

const CreateQuestionPaper = ({ closeModal }) => {
  const { questionData, getQuestions } = usePostGetQuestions();
  const [createStep, setCreateStep] = useState(1);
  const [simpleChapter, setSimpleChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [preventNext, setPreventNextLevel] = useState(true);

  //Step3 변수들
  const [paperName, setPaperName] = useState("");
  const [makerName, setMakerName] = useState("");
  const [paperGrade, setPaperGrade] = useState("초3-1");

  //챕터 받아오기
  const [school, setSchool] = useState("초");
  const [semester, setSemester] = useState("THIRD1");
  const [subject, setSubject] = useState("SCIENCE");

  const manageCanGoNext = () => {
    setPreventNextLevel(true);
    switch (createStep) {
      case 1:
        if (selectedChapters.length === 0) setPreventNextLevel(true);
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

  const [questionTag, setQuestionTag] = useState("NORMAL");

  const categoryToSendOption = {
    전체: ["MULTIPLE", "SUBJECTIVE"],
    객관식: ["MULTIPLE"],
    "주관식/서술형": ["SUBJECTIVE"],
  };
  const handleGetQuestion = async () => {
    const sortedChapters = selectedChapters.sort((a, b) => (a.id > b.id ? 1 : -1));
    setSelectedChapters(sortedChapters);

    await getQuestions(sortedChapters, quesNum, paperDifficulty, quesTypes, mockIncluded === "모의고사 포함");
  };

  useEffect(() => {
    const sortedQuestions = questionData.sort((a, b) => a.chapterId - b.chapterId);
    console.log(sortedQuestions);
    setSelectedQuestions(sortedQuestions);
  }, [questionData]);

  const [quesNum, setQuesNum] = useState(25);
  const [paperDifficulty, setPaperDifficulty] = useState("중");
  const [quesTypes, setQuesTypes] = useState("전체");
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

  const [selectedBook, setSelectedBook] = useState(null);
  const [localBookChapters, setLocalBookChapters] = useState([]);
  const TypeAndScope = () => {
    switch (activeMenu) {
      case "unitType":
        return (
          <CQP.ScopeContainer>
            <SelectCategory
              school={school}
              setSchool={setSchool}
              semester={semester}
              setSemester={setSemester}
              subject={subject}
              setSubject={setSubject}
              setSimpleChapters={setSimpleChapters}
            />
            <SelectQuestionScope
              simpleChapter={simpleChapter}
              setSimpleChapters={setSimpleChapters}
              selectedChapters={selectedChapters}
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
      case "exam":
        return <CQP.ScopeContainer>수능/모의고사 컨텐츠...</CQP.ScopeContainer>;
      default:
        return <CQP.ScopeContainer>기본 컨텐츠...</CQP.ScopeContainer>;
    }
  };
  const DetailOfScope = () => {
    switch (activeMenu) {
      case "unitType":
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
            getQuestions={handleGetQuestion}
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
      case "exam":
        return <CQP.ScopeContainer>수능/모의고사 컨텐츠...</CQP.ScopeContainer>;
      default:
        return <CQP.ScopeContainer>기본 컨텐츠...</CQP.ScopeContainer>;
    }
  };
  const [numberOfQuestions, setNumberOfQues] = useState({ 하: 0, 중하: 0, 중: 0, 중상: 0, 상: 0 });
  const QuestionSetModification = () => {
    switch (questionMenu) {
      case "summary":
        return (
          <SelectQuestions
            selectedChapters={selectedChapters}
            quesNum={quesNum}
            paperDifficulty={paperDifficulty}
            quesTypes={quesTypes}
            mockIncluded={mockIncluded}
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
          />
        );
    }
  };
  const [activeMenu, setActiveMenu] = useState("unitType");
  const [questionMenu, setQuestionMenu] = useState("summary");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [selectedConceptIds, setSelectedConceptIds] = useState([]);

  const RenderSteps = () => {
    switch (createStep) {
      case 1:
        return (
          <CQP.CreationContianer>
            <CQP.CategorySection>
              <CQP.CategoryBtn onClick={() => setActiveMenu("unitType")} $isSelected={activeMenu == "unitType"}>
                단원·유형별
                <CQP.UnderBar $isSelected={activeMenu == "unitType"} />
              </CQP.CategoryBtn>
              <CQP.CategoryBtn onClick={() => setActiveMenu("textbook")} $isSelected={activeMenu == "textbook"}>
                시중교재
                <CQP.UnderBar $isSelected={activeMenu == "textbook"} />
              </CQP.CategoryBtn>
              <CQP.CategoryBtn onClick={() => setActiveMenu("exam")} $isSelected={activeMenu == "exam"}>
                수능/모의고사
                <CQP.UnderBar $isSelected={activeMenu == "exam"} />
              </CQP.CategoryBtn>
              {TypeAndScope()}
            </CQP.CategorySection>
            {DetailOfScope()}
          </CQP.CreationContianer>
        );
      case 2:
        return (
          <SecondStep
            selectedChapters={selectedChapters}
            quesNum={quesNum}
            paperDifficulty={paperDifficulty}
            quesTypes={quesTypes}
            mockIncluded={mockIncluded}
            questionMenu={questionMenu}
            setQuestionMenu={setQuestionMenu}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            setCreateStep={setCreateStep}
            sortOption={sortOption}
            setSortOption={setSortOption}
            QuestionSetModification={QuestionSetModification}
            numberOfQuestions={numberOfQuestions}
            selectedConcepts={selectedConcepts}
          />
        );
      case 3:
        return (
          <ThirdStep
            closeModal={closeModal}
            selectedQuestions={selectedQuestions}
            selectedConcepts={selectedConcepts}
            title={paperName}
            setTitle={setPaperName}
            makerName={makerName}
            setMakerName={setMakerName}
            paperGrade={paperGrade}
            setPaperGrade={setPaperGrade}
            setCreateStep={setCreateStep}
            school={school}
            semester={semester}
            category={categoryToSendOption[quesTypes]}
            questionTag={questionTag}
            subject={subject}
            level={paperDifficulty}
            sortOption={sortOption}
          />
        );
    }
  };

  useEffect(() => {
    switch (activeMenu) {
      case "unitType":
        setQuestionTag("NORMAL");
        break;
      case "textbook":
        setQuestionTag("TEXT_BOOK");
        break;
      case "exam":
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
  }, [selectedChapters]);
  useEffect(() => {
    const getKoreanGrade = (school, subject, semester) => {
      // 과목명을 한글로 변환
      const subjectNames = { SCIENCE: "과학", PHYSICS: "물", CHEMISTRY: "화", BIOLOGY: "생", EARTH_SCIENCE: "지" };

      // 학기명을 서수로 변환
      const semesterNames = {
        FIRST1: "1-1",
        FIRST2: "1-2",
        SECOND1: "2-1",
        SECOND2: "2-2",
        THIRD1: "3-1",
        THIRD2: "3-2",
        FOURTH1: "4-1",
        FOURTH2: "4-2",
        FIFTH1: "5-1",
        FIFTH2: "5-2",
        SIXTH1: "6-1",
        SIXTH2: "6-2",
      };

      // subject가 SCIENCE인 경우
      if (subject === "SCIENCE") {
        const grade = semesterNames[semester];
        if (school && grade) {
          return `${school}${grade}`;
        } else {
          return "Invalid input";
        }
      }

      // subject가 SCIENCE가 아닌 경우
      const subjectNameKorean = subjectNames[subject];
      if (subjectNameKorean) {
        const semesterNumber = semester.includes("FIRST") ? "1" : "2";
        return `${subjectNameKorean}${semesterNumber}`;
      }

      return "Invalid input";
    };
    console.log(paperGrade);
    setPaperGrade(getKoreanGrade(school, subject, semester));
  }, [school, subject, semester]);
  return (
    <CQP.Modal_Overlay>
      <CQP.Modal>
        <CQP.NavigationBar>
          <CQP.StepBox>STEP {createStep}</CQP.StepBox>
          <CQP.StepDescipt
            onClick={() => {
              console.log(selectedQuestions);
            }}
          >
            {createPaperSequence()}
          </CQP.StepDescipt>
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
