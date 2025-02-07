import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import useGetChapters from "../../../../libs/apis/Admin/postChapterGet";

const ChapterForQuiz = ({
  currentChapter,
  setCurrentChapter,
  school,
  setSchool,
  grade,
  setGrade,
  semester,
  setSemester,
  goBack,
}) => {
  const { chapters, getChapters } = useGetChapters();
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
  const semToEng = ["FIRST1", "SECOND1"];
  useEffect(() => {
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${semToEng[semester - 1]}`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }

    setCurrentChapter({ id: null, description: null, school: school });
    getChapters(schoolToSend[school], sem, sub);
  }, [school, grade, semester]);

  /**simplifyChapter*/
  useEffect(() => {
    const newChapters = [];
    for (let i = 0; i < chapters.length; i++) {
      const { id, description } = chapters[i];
      newChapters.push({ id, description, expansion: false, children: [] });
      for (let j = 0; j < chapters[i].children.length; j++) {
        const { id, description } = chapters[i].children[j];
        newChapters[i].children.push({ id, description, expansion: false, children: [] });
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
    if (currentChapter.id === thisChap.id) {
      setCurrentChapter({ id: null, description: null, school: school });
    } else {
      let sem = "FIRST1";
      let sub = "SCIENCE";
      if (isNaN(grade)) {
        sub = koToEng[grade];
        sem = `${semToEng[semester - 1]}`;
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
  const ChapterBox = (thisChap, level) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        key={thisChap.id}
        $level={level - 1}
        $isExpanded={thisChap.expansion}
        onMouseEnter={() => setHoveredChapter(thisChap.id)}
        onMouseLeave={() => setHoveredChapter(null)}
        onClick={() => {
          {
            level < 3 ? onExpansion(thisChap) : onChapterClick(thisChap);
          }
        }}
      >
        <CHAPTERSCOPE.ExpansionSection $isExpanded={thisChap.expansion} $isHovering={hoveredChapter === thisChap.id}>
          {level < 3 ? (
            <FontAwesomeIcon icon={thisChap.expansion & (level < 3) ? faCaretDown : faCaretRight} />
          ) : (
            <CHAPTERSCOPE.CheckBox
              $isChecked={currentChapter.id === thisChap.id}
              $isHovering={hoveredChapter === thisChap.id}
            >
              {currentChapter.id === thisChap.id ? <FontAwesomeIcon icon={faCheck} /> : ""}
            </CHAPTERSCOPE.CheckBox>
          )}
        </CHAPTERSCOPE.ExpansionSection>
        <CHAPTERSCOPE.DescriptionBox $isHovering={hoveredChapter === thisChap.id}>
          {thisChap.description}
        </CHAPTERSCOPE.DescriptionBox>
      </CHAPTERSCOPE.ChapterLine>
    );
  };

  return (
    <OO.Wrapper>
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
            {ChapterBox(thisChap, 1)}
            {thisChap.expansion
              ? thisChap.children.map((childChap, cIndex) => (
                  <div key={cIndex}>
                    {ChapterBox(childChap, 2)}
                    {childChap.expansion
                      ? childChap.children.map((grandchildChap) => ChapterBox(grandchildChap, 3))
                      : null}
                  </div>
                ))
              : null}
          </div>
        ))}
      </CHAPTERSCOPE.ScopeSection>
      <CHAPTERSCOPE.GoBackBtn onClick={goBack}>돌아가기</CHAPTERSCOPE.GoBackBtn>
    </OO.Wrapper>
  );
};

export default ChapterForQuiz;

const leftSectionWidth = `47.5rem`;
const OO = {
  Wrapper: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    height: 80rem;
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    margin-right: 1.5rem;
    overflow: hidden;
  `,
  TopMargin: styled.div`
    height: 6rem;
    background-color: ${({ theme }) => theme.colors.background};
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

  ChapterLine: styled.div`
    width: ${({ $level }) => 47 - $level * 2.8}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    //border: 0.1rem black solid;
    margin-left: ${({ $level }) => $level * 2.8}rem;
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
  GoBackBtn: styled.button`
    width: 15rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.warning};
    margin-left: 2rem;
    margin-right: 4rem;
  `,
};
