import { useState, useEffect } from "react";
import SelectQuestionScope from "./FirstStep/SelectQeustionScope";
import SelectQuestions from "./SecondStep/SelectQeustions";
import DetailOfNormal from "./FirstStep/DetailOfNormal";
import SelectCategory from "./FirstStep/SelectCategory";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import SecondStep from "./SecondStep/SecondStep";
import { useNavigate } from "react-router";
import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import ThirdStep from "./ThirdStep/ThirdStep";
import AddConcept from "./SecondStep/AddConcept";
import SelectBook from "./FirstStep/SelectBook";
import DetailOfBook from "./FirstStep/DetailOfBook";

const CreateQuestionPaper = ({ closeModal }) => {
  const navigate = useNavigate();
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

  const [mockExam, setMockExam] = useState(false);
  const [questionTag, setQuestionTag] = useState("NORMAL");
  const difficultyToSendOption = { 하: "LOW", 중하: "MEDIUM_LOW", 중: "MEDIUM", 중상: "MEDIUM_HARD", 상: "HARD" };

  const categoryToSendOption = {
    전체: ["MULTIPLE", "SUBJECTIVE"],
    객관식: ["MULTIPLE"],
    "주관식/서술형": ["SUBJECTIVE"],
  };
  const getQuestions = async () => {
    let tempArray = [];
    const accessToken = getCookie("aToken");

    const sortedChapters = selectedChapters.sort((a, b) => (a.id > b.id ? 1 : -1));
    setSelectedChapters(sortedChapters);
    const newChapterIds = sortedChapters.map((chap) => `chapterIds=${chap.id}`).join("&");
    if (mockIncluded === "모의고사 포함") setMockExam(true);
    else setMockExam(false);

    for (let i = 0; i < categoryToSendOption[quesTypes].length; i++) {
      try {
        const url = `https://www.science-match.p-e.kr/teacher/questions/normal?${newChapterIds}&questionNum=${quesNum}&level=${difficultyToSendOption[paperDifficulty]}&category=${categoryToSendOption[quesTypes][i]}&mockExam=${mockExam}`;

        const response = await Axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        tempArray = [...tempArray, ...response.data.data];
      } catch (error) {
        console.error(error);
        console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
        if (error.response.data.message === "만료된 액세스 토큰입니다.") {
          alert("다시 로그인 해주세요");
          navigate("/");
        }
        break;
      }
    }
    tempArray.sort((a, b) => a.chapterId - b.chapterId);
    setSelectedQuestions(tempArray);
  };

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
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              selectedChapters={selectedChapters}
              setSelectedChapters={setSelectedChapters}
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
            getQuestions={getQuestions}
          />
        );
      case "textbook":
        return (
          <DetailOfBook
            selectedQuestions={selectedQuestions}
            selectedChapters={selectedChapters}
            setCreateStep={setCreateStep}
            preventNext={preventNext}
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
        return <CQP.ScopeContainer>새 문제 추가...</CQP.ScopeContainer>;
      case "twinQues":
        return <CQP.ScopeContainer>쌍디...</CQP.ScopeContainer>;
      case "addConcept":
        return (
          <AddConcept
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
          />
        );
    }
  };

  useEffect(() => {
    setSelectedBook(null);
    setSelectedQuestions([]);
  }, [activeMenu]);
  useEffect(() => {
    manageCanGoNext();
  }, [selectedChapters]);

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
