import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import useGetChapters from "../../../libs/apis/Admin/postChapterGet";

const ChapterForNormal = ({
  currentChapter,
  setCurrentChapter,
  questionCategory,
  setQuestionCategory,
  school,
  setSchool,
  grade,
  setGrade,
  semester,
  setSemester,
}) => {
  const { chapters, getChapters } = useGetChapters();

  const categorySet = { 0: "단원 유형별", 1: "시중교재", 2: "모의고사" };
  const [simpleChapter, setSimpleChapters] = useState([]);

  const schoolOptions = ["초", "중", "고"];
  const grades = { 초: [3, 4, 5, 6], 중: [1, 2, 3], 고: [1, "물리", "화학", "생명", "지구"] };

  const changeSchool = (e) => {
    const newValue = e.target.value;
    setSchool(newValue);
    if (newValue === "초") setGrade(3);
    else setGrade(1);
  };
  const changeGrade = (opt) => {
    setGrade(opt);
  };
  const changeSemester = (opt) => {
    setSemester(opt);
  };
  const gradesUponSchool = () => {
    return (
      <SCHOOLSEM.SemsterOptionContainer>
        {grades[school].map((opt, index) => (
          <SCHOOLSEM.DetailBtn
            key={index}
            $isSelected={grade === opt}
            value={opt}
            onClick={() => {
              changeGrade(opt);
            }}
          >
            {opt}
          </SCHOOLSEM.DetailBtn>
        ))}
        <SCHOOLSEM.SemesterContainer>
          <SCHOOLSEM.DetailBtn $isSelected={semester === 1} onClick={() => changeSemester(1)}>
            1
          </SCHOOLSEM.DetailBtn>
          <SCHOOLSEM.DetailBtn $isSelected={semester === 2} onClick={() => changeSemester(2)}>
            2
          </SCHOOLSEM.DetailBtn>
        </SCHOOLSEM.SemesterContainer>
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };

  const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
  const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
  useEffect(() => {
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${numToEng[semester - 1]}1`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }

    setCurrentChapter({ id: null, description: null });
    getChapters(schoolToSend[school], sem, sub);
  }, [school, grade, semester]);

  /**simplifyChapter*/
  useEffect(() => {
    if (chapters.length > 0) {
      const mapChapterStructure = (chapter) => {
        const { id, description, children } = chapter;
        return {
          id,
          description,
          expansion: false,
          children: children.map(mapChapterStructure),
        };
      };
      const { id, description, children } = chapters[0];
      const newChapters = [{ id, description, expansion: true, children: children.map(mapChapterStructure) }];
      setSimpleChapters(newChapters);
    }
  }, [chapters]);

  const onExpansion = (thisChap) => {
    const toggleExpansionRecursively = (chapters) => {
      return chapters.map((chapter) => {
        if (chapter.id === thisChap.id) {
          return { ...chapter, expansion: !chapter.expansion };
        } else {
          return {
            ...chapter,
            children: toggleExpansionRecursively(chapter.children),
          };
        }
      });
    };

    const updatedSimpleChapter = toggleExpansionRecursively(simpleChapter);
    setSimpleChapters(updatedSimpleChapter);
  };

  const onChapterClick = (thisChap) => {
    if (currentChapter.id === thisChap.id) {
      setCurrentChapter({ id: null, description: null });
    } else {
      let sem = "FIRST1";
      let sub = "SCIENCE";
      if (isNaN(grade)) {
        sub = koToEng[grade];
        sem = `${numToEng[semester - 1]}1`;
      } else {
        sub = "SCIENCE";
        sem = `${numToEng[grade - 1]}${semester}`;
      }
      setCurrentChapter({
        id: thisChap.id,
        description: thisChap.description,
        school: school,
        semester: sem,
        subject: sub,
      });
    }
  };

  const [hoveredChapter, setHoveredChapter] = useState(null);
  const ChapterBox = ({ thisChap, level }) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        key={thisChap.id}
        $level={level - 1}
        $isExpanded={thisChap.expansion}
        onMouseEnter={() => setHoveredChapter(thisChap.id)}
        onMouseLeave={() => setHoveredChapter(null)}
        onClick={() => {
          level > 2 && thisChap.children.length === 0 ? onChapterClick(thisChap) : onExpansion(thisChap);
        }}
      >
        <CHAPTERSCOPE.ExpansionSection $isExpanded={thisChap.expansion} $isHovering={hoveredChapter === thisChap.id}>
          {level > 2 && thisChap.children.length === 0 ? (
            <CHAPTERSCOPE.CheckBox
              $isChecked={currentChapter.id === thisChap.id}
              $isHovering={hoveredChapter === thisChap.id}
            >
              {currentChapter.id === thisChap.id ? <FontAwesomeIcon icon={faCheck} /> : ""}
            </CHAPTERSCOPE.CheckBox>
          ) : (
            <FontAwesomeIcon icon={thisChap.expansion ? faCaretDown : faCaretRight} />
          )}
        </CHAPTERSCOPE.ExpansionSection>
        <CHAPTERSCOPE.DescriptionBox $isHovering={hoveredChapter === thisChap.id}>
          {thisChap.description}
        </CHAPTERSCOPE.DescriptionBox>
      </CHAPTERSCOPE.ChapterLine>
    );
  };

  const renderChapters = (chapters, level = 1) => {
    return chapters.map((chapter) => (
      <CHAPTERSCOPE.ChapterContainer key={chapter.id}>
        <ChapterBox thisChap={chapter} level={level} />
        {chapter.expansion && level < 5 && (
          <React.Fragment>{renderChapters(chapter.children, level + 1)}</React.Fragment>
        )}
      </CHAPTERSCOPE.ChapterContainer>
    ));
  };

  return (
    <SELECTCHAP.Wrapper>
      <SELECTCHAP.ListOptionLine>
        {[0, 1, 2].map((opt) => (
          <SELECTCHAP.ListOptionBtn
            key={`listOption_${opt}`}
            $order={opt}
            $isSelected={questionCategory === opt}
            onClick={() => {
              setQuestionCategory(opt);
            }}
          >
            {categorySet[opt]}
          </SELECTCHAP.ListOptionBtn>
        ))}
      </SELECTCHAP.ListOptionLine>

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
        {simpleChapter.length > 0 && renderChapters(simpleChapter[0].children)}
      </CHAPTERSCOPE.ScopeSection>
    </SELECTCHAP.Wrapper>
  );
};

export default ChapterForNormal;

const leftSectionWidth = `47.5rem`;
const SELECTCHAP = {
  Wrapper: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    height: 80rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    margin-right: 1.5rem;
    overflow: hidden;
  `,
  ListOptionLine: styled.div`
    width: ${leftSectionWidth};
    height: 6rem;
    display: flex;
    flex-direction: row;
  `,
  ListOptionBtn: styled.button`
    width: 15.8rem;
    height: 6rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
    border-radius: ${({ $order }) => ($order === 0 ? `1rem 0 0 0` : $order === 2 ? `0 1rem 0 0` : `0rem`)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray40)};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
    ${({ $isSelected, $order, theme }) =>
      $isSelected
        ? $order === 0
          ? css`
              border-right: 0.1rem solid ${theme.colors.gray20};
            `
          : $order === 1
          ? css`
              border-right: 0.1rem solid ${theme.colors.gray20};
              border-left: 0.1rem solid ${theme.colors.gray20};
            `
          : css`
              border-left: 0.1rem solid ${theme.colors.gray20};
            `
        : css`
            border-bottom: 0.1rem solid ${theme.colors.gray20};
          `}
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
    width: 21rem;
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
    width: 5rem;
    height: 4rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: white;
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : `white`)};
    &:hover {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  SemsterOptionContainer: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 1.5rem;
  `,
  SemesterContainer: styled.div`
    margin-left: auto;
    border-left: 0.1rem solid ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 15rem;
    height: 6rem;
    padding-left: 1rem;
    padding-right: 1.5rem;
  `,
};

const CHAPTERSCOPE = {
  ScopeSection: styled.div`
    border-top: 5rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
    height: 61rem;
    margin-bottom: 1rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ChapterContainer: styled.div`
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: "opacity,transform";
    opacity: ${(props) => (props.isMovingUp || props.isMovingDown ? 0.0 : 1)};
    transform: ${(props) =>
      props.isMovingUp ? "translateY(-10px)" : props.isMovingDown ? "translateY(10px);" : "translateY(0)"};
  `,

  ChapterLine: styled.div`
    width: ${({ $level }) => 47 - $level * 2.5}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    margin-left: ${({ $level }) => $level * 2.5}rem;
    padding-right: 1rem;
    cursor: pointer;
  `,
  ExpansionSection: styled.div`
    height: 4rem;
    width: 5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: ${({ $isExpanded, theme }) => ($isExpanded ? theme.colors.deepDark : theme.colors.unselected)};
    cursor: pointer;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray40};
          `};
  `,
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem
      ${({ $isChecked, $isHovering, theme }) =>
        $isChecked || $isHovering ? theme.colors.mainColor : theme.colors.unselected}
      solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    overflow: hidden;
  `,
  DescriptionBox: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.5rem;
    margin-left: -0.25rem;
    font-size: 1.75rem;
    font-weight: 600;
    width: 35rem;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray40};
          `};
  `,
};
