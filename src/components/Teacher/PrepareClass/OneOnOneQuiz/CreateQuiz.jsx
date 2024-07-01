import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import AutoResizeTextArea from "./AutoResizeTextArea";

const CreateQuiz = ({ goBack, deliveredList }) => {
  const navigate = useNavigate();
  const [school, setSchool] = useState("초");
  const [semester, setSemester] = useState("THIRD1");
  const [subject, setSubject] = useState("SCIENCE");
  const [chapters, setChapters] = useState([]);
  const [simpleChapter, setSimpleChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [quizs, setQuizs] = useState([...deliveredList]);

  const changeSchool = (e) => {
    setSchool(e.target.value);
    switch (e.target.value) {
      case "초":
        setSemester("THIRD1");
        break;
      default:
        setSemester("FIRST1");
        break;
    }
  };

  const schoolOptions = ["초", "중", "고"];
  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const semesterOptions_Ele = ["THIRD1", "THIRD2", "FOURTH1", "FOURTH2", "FIFTH1", "FIFTH2", "SIXTH1", "SIXTH2"];
  const semesterTexts_Ele = ["3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2"];
  const semesterOptions_Mid = ["FIRST1", "FIRST2", "SECOND1", "SECOND2", "THIRD1", "THIRD2"];
  const semesterTexts_Mid = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"];
  const semesterOptions_H = ["FIRST1", "FIRST2", "P1", "P2", "C1", "C2", "B1", "B2", "E1", "E2"];
  const sHOS = ["FIRST1", "FIRST2", "FIRST1", "SECOND1", "FIRST1", "SECOND1", "FIRST1", "SECOND1", "FIRST1", "SECOND1"]; //semesterOptions_High_to_send
  const subjectOptions_for_send = ["SCIENCE", "PHYSICS", "CHEMISTRY", "BIOLOGY", "EARTH_SCIENCE"];
  const semesterTexts_H = ["1-1", "1-2", "물-1", "물-2", "화-1", "화-2", "생-1", "생-2", "지-1", "지-2"];
  const changeGrade = (opt, index) => {
    setSemester(opt);
    switch (school) {
      case "초":
        setSemester(semesterOptions_Ele[index]);
        break;
      case "중":
        setSemester(semesterOptions_Mid[index]);
        break;
      case "고":
        setSemester(sHOS[index]);
        setSubject(subjectOptions_for_send[~~(index / 2)]);
        break;
      default:
        break;
    }
  };
  const gradesUponSchool = () => {
    let tempOpts = [];
    let tempText = [];
    switch (school) {
      case "초":
        tempOpts = semesterOptions_Ele;
        tempText = semesterTexts_Ele;
        break;
      case "중":
        tempOpts = semesterOptions_Mid;
        tempText = semesterTexts_Mid;
        break;
      case "고":
        tempOpts = semesterOptions_H;
        tempText = semesterTexts_H;
        break;
      default:
        break;
    }
    return (
      <SCHOOLSEM.SemsterOptionContainer>
        {tempOpts.map((opt, index) => (
          <SCHOOLSEM.SemesterBtn
            key={index}
            $isSelected={semester === opt}
            value={opt}
            onClick={() => {
              changeGrade(opt, index);
            }}
          >
            {tempText[index]}
          </SCHOOLSEM.SemesterBtn>
        ))}
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  useEffect(() => {
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const getChapters = async () => {
      try {
        const accessToken = getCookie("aToken");
        const url = "https://www.science-match.p-e.kr/admin/chapter/get";

        const response = await Axios.post(
          url,
          { school: schoolToSend[school], semester: semester, subject: subject },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setChapters(response.data.data);
      } catch (error) {
        console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
        if (error.response.data.message === "만료된 액세스 토큰입니다.") {
          alert("다시 로그인 해주세요");
        }
      }
    };
    setChapters([]);
    getChapters();
  }, [school, semester, subject]);

  /**simplifyChapter*/
  useEffect(() => {
    const newChapters = [];
    for (let i = 0; i < chapters.length; i++) {
      const { id, description } = chapters[i];
      newChapters.push({ id, description, selected: false, expansion: false, children: [] });
      for (let j = 0; j < chapters[i].children.length; j++) {
        const { id, description } = chapters[i].children[j];
        newChapters[i].children.push({ id, description, selected: false, expansion: false, children: [] });
        for (let k = 0; k < chapters[i].children[j].children.length; k++) {
          const { id, description } = chapters[i].children[j].children[k];
          newChapters[i].children[j].children.push({ id, description, selected: false, children: [] });
        }
      }
    }
    setSimpleChapters(newChapters);
  }, [chapters]);

  const onExpansion = (thisChap) => {
    const updatedSimpleChapter = simpleChapter.map((chapter) => {
      if (chapter.id === thisChap.id) {
        // 현재 챕터의 expansion 속성을 토글합니다.
        return { ...chapter, expansion: !chapter.expansion };
      } else {
        const updatedChildren = chapter.children.map((childChap) => {
          if (childChap.id === thisChap.id) {
            return { ...childChap, expansion: !childChap.expansion };
          } else {
            return childChap;
          }
        });
        return { ...chapter, children: updatedChildren };
      }
    });
    setSimpleChapters(updatedSimpleChapter);
  };

  const onChapterClick = (thisChap) => {
    if (selectedChapter === thisChap) {
      setSelectedChapter([]);
    } else {
      setSelectedChapter(thisChap);
    }
  };

  const chapterBox = (thisChap, level) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        $level={level - 1}
        onClick={() => {
          level === 3 ? onChapterClick(thisChap) : onExpansion(thisChap);
        }}
        $isExpanded={thisChap.expansion}
      >
        {level < 3 ? (
          <CHAPTERSCOPE.ExpansionSection $isExpanded={thisChap.expansion}>
            <FontAwesomeIcon icon={thisChap.expansion & (level < 3) ? faCaretDown : faCaretRight} />
          </CHAPTERSCOPE.ExpansionSection>
        ) : (
          <CHAPTERSCOPE.CheckBox $isChecked={selectedChapter === thisChap}>
            {selectedChapter === thisChap ? <FontAwesomeIcon icon={faCheck} /> : ""}
          </CHAPTERSCOPE.CheckBox>
        )}
        <CHAPTERSCOPE.DescriptionBox>{thisChap.description}</CHAPTERSCOPE.DescriptionBox>
      </CHAPTERSCOPE.ChapterLine>
    );
  };

  /** 여기부터 바로 질문 추가 영역입니당 */

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const create1on1Quiz = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/paper-test/create";

      await Axios.post(
        url,
        [
          {
            school: schoolToSend[school],
            semester: semester,
            chapterId: selectedChapter.id,
            question: newQuestion,
            solution: newAnswer,
          },
        ],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json;charset=UTF-8",
            accept: "application/json;charset=UTF-8",
          },
        }
      );
      setNewQuestion("");
      setNewAnswer("");
      const now = new Date();
      setQuizs([{ chapterDescription: selectedChapter.description, createdAt: now, question: newQuestion }, ...quizs]);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };

  const delete1on1Quiz = () => {};
  /** 질문 목록 띄워주기 */
  const [quizsToRender, setQuizsToRender] = useState([]);
  useEffect(() => {
    const filterdList = quizs.filter((quiz) => {
      console.log(quiz.chapterDescription + " :: " + selectedChapter.description);
      return quiz.chapterDescription === selectedChapter.description;
    });
    setQuizsToRender(filterdList);
    console.log(`필터 결과`);
    console.log(filterdList);
  }, [selectedChapter, quizs]);

  return (
    <OO.Wrapper>
      <OO.LeftSection>
        <SCHOOLSEM.RowContainer>
          <SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.BtnContainer>
              {schoolOptions.map((opt) => (
                <SCHOOLSEM.DetailBtn key={opt} $isSelected={school === opt} value={opt} onClick={changeSchool}>
                  {opt}
                </SCHOOLSEM.DetailBtn>
              ))}
            </SCHOOLSEM.BtnContainer>
          </SCHOOLSEM.SchoolOptionContainer>
        </SCHOOLSEM.RowContainer>
        <SCHOOLSEM.RowContainer>{gradesUponSchool()}</SCHOOLSEM.RowContainer>

        <CHAPTERSCOPE.ScopeSection>
          {simpleChapter.map((thisChap, index) => (
            <div key={index}>
              {chapterBox(thisChap, 1)}
              {thisChap.expansion
                ? thisChap.children.map((childChap, cIndex) => (
                    <div key={cIndex}>
                      {chapterBox(childChap, 2)}
                      {childChap.expansion
                        ? childChap.children.map((grandchildChap, gcIndex) => (
                            <div key={gcIndex}>{chapterBox(grandchildChap, 3)}</div>
                          ))
                        : null}
                    </div>
                  ))
                : null}
            </div>
          ))}
        </CHAPTERSCOPE.ScopeSection>
        <CHAPTERSCOPE.GoBackBtn onClick={goBack}>돌아가기</CHAPTERSCOPE.GoBackBtn>
      </OO.LeftSection>
      <OO.RightSection>
        <OO.SectionTitleContianer>
          <OO.SectionTitle>1:1 질문 추가 / 삭제</OO.SectionTitle>
        </OO.SectionTitleContianer>
        <OO.InputSection>
          <OO.InputLine>
            <OO.QuizLabel>Q</OO.QuizLabel>
            <AutoResizeTextArea
              width={`58rem`}
              placeholder={`질문을 입력하세요`}
              value={newQuestion}
              setValue={setNewQuestion}
              maxLen={300}
            />
          </OO.InputLine>
          <OO.InputLine>
            <OO.AnswerLabel>A</OO.AnswerLabel>
            <AutoResizeTextArea
              width={`46rem`}
              placeholder={`정답을 입력하세요`}
              value={newAnswer}
              setValue={setNewAnswer}
              maxLen={100}
            />
            <OO.AddBtn
              disabled={(newQuestion === "") | (newAnswer === "") | (selectedChapter.length === 0)}
              $isDisabled={(newQuestion === "") | (newAnswer === "") | (selectedChapter.length === 0)}
              onClick={create1on1Quiz}
            >
              추가
            </OO.AddBtn>
          </OO.InputLine>
        </OO.InputSection>
        <OO.QuizSection>
          {/**여기에 map추가 */}
          {quizsToRender.map((ques, index) => (
            <OO.ContainerForOneQuiz>
              <OO.QuesLine>
                <OO.QuizLabel>Q</OO.QuizLabel>
                <OO.QuestionBox>{ques.question}</OO.QuestionBox>
                <OO.DeleteBtn onClick={delete1on1Quiz}>
                  <FontAwesomeIcon icon={faTrash} />
                </OO.DeleteBtn>
              </OO.QuesLine>
            </OO.ContainerForOneQuiz>
          ))}

          {/** 여기까지 반복 */}
        </OO.QuizSection>
      </OO.RightSection>
    </OO.Wrapper>
  );
};

