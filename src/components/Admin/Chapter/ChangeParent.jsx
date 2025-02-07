import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import useGetChapters from "../../../libs/apis/Admin/postChapterGet";
import { motion } from "framer-motion";
import usePostUpdateOrder from "../../../libs/apis/Admin/postChapterParentUpdate";

const ChangeParent = ({ movingChapter, setMovingChapter, targetChapter, setTargetChapter }) => {
  const { chapters, getChapters } = useGetChapters();
  const { postUpdateOrder } = usePostUpdateOrder();

  const [simpleChapter, setSimpleChapters] = useState([]);

  const [school, setSchool] = useState("초");
  const [grade, setGrade] = useState("3");
  const [semester, setSemester] = useState("1");
  const schoolOptions = ["초", "중", "고"];
  const grades = { 초: ["3", "4", "5", "6"], 중: ["1", "2", "3"], 고: ["1", "물리", "화학", "생명", "지구"] };

  const changeSchool = (e) => {
    const newValue = e.target.value;
    setSchool(newValue);
    if (newValue === "초") setGrade("3");
    else setGrade("1");
  };
  const changeGrade = (e) => {
    setGrade(e.target.value);
  };

  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
  const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
  useEffect(() => {
    if (movingChapter.id !== null) {
      let sem = "FIRST1";
      let sub = "SCIENCE";
      if (isNaN(grade)) {
        sub = koToEng[grade];
        sem = `${numToEng[semester - 1]}1`;
      } else {
        sub = "SCIENCE";
        sem = `${numToEng[grade - 1]}${semester}`;
      }

      setTargetChapter({ id: null, description: null });
      getChapters(schoolToSend[school], sem, sub);
    } else {
      setSimpleChapters([]);
    }
  }, [movingChapter, school, grade, semester]);

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
    if (targetChapter.id === thisChap.id) {
      setTargetChapter({ id: null, description: null, parentId: null });
    } else {
      setTargetChapter({ id: thisChap.id, description: thisChap.description });
    }
  };

  const cancleMoving = () => {
    setMovingChapter({ id: null, description: null, parentId: null, moved: false });
  };

  const moveChapter = async () => {
    await postUpdateOrder(targetChapter.id, movingChapter.id, []);
    setTargetChapter({ id: null, description: null, parentId: null });
    setMovingChapter({ id: null, description: null, parentId: null, moved: true });
  };

  const [hoveredChapter, setHoveredChapter] = useState(null);

  const ChapterBox = ({ thisChap, level, restricted = true }) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        key={thisChap.id}
        $level={level - 1}
        $isExpanded={thisChap.expansion}
        onMouseEnter={() => setHoveredChapter(thisChap.id)}
        onMouseLeave={() => setHoveredChapter(null)}
        onClick={() => onExpansion(thisChap)}
      >
        <CHAPTERSCOPE.ExpansionSection $isExpanded={thisChap.expansion}>
          {level < 4 || (school === "고" && level < 5) ? (
            <FontAwesomeIcon icon={thisChap.expansion ? faCaretDown : faCaretRight} />
          ) : (
            <React.Fragment />
          )}
        </CHAPTERSCOPE.ExpansionSection>
        {restricted ? (
          <CHAPTERSCOPE.BlockedBox>
            <FontAwesomeIcon icon={faXmark} />
          </CHAPTERSCOPE.BlockedBox>
        ) : level < 4 || (school === "고" && level === 4) ? (
          <CHAPTERSCOPE.CheckBox
            $isChecked={targetChapter.id === thisChap.id}
            $isHovering={hoveredChapter === thisChap.id}
            onClick={(e) => {
              e.stopPropagation();
              onChapterClick(thisChap);
            }}
          >
            {targetChapter.id === thisChap.id ? <FontAwesomeIcon icon={faCheck} /> : ""}
          </CHAPTERSCOPE.CheckBox>
        ) : (
          <React.Fragment />
        )}
        <CHAPTERSCOPE.DescriptionBox
          $isUnabled={movingChapter.parentId === thisChap.id || movingChapter.id === thisChap.id}
          $isHovering={hoveredChapter === thisChap.id}
        >
          {thisChap.description}
          {restricted
            ? movingChapter.parentId === thisChap.id
              ? " (기존 위치)"
              : movingChapter.id === thisChap.id
              ? " (선택 단원)"
              : " (하위 단원)"
            : ""}
        </CHAPTERSCOPE.DescriptionBox>
      </CHAPTERSCOPE.ChapterLine>
    );
  };
  const renderChapters = (chapters, level = 1, restricted = false) => {
    return chapters.map((chapter) => {
      const isRestricted = restricted || movingChapter.parentId === chapter.id || movingChapter.id === chapter.id;

      return (
        <CHAPTERSCOPE.ChapterContainer key={chapter.id}>
          <ChapterBox thisChap={chapter} level={level} restricted={isRestricted} />
          {chapter.expansion && level < 5 && (
            <React.Fragment>{renderChapters(chapter.children, level + 1, isRestricted)}</React.Fragment>
          )}
        </CHAPTERSCOPE.ChapterContainer>
      );
    });
  };

  return (
    <SELECTCHAP.Wrapper $hideElements={movingChapter.id === null && simpleChapter.length === 0}>
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
      <SCHOOLSEM.RowContainer>
        <SCHOOLSEM.SemsterOptionContainer>
          {grades[school].map((opt, index) => (
            <SCHOOLSEM.DetailBtn key={index} $isSelected={grade === opt} value={opt} onClick={changeGrade}>
              {opt}
            </SCHOOLSEM.DetailBtn>
          ))}
          <SCHOOLSEM.SemesterContainer>
            <SCHOOLSEM.DetailBtn $isSelected={semester === "1"} onClick={() => setSemester("1")}>
              1
            </SCHOOLSEM.DetailBtn>
            <SCHOOLSEM.DetailBtn $isSelected={semester === "2"} onClick={() => setSemester("2")}>
              2
            </SCHOOLSEM.DetailBtn>
          </SCHOOLSEM.SemesterContainer>
        </SCHOOLSEM.SemsterOptionContainer>
      </SCHOOLSEM.RowContainer>

      <CHAPTERSCOPE.ScopeSection>{renderChapters(simpleChapter)}</CHAPTERSCOPE.ScopeSection>
      <CHAPTERSCOPE.BtnLine>
        <CHAPTERSCOPE.CancleBtn onClick={cancleMoving}>이동 취소</CHAPTERSCOPE.CancleBtn>
        <CHAPTERSCOPE.SubmitBtn onClick={moveChapter} disabled={targetChapter.id === null}>
          소속을 선택 단원으로 변경
        </CHAPTERSCOPE.SubmitBtn>
      </CHAPTERSCOPE.BtnLine>
    </SELECTCHAP.Wrapper>
  );
};

