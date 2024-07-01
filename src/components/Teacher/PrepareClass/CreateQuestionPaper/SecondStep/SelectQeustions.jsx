import { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import QuesPaperSummary from "./QuesPaperSummary";
import { motion } from "framer-motion";
const SelectQuestions = ({
  selectedQuestions,
  setSelectedQuestions,
  setSortOption,
  numberOfQuestions,
  setNumberOfQues,
}) => {
  const difficultyToSendOption = { 하: "LOW", 중하: "MEDIUM_LOW", 중: "MEDIUM", 중상: "MEDIUM_HARD", 상: "HARD" };

  const difficultyList = ["하", "중하", "중", "중상", "상"];
  const [maxLevelNum, setMaxLevelNum] = useState(0);
  const countNumberOfQuestions = ({ cate }) => {
    let num = 0;
    if (cate === "ALL") {
      return selectedQuestions.length;
    } else {
      for (let i = 0; i < selectedQuestions.length; i++) {
        if (selectedQuestions[i].category === cate) num += 1;
      }
      return num;
    }
  };

  const updateNumOfQues = (questions) => {
    const updatedCounts = { ...numberOfQuestions }; // 기존 상태 복사
    let maxNum = 0;
    difficultyList.forEach((diff) => {
      updatedCounts[diff] = 0; // 각 난이도의 카운트를 0으로 초기화
    });

    difficultyList.forEach((diff) => {
      questions.forEach((ques) => {
        if (ques.level === difficultyToSendOption[diff]) {
          updatedCounts[diff] += 1;
        }
      });
      maxNum = maxNum < updatedCounts[diff] ? updatedCounts[diff] : maxNum;
    });

    setNumberOfQues(updatedCounts); // 상태 업데이트
    setMaxLevelNum(maxNum);
  };

  useEffect(() => {
    updateNumOfQues(selectedQuestions);
  }, [selectedQuestions.length]);

  return (
    <SQ.Wrapper>
      <Stat.Container>
        <Stat.Label>문제 통계</Stat.Label>
        <Stat.StatisticMain>
          <Stat.LeftDescription>
            <Stat.SmallLetters>총 문제수</Stat.SmallLetters>
            <Stat.SmallLetters>
              <Stat.LargeNumber>{countNumberOfQuestions({ cate: "ALL" })}</Stat.LargeNumber>
              <Stat.SmallLetters as="a">문제</Stat.SmallLetters>
            </Stat.SmallLetters>
            <Stat.QuesNumLine>
              <FontAwesomeIcon icon={faCaretRight} style={{ marginRight: "1rem" }} />
              선택형 {countNumberOfQuestions({ cate: "MULTIPLE" })}
            </Stat.QuesNumLine>
            <Stat.QuesNumLine>
              <FontAwesomeIcon icon={faCaretRight} style={{ marginRight: "1rem" }} />
              단답형 {countNumberOfQuestions({ cate: "SUBJECTIVE" })}
            </Stat.QuesNumLine>
            <Stat.QuesNumLine>
              <FontAwesomeIcon icon={faCaretRight} style={{ marginRight: "1rem" }} />
              서술형 {countNumberOfQuestions({ cate: "DESCRIPTIVE" })}
            </Stat.QuesNumLine>
          </Stat.LeftDescription>
          <Stat.RightGraph>
            {difficultyList.map((opt, index) => (
              <Stat.BarColumn key={opt}>
                <Stat.NumberLabel
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transmition={{ duration: 0.3 }}
                >
                  {numberOfQuestions[opt]}개
                </Stat.NumberLabel>
                <Stat.Bar
                  $number={(numberOfQuestions[opt] * 11.5) / maxLevelNum}
                  $index={index}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transmition={{ duration: 0.3 }}
                />
                <Stat.Item>{opt}</Stat.Item>
              </Stat.BarColumn>
            ))}
          </Stat.RightGraph>
        </Stat.StatisticMain>
      </Stat.Container>
      <SQ.Container>
        <SQ.ColumnHeader as="div">
          <SQ.ShortBox>번호</SQ.ShortBox>
          <SQ.ShortBox>문제 타입</SQ.ShortBox>
          <SQ.ShortBox>난이도</SQ.ShortBox>
          <SQ.DescriptionBox>유형명</SQ.DescriptionBox>
          <SQ.ShortBox>순서 변경</SQ.ShortBox>
        </SQ.ColumnHeader>
        <QuesPaperSummary
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          setSortOption={setSortOption}
        />
      </SQ.Container>
    </SQ.Wrapper>
  );
};

export default SelectQuestions;

const SQ = {
  Wrapper: styled.div``,
  Container: styled.div`
    width: 60rem;
    height: 44.5rem;
    margin-top: 1rem;
    border-radius: 1rem;
    overflow: hidden;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
  `,
  ColumnHeader: styled.div`
    width: 60rem;
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.colors.notGraded};
  `,
  QuestionList: styled.ul`
    width: 60rem;
    height: 40.5rem;
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 1.5rem; /* 세로 스크롤바의 너비 */
    }

    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      //background: #f1f1f1; /* 트랙의 배경 색상 */
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
  QuestionLine: styled.li`
    display: flex;
    flex-direction: row;
  `,
  ShortBox: styled.div`
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gray};
    align-content: center;
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.background};
    width: 7rem;
    height: 4rem;
  `,
  DragBtn: styled.button`
    border: 0.1rem solid black;
  `,
};
SQ.DescriptionBox = styled(SQ.ShortBox)`
  padding-left: 1rem;
  text-align: left;
  width: 30.5rem;
