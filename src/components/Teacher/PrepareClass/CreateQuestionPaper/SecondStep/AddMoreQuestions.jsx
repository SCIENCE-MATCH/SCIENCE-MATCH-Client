import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import usePostGetQuestions from "../../../../../libs/apis/Teacher/Prepare/postGetQuestions";

const AddMoreQuestions = ({
  selectedQuestions,
  setSelectedQuestions,
  selectedChapters,
  paperDifficulty,
  quesTypes,
  mockIncluded,
  setSortOption,
  setQuestionTag,
}) => {
  const { questionData, getQuestions } = usePostGetQuestions();
  const [newQuestions, setNewQuestions] = useState([]);

  const categorys = { MULTIPLE: "선택형", SUBJECTIVE: "단답형", DESCRIPTIVE: "서술형" };
  const diff_Eng_to_Kor = { LOW: "하", MEDIUM_LOW: "중하", MEDIUM: "중", MEDIUM_HARD: "중상", HARD: "상" };
  const handleGetMoreQuestions = async () => {
    await getQuestions(selectedChapters, 20, paperDifficulty, quesTypes, mockIncluded === "모의고사 포함");
  };

  const addQuestion = (question) => {
    const tempArr = [...selectedQuestions];
    tempArr.push(question);
    console.log(tempArr);
    setSelectedQuestions(tempArr);
    setSortOption("custom");
    setQuestionTag("NORMAL");
  };

  useEffect(() => {
    handleGetMoreQuestions();
  }, []);

  useEffect(() => {
    if (questionData.length > 0) {
      const sortedQuestions = questionData.sort((a, b) => a.chapterId - b.chapterId);
      const selectedQuestionIds = selectedQuestions.map((item) => item.questionId);
      const filteredArray = sortedQuestions.filter((item) => !selectedQuestionIds.includes(item.questionId));
      setNewQuestions(filteredArray);
    }
  }, [questionData, selectedQuestions]);
  return (
    <PQ.Wrapper>
      <PQ.TitleLine>
        <PQ.RefreshBtn onClick={handleGetMoreQuestions}>
          <FontAwesomeIcon icon={faArrowsRotate} style={{ marginRight: `0.5rem` }} />
          새로 불러오기
        </PQ.RefreshBtn>
        <PQ.AddAllBtn>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: `0.5rem` }} />
          전체 추가
        </PQ.AddAllBtn>
      </PQ.TitleLine>
      <PQ.QuestionImgList>
        {newQuestions.map((ques) => (
          <PQ.QuestionBox
            key={ques.questionId}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transmition={{ duration: 0.3 }}
          >
            <PQ.QuestionInfo>
              <PQ.QuestionChapter>{ques.chapterDescription}</PQ.QuestionChapter>
            </PQ.QuestionInfo>
            <PQ.QuestionDetail>
              <PQ.QuestionStatus>
                <PQ.QuestionTag>{diff_Eng_to_Kor[ques.level]}</PQ.QuestionTag>
                <PQ.QuestionTag>{categorys[ques.category]}</PQ.QuestionTag>
              </PQ.QuestionStatus>
              <PQ.QuestionImg src={ques.imageURL} id={ques.questionId} />
              <PQ.QuestionOptionalBox>
                <PQ.AddQuestionBtn
                  onClick={() => {
                    addQuestion(ques);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </PQ.AddQuestionBtn>
              </PQ.QuestionOptionalBox>
            </PQ.QuestionDetail>
          </PQ.QuestionBox>
        ))}
      </PQ.QuestionImgList>
    </PQ.Wrapper>
  );
};
export default AddMoreQuestions;

const infoHeight = 4;
const PQ = {
  Wrapper: styled.div`
    width: 60rem;
    height: 68rem;
    margin-top: 1rem;
    border-radius: 1rem;
    overflow: hidden;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
  `,
  TitleLine: styled.div`
    width: 60rem;
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.background};
    padding-inline: 1.5rem;
  `,
  Title: styled.div`
    width: 20rem;
    height: 6rem;
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 600;
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

  //문제 이미지 미리보기 문제 이미지 미리보기 문제 이미지 미리보기 문제 이미지 미리보기 문제 이미지 미리보기
  QuestionImgList: styled.div`
    width: 60rem;
    height: 63rem;
    border-radius: 0.25rem;
    overflow: hidden;
    padding-left: 1.5rem;
    padding-top: 1.5rem;
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
  RefreshBtn: styled.button`
    font-size: 1.5rem;
    font-weight: 600;
    margin-left: auto;
  `,
  AddAllBtn: styled.button`
    margin-left: 2rem;
    width: 12rem;
    height: 3.5rem;
    border-radius: 2rem;
    background-color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
  `,
  QuestionBox: styled(motion.div)`
    width: 57rem;
    border: 1px solid black;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 1.5rem;
  `,
  QuestionInfo: styled.div`
    padding-left: 2rem;
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
    padding: 1rem;
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
    width: 34.5rem;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard syntax */

    pointer-events: none; /* 이미지에 대한 마우스 이벤트 비활성화 */
  `,
  QuestionOptionalBox: styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    flex-grow: 1;
  `,
  AddQuestionBtn: styled.button`
    width: 9rem;
    height: 5.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.gray50};
    margin-right: 0.5rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
      background-color: ${({ theme }) => theme.colors.brightMain};
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
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