export default CreateQuiz;

const leftSectionWidth = `68rem`;
const OO = {
  Wrapper: styled.div`
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: auto; /*standard: 1400*/
    height: 80rem;
  `,
  LeftSection: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    margin-right: 1.5rem;
    overflow: hidden;
  `,
  RightSection: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
  `,
  SectionTitleContianer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  `,
  SectionTitle: styled.div`
    height: 5rem;
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  QuizLabel: styled.div`
    color: ${({ theme }) => theme.colors.warning};
    font-size: 4rem;
    font-weight: 700;
    width: 5rem;
    height: 4rem;
    display: flex;
    justify-content: center;
  `,
  AnswerLabel: styled.div`
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 4rem;
    font-weight: 700;
    width: 5rem;
    height: 4rem;
    display: flex;
    justify-content: center;
  `,
  //문제 추가 부분
  InputSection: styled.div``,
  InputLine: styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
  `,
  QuestionInput: styled.textarea`
    width: 58rem;
    min-height: 4rem;
    border-radius: 0.8rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    margin-bottom: 1rem;
    padding-left: 1rem;
    padding-top: 0.5rem;
    font-size: 1.7rem;
    font-weight: 600;
    resize: none;
    overflow: hidden;
  `,
  AnswerInput: styled.textarea`
    width: 46rem;
    min-height: 4rem;
    border-radius: 0.8rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    padding-left: 1rem;
    font-size: 1.7rem;
    font-weight: 600;
    resize: none;
    overflow: hidden;
  `,
  AddBtn: styled.button`
    margin-left: 2rem;
    width: 10rem;
    height: 5rem;
    border-radius: 0.8rem;
    font-size: 3rem;
    font-weight: 700;
    color: ${({ $isDisabled, theme }) => ($isDisabled ? theme.colors.unselected : `white`)};
    background-color: ${({ $isDisabled, theme }) => ($isDisabled ? theme.colors.gray05 : theme.colors.mainColor)};
    border: 0.02rem solid
      ${({ $isDisabled, theme }) => ($isDisabled ? theme.colors.unselected : theme.colors.mainColor)};
    cursor: ${({ $isDisabled }) => ($isDisabled ? `default` : `cursor`)};
  `,
  //문제 렌더 부분
  QuizSection: styled.div`
    flex-grow: 1; /* 남은 공간을 모두 차지 */
    max-height: 53.75rem;
    border-radius: 1rem;
    padding: 1rem 0rem 0rem 1rem;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background};
    border: 0.02rem solid ${({ theme }) => theme.colors.gray50};
    /* 스크롤바 전체 너비 설정 */
    &::-webkit-scrollbar {
      width: 1rem; /* 세로 스크롤바의 너비 */
    }

    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      //background: #f1f1f1; /* 트랙의 배경 색상 */
      border-radius: 1rem; /* 트랙의 모서리 둥글게 */
    }

    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
      border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }

    /* 스크롤바 핸들에 마우스 호버시 스타일 */
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  ContainerForOneQuiz: styled(motion.div)`
    width: 62.5rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    border-radius: 1rem;
    padding-block: 1rem;
    background-color: white;
    margin-bottom: 1rem;
  `,
  QuesLine: styled.div`
    display: flex;
    flex-direction: row;
  `,
  QuestionBox: styled.div`
    width: 56rem;
    min-height: 4rem;
    border-radius: 0.8rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: 1.7rem;
    font-weight: 600;
    line-height: 2.5rem;
    overflow: hidden;
  `,
  AnswerBox: styled.div`
    width: 45rem;
    height: 4rem;
    overflow-x: hidden;
    border-radius: 0.8rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    font-size: 1.7rem;
    font-weight: 600;
    padding: 1rem;
    display: flex;
    align-items: center;
    line-height: 2.5rem;
    overflow: hidden;
  `,
  DeleteBtn: styled.button`
    margin-left: 2rem;
    width: 9rem;
    border-radius: 0.8rem;
    font-size: 2.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.unselected};
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    &:hover {
      background-color: ${({ theme }) => theme.colors.softWarning};
      color: ${({ theme }) => theme.colors.warning};
      border: 0.02rem solid ${({ theme }) => theme.colors.warning};
    }
  `,
};
const SCHOOLSEM = {
  RowContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${leftSectionWidth};
    height: 6rem;
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    width: 18rem;
    height: 4rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
  `,
  BtnContainer: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  DetailBtn: styled.button`
    width: 4rem;
    height: 4rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 400;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    border: 0.05rem solid
      ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
  `,
  SemsterOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 1rem;
  `,
  SemesterBtn: styled.button`
    flex: 1;
    width: 5.5rem;
    height: 4rem;
    border-radius: 2rem;
    margin-left: 1rem;
    font-size: 1.5rem;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.deepDark)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    border: 0.05rem solid
      ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
  `,
};

const CHAPTERSCOPE = {
  ScopeSection: styled.div`
    border-top: 5rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
    overflow-y: auto;
    width: ${leftSectionWidth};
    height: 61rem;
    padding-left: 1rem;
    margin-bottom: 1rem;
    /* 스크롤바 전체 너비 설정 */
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

  ChapterLine: styled.div`
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    //border: 0.1rem black solid;
    margin-left: ${({ $level }) => $level * 2.8}rem;
    cursor: pointer;
  `,
  ExpansionSection: styled.div`
    width: 3rem;
    text-align: center;
    align-content: center;
    justify-items: center;
    font-size: 2rem;
    color: ${({ $isExpanded, theme }) => ($isExpanded ? theme.colors.deepDark : theme.colors.unselected)};

    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : theme.colors.unselected)} solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    overflow: hidden;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
  `,
  DescriptionBox: styled.div`
    margin-left: 0.75rem;
    font-size: 1.75rem;
    width: 20rem;
  `,
  GoBackBtn: styled.button`
    margin-left: 2rem;
    width: 15rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray60};
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
  `,
};