`;
/**Statistics (문제 통계) style */
const Stat = {
  Container: styled.div`
    margin-top: 1.5rem;
    width: 60rem;
    height: 22rem;
    background-color: white;
    border: 0.05rem solid ${({ theme }) => theme.colors.background};
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
  `,
  Label: styled.div`
    padding: 2.5rem;
    width: 60rem;
    height: 7rem;
    font-size: 1.75rem;
    font-weight: bold;
    align-content: center;
    margin-bottom: -1.5rem;
  `,
  StatisticMain: styled.div`
    width: 60rem;
    height: 16rem;
    padding: 0 1rem 0 1rem;
    display: flex;
    flex-direction: row;
  `,
  LeftDescription: styled.div`
    width: 23.5rem;
    height: 14rem;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  SmallLetters: styled.div`
    height: 3rem;
    display: flex;
    flex-direction: row;
    font-size: 1.5rem;
    font-weight: normal;
    align-items: center;
  `,
  LargeNumber: styled.div`
    margin-right: 0.25rem;
    font-size: 2.5rem;
    font-weight: bold;
  `,
  QuesNumLine: styled.div`
    height: 2rem;
    display: flex;
    flex-direction: row;
    font-size: 1.4rem;
    font-weight: normal;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray};
    margin: 0.5rem 0 -0.5rem 0;
  `,
  RightGraph: styled.div`
    margin-top: -2rem;
    display: flex;
    flex-direction: row;
    width: 34rem;
    padding: 0rem 1rem 0 1rem;
  `,
  BarColumn: styled.div`
    width: 6.4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  NumberLabel: styled(motion.div)`
    margin-top: auto;
    font-size: 1.5rem;
    font-weight: normal;
  `,
  Bar: styled(motion.div)`
    width: 2rem;
    height: ${({ $number }) => $number + 0.25}rem;
    border-radius: 0.5rem;
    margin-block: 1rem;
    background-color: ${({ $index, theme }) => {
      switch ($index) {
        case 0:
          return theme.colors.deepDark;
        case 1:
          return theme.colors.warning;
        case 2:
          return theme.colors.mainColor;
        case 3:
          return theme.colors.warning;
        case 4:
          return "red";
        default:
          return theme.colors.deepDark;
      }
    }};
  `,
  Item: styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  `,
};
