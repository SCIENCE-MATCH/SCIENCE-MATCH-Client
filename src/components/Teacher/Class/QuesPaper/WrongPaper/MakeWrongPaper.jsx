import { useState, useEffect } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import WrongByDate from "./WrongByDate";
import WrongByPaper from "./WrongByPaper";

import SelectQuestions from "../../../PrepareClass/QuestionPaper/CreateQuestionPaper/SecondStep/SelectQeustions";
import AddMoreQuestions from "../../../PrepareClass/QuestionPaper/CreateQuestionPaper/SecondStep/AddMoreQuestions";
import SecondStep from "../../../PrepareClass/QuestionPaper/CreateQuestionPaper/SecondStep/SecondStep";
import ThirdStep from "../../../PrepareClass/QuestionPaper/CreateQuestionPaper/ThirdStep/ThirdStep";
import usePostGetQuestions from "../../../../../libs/apis/Teacher/Prepare/postGetQuestions";

const MakeWrongPaper = ({ closeModal, papers, studentName }) => {
  const { questionData, getQuestions } = usePostGetQuestions(); //챕터로 문제 조회
  const [ByDate, setByDate] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);
  const CreateWrongPaper = () => {
    const [createStep, setCreateStep] = useState(2);
    const [simpleChapter, setSimpleChapters] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [preventNext, setPreventNextLevel] = useState(true);
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
        case 2:
          if (selectedQuestions.length === 0) setPreventNextLevel(true);
          break;
        case 3:
          if ("") setPreventNextLevel(false);
          break;
      }
    };
    const activeMenu = "normal";
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

    const [quesNum, setQuesNum] = useState(25);
    const [paperDifficulty, setPaperDifficulty] = useState("중");
    const [quesTypes, setQuesTypes] = useState(["MULTIPLE", "SUBJECTIVE", "DESCRIPTIVE"]);
    const [mockIncluded, setMockIncluded] = useState("모의고사 포함");

    const createPaperSequence = () => {
      switch (createStep) {
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
        default:
          return <div>오류입니다.</div>;
      }
    };

    const RenderSteps = () => {
      switch (createStep) {
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
              isOnlyConcept={false}
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
  return (
    <WP.Modal_Overlay>
      {createModalOpen ? (
        <CreateWrongPaper />
      ) : (
        <WP.Modal>
          <WP.NavigationBar>
            <WP.CriteriaSection>
              <WP.CriteriaBtn onClick={() => setByDate(true)} $isSelected={ByDate}>
                기간별 오답
              </WP.CriteriaBtn>
              <WP.CriteriaBtn onClick={() => setByDate(false)} $isSelected={!ByDate}>
                학습지별 오답
              </WP.CriteriaBtn>
            </WP.CriteriaSection>
            <WP.Closebutton onClick={closeModal}>
              <FontAwesomeIcon icon={faXmark} /> 닫기
            </WP.Closebutton>
          </WP.NavigationBar>
          {ByDate ? (
            <WrongByDate />
          ) : (
            <WrongByPaper papers={papers} studentName={studentName} openCreateModal={openCreateModal} />
          )}
        </WP.Modal>
      )}
    </WP.Modal_Overlay>
  );
};

export default MakeWrongPaper;
const modalWidth = 135;
const WP = {
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
    align-content: center; /* 수직 중앙 정렬 */
    padding-left: 1rem;
  `,
  CriteriaSection: styled.div`
    width: 90rem;
    height: 5rem;
    margin-right: 2rem;
    overflow: hidden;
  `,
  CriteriaBtn: styled.button`
    width: 17rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    position: relative;
    color: ${({ $isSelected, theme }) => ($isSelected ? "black" : theme.colors.unselected)};
    border-bottom: ${({ $isSelected }) => ($isSelected ? "black 0.4rem solid" : "none")};
    margin-right: 2rem;
  `,
  Closebutton: styled.button`
    width: 8rem;
    height: 4rem;
    border-radius: 0.5rem;
    font-size: 1.8rem;
    font-weight: bold;
    margin-left: auto;
    margin-right: 1rem;
    border: 0.1rem ${({ theme }) => theme.colors.unselected} solid;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.unselected};
    &:hover {
      color: ${({ theme }) => theme.colors.deepDark};
    }
  `,
};
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