export default ChangeParent;

const leftSectionWidth = `65rem`;
const SELECTCHAP = {
  Wrapper: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    height: 80rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    margin-right: 1.5rem;
    overflow: hidden;
    ${({ $hideElements, theme }) =>
      $hideElements
        ? css`
            background-color: ${theme.colors.gray30};
            :nth-child(n) {
              display: none;
            }
          `
        : css``}
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
  ChangeBtn: styled.button`
    width: 22.2rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    color: ${({ theme }) => theme.colors.gray60};
    margin-left: auto;
    margin-right: 2.3rem;
  `,
};

const CHAPTERSCOPE = {
  ScopeSection: styled(motion.div)`
    border-top: 5rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
    height: 61rem;
    margin-bottom: 1rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    /* 스크롤바 전체 너비 설정 */
    &::-webkit-scrollbar {
      width: 1rem; /* 세로 스크롤바의 너비 */
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
  ChapterContainer: styled.div`
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: "opacity,transform";
    opacity: ${(props) => (props.isMovingUp || props.isMovingDown ? 0.0 : 1)};
    transform: ${(props) =>
      props.isMovingUp ? "translateY(-10px)" : props.isMovingDown ? "translateY(10px);" : "translateY(0)"};
  `,

  InnerChapterContainer: styled.div`
    //padding-left: ${(props) => props.level * 20}px;
    // Add other styles as needed
  `,
  ChapterLine: styled.div`
    width: ${({ $level }) => 64 - $level * 2.5}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    margin-left: ${({ $level }) => $level * 2.5}rem;
    padding-right: 1rem;
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
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 1.3rem;
    border: 0.2rem ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : theme.colors.unselected)} solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    overflow: hidden;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
    cursor: pointer;
  `,
  BlockedBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 1.3rem;
    border: 0.2rem ${({ theme }) => theme.colors.warning} solid;
    color: white;
    background-color: ${({ theme }) => theme.colors.warning};
    font-size: 1.9rem;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
  `,
  DescriptionBox: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.5rem;
    margin-left: -0.25rem;
    font-size: 1.75rem;
    font-weight: 600;
    width: 45rem;
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
  BtnLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 65rem;
    padding-inline: 2.5rem;
  `,
  CancleBtn: styled.button`
    width: 15rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.warning};
  `,
  SubmitBtn: styled.button`
    width: 30rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.mainColor};
    margin-left: auto;
    &:disabled {
      cursor: default;
      background-color: ${({ theme }) => theme.colors.gray30};
    }
  `,
};
