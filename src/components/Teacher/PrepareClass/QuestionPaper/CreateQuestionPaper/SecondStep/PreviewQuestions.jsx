import { faArrowRight, faCaretDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { hexToRgba } from "../../../../../../utils/colorUtils";

const PreviewQuestions = ({
  selectedQuestions,
  setSelectedQuestions,
  setCreateStep,
  sortOption,
  setSortOption,
  numberOfQuestions,
}) => {
  const categorys = { MULTIPLE: "선택형", SUBJECTIVE: "단답형", DESCRIPTIVE: "서술형" };
  const diff_Eng_to_Kor = { LOW: "하", MEDIUM_LOW: "중하", MEDIUM: "중", MEDIUM_HARD: "중상", HARD: "상" };
  const difficultyList = ["하", "중하", "중", "중상", "상"];

  const sortOptions = [
    { value: "default", label: "유형 오름차순" },
    { value: "difficultyAsc", label: "난이도 오름차순" },
    { value: "random", label: "무작위" },
    { value: "multipleTop", label: "객관식 상단 배치" },
    { value: "custom", label: "사용자 정렬" },
  ];
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    let sortedQuestions = [...selectedQuestions];
    switch (sortOption) {
      case "default":
        sortedQuestions.sort((a, b) => a.chapterId - b.chapterId);
        break;
      case "difficultyAsc":
        const difficultyOrder = {
          LOW: 1,
          MEDIUM_LOW: 2,
          MEDIUM: 3,
          MEDIUM_HARD: 4,
          HARD: 5,
        };
        sortedQuestions.sort((a, b) => difficultyOrder[a.level] - difficultyOrder[b.level]);
        break;
      case "random":
        sortedQuestions.sort(() => Math.random() - 0.5);
        break;
      case "multipleTop":
        sortedQuestions.sort((a, b) => (a.category === "MULTIPLE" ? -1 : 1));
        break;
      case "custom":
        // 사용자 지정 정렬 로직을 여기에 추가할 수 있습니다.
        break;
      default:
        break;
    }
    setSelectedQuestions(sortedQuestions);
  }, [sortOption]);
  const diffSum = difficultyList
    .map((opt, index) => (numberOfQuestions[opt] > 0 ? opt + numberOfQuestions[opt] + " · " : ""))
    .join("");
  const difficultySummary = diffSum.slice(0, -3);
  const deleteQues = (index) => {
    const tempArr = [...selectedQuestions];
    tempArr.splice(index, 1);
    setSelectedQuestions(tempArr);
  };
  return (
    <PQ.RightSection>
      <PQ.TitleLine>
        <PQ.Title>선택한 문제 목록</PQ.Title>
        <PQ.SettingLabel>정렬방식</PQ.SettingLabel>

        <PQ.SortDropdown>
          <PQ.DropdownLabel
            onClick={() => {
              setShowDropdown((prev) => !prev);
            }}
          >
            {sortOptions.find((option) => option.value === sortOption).label + " "}
            <FontAwesomeIcon icon={faCaretDown} />
          </PQ.DropdownLabel>
          <PQ.DropdownContainor>
            {showDropdown ? (
              sortOptions.map((option, index) => (
                <PQ.DropdownOption
                  onClick={() => {
                    setSortOption(option.value);
                    setShowDropdown(false);
                  }}
                  key={index}
                >
                  {option.label}
                </PQ.DropdownOption>
              ))
            ) : (
              <></>
            )}
          </PQ.DropdownContainor>
        </PQ.SortDropdown>
      </PQ.TitleLine>
      <PQ.QuestionImgList>
        {selectedQuestions.map((ques, index) => (
          <PQ.QuestionBox
            key={ques.questionId}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transmition={{ duration: 0.3 }}
          >
            <PQ.QuestionInfo>
              <PQ.QuestionNumber>{index + 1}</PQ.QuestionNumber>
              <PQ.QuestionChapter>{ques.chapterDescription}</PQ.QuestionChapter>
            </PQ.QuestionInfo>
            <PQ.QuestionDetail>
              <PQ.QuestionStatus>
                <PQ.QuestionTag>{diff_Eng_to_Kor[ques.level]}</PQ.QuestionTag>
                <PQ.QuestionTag>{categorys[ques.category]}</PQ.QuestionTag>
              </PQ.QuestionStatus>
              <PQ.QuestionImg src={ques.imageURL} id={ques.questionId} />
              <PQ.QuestionOptionalBox>
                <PQ.DeleteQuestionBtn
                  onClick={() => {
                    deleteQues(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </PQ.DeleteQuestionBtn>
                {/* <PQ.SimilarQuestionBtn>쌍둥이 · 유사</PQ.SimilarQuestionBtn> */}
              </PQ.QuestionOptionalBox>
            </PQ.QuestionDetail>
          </PQ.QuestionBox>
        ))}
      </PQ.QuestionImgList>
      <Pg.SummaryBox>
        <Pg.PrevStepBtn onClick={() => setCreateStep((prev) => prev - 1)}>이전</Pg.PrevStepBtn>
        <Pg.DifficultySummary>
          {difficultySummary}
          {" |"}
        </Pg.DifficultySummary>
        <Pg.QuesNumSummary>문제 수 {selectedQuestions.length}개</Pg.QuesNumSummary>
        <Pg.NextStepBtn
          onClick={() => {
            if (selectedQuestions.length === 0) alert("선택된 문제가 없습니다");
            else setCreateStep((prev) => prev + 1);
          }}
        >
          {`다음 단계 `}
          <FontAwesomeIcon icon={faArrowRight} />
        </Pg.NextStepBtn>
      </Pg.SummaryBox>
    </PQ.RightSection>
  );
};
export default PreviewQuestions;

const infoHeight = 6;
const PQ = {
  RightSection: styled.div`
    width: 70rem;
    height: 74rem;
    padding: 1.5rem;
    background-color: ${({ theme }) => theme.colors.gray};
    border-radius: 1rem;
  `,
  TitleLine: styled.div`
    width: 67rem;
    height: 6rem;
    margin-top: -1rem;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Title: styled.div`
    width: 20rem;
    height: 6rem;
    display: flex;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    color: white;
  `,
  SettingLabel: styled.div`
    height: 6rem;
    margin-left: auto;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 400;
    color: white;
  `,
  SortDropdown: styled.div`
    height: 6rem;
    cursor: pointer;
  `,
  DropdownLabel: styled.div`
    height: 6rem;
    min-width: 17.5rem;
    text-align: right;
    align-content: center;
    font-size: 1.8rem;
    font-weight: 400;
    color: white;
  `,
  DropdownContainor: styled.div`
    position: relative;

    z-index: 1000; /* Ensure the dropdown is above other elements */
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `,
  DropdownOption: styled.button`
    width: 17.5rem;
    height: 3.25rem;
    font-weight: 600;
    font-size: 1.8rem;
    background-color: ${({ theme }) => hexToRgba("black", 0.6)};
    color: white;
    border-radius: 0.5rem;
    margin-top: 0.5rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray};
    }
  `,

  //문제 이미지 미리보기 문제 이미지 미리보기 문제 이미지 미리보기 문제 이미지 미리보기 문제 이미지 미리보기
  QuestionImgList: styled.div`
    width: 100%;
    height: 60rem;
    border-radius: 0.25rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem; /* 세로 스크롤바의 너비 */
    }

    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      background: #f1f1f1; /* 트랙의 배경 색상 */
      //border-radius: 1rem; /* 트랙의 모서리 둥글게 */
    }

    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
      //border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }

    /* 스크롤바 핸들에 마우스 호버시 스타일 */
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  QuestionBox: styled(motion.div)`
    width: 66rem;
    border: 1px solid black;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 1.5rem;
  `,
  QuestionInfo: styled.div`
    height: ${infoHeight}rem;
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    align-items: center;
  `,
  QuestionNumber: styled.div`
    width: 6rem;
    height: ${infoHeight}rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    font-weight: 600;
  `,
  QuestionChapter: styled.div`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.infoBtn};
    font-size: 1.6rem;
    font-weight: 600;
  `,
  QuestionDetail: styled.div`
    padding: 2rem 1rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  `,
  QuestionStatus: styled.div`
    width: 9rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  QuestionTag: styled.div`
    display: flex;
    width: 6rem;
    height: 2.2rem;
    margin-bottom: 1.1rem;
    border-radius: 0.5rem;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.gray10};
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray60};
  `,
  QuestionImg: styled.img`
    width: 38rem;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard syntax */

    pointer-events: none; /* 이미지에 대한 마우스 이벤트 비활성화 */
  `,
  QuestionOptionalBox: styled.div`
    width: 14rem;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    flex-grow: 1;
  `,
  DeleteQuestionBtn: styled.button`
    width: 9rem;
    height: 5.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.gray50};
    margin-right: 1.5rem;
    &:hover {
      color: ${({ theme }) => theme.colors.warning};
      background-color: ${({ theme }) => theme.colors.softWarning};
      border: 0.2rem solid ${({ theme }) => theme.colors.warning};
    }
  `,
  SimilarQuestionBtn: styled.button`
    width: 12rem;
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray60};
    margin-right: 1.5rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
      background-color: ${({ theme }) => theme.colors.lightMain};
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    }
  `,
};
const Pg = {
  SummaryBox: styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 1.5rem;
  `,
  PrevStepBtn: styled.button`
    width: 10rem;
    height: 5rem;
    border-radius: 1rem;
    font-size: 1.75rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.unselected};
    background-color: white;
  `,
  DifficultySummary: styled.div`
    height: 5rem;
    margin-left: auto;
    color: ${({ theme }) => theme.colors.unselected};
    font-size: 1.8rem;
    font-weight: 400;
    display: flex;
    align-items: center;
  `,
  QuesNumSummary: styled.div`
    height: 5rem;
    color: white;
    font-size: 1.8rem;
    font-weight: 400;
    display: flex;
    margin-left: 1rem;
    align-items: center;
  `,
  NextStepBtn: styled.button`
    width: 15rem;
    height: 5rem;
    margin-left: 1rem;
    border-radius: 1rem;
    font-size: 1.75rem;
    font-weight: bold;
    color: white;
    background-color: ${({ theme }) => theme.colors.mainColor};
  `,
};
