import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCaretDown, faCaretRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import usePostGetChapters from "../../../../../../libs/apis/Teacher/Prepare/postGetChapters";

const SelectQuestionScope = ({
  setSchool,
  setSemester,
  setGrade,
  simpleChapter,
  setSimpleChapters,
  setSelectedChapters,
}) => {
  const { chapterData, getChapters } = usePostGetChapters();

  const [renderingSchool, setRenderingSchool] = useState("초");
  const schoolOptions = ["초", "중", "고"];
  const grades = {
    초: ["3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2"],
    중: ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"],
    고: ["1-1", "1-2", "물 1", "물 2", "화 1", "화 2", "생 1", "생 2", "지 1", "지 2"],
  };
  const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
  const koToEng = { 물: "PHYSICS", 화: "CHEMISTRY", 생: "BIOLOGY", 지: "EARTH_SCIENCE" };
  const onGradeClick = (opt) => {
    if (
      simpleChapter.length > 0 &&
      simpleChapter.some(
        (chapter) =>
          (chapter.description.slice(0, 1) === renderingSchool && chapter.description.slice(-3) === opt) ||
          chapter.description[0] + chapter.description.slice(2) === opt
      )
    ) {
      const filteredChaps = simpleChapter.filter(
        (chapter) =>
          (chapter.description.slice(0, 1) !== renderingSchool || chapter.description.slice(-3) !== opt) &&
          chapter.description[0] + chapter.description.slice(2) !== opt
      );
      const { selectedChapters, lastSelectedDescription } = collectSelectedChapters(filteredChaps);

      if (["초", "중", "고"].includes(lastSelectedDescription[0])) {
        setSchool(lastSelectedDescription[0]);
        setGrade(lastSelectedDescription.slice(2, 3));
        setSemester(lastSelectedDescription.slice(-1));
      } else {
        setSchool("고");
        setGrade(lastSelectedDescription[0]);
        setSemester(lastSelectedDescription.slice(-1));
      }
      setSimpleChapters(filteredChaps);
      setSelectedChapters(selectedChapters);
    } else {
      let slicedGrade = opt.slice(0, 1);
      let slicedSemester = opt.slice(2);

      let sem = "FIRST1";
      let sub = "SCIENCE";
      if (isNaN(slicedGrade)) {
        sub = koToEng[slicedGrade];
        sem = `${numToEng[slicedSemester - 1]}1`;
      } else {
        sub = "SCIENCE";
        sem = `${numToEng[slicedGrade - 1]}${slicedSemester}`;
      }

      getChapters(renderingSchool, sem, sub);
    }
  };
  const gradesUponSchool = () => {
    return (
      <SCHOOLSEM.SemsterOptionContainer>
        {grades[renderingSchool].map((opt, index) => (
          <SCHOOLSEM.RoundBtn
            key={index}
            $isSelected={
              simpleChapter.length > 0 &&
              simpleChapter.some(
                (chapter) =>
                  (chapter.description.slice(0, 1) === renderingSchool && chapter.description.slice(-3) === opt) ||
                  chapter.description.slice(0, 1) + chapter.description.slice(2) === opt
              )
            }
            value={opt}
            onClick={() => {
              onGradeClick(opt);
            }}
          >
            {opt.split("").join(" ")}
          </SCHOOLSEM.RoundBtn>
        ))}
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  const simplifyChapter = (array) => {
    if (array.length > 0) {
      const mapChapterStructure = (chapter) => {
        const { id, description, children } = chapter;
        return {
          id,
          description,
          expansion: false,
          children: children.map(mapChapterStructure),
        };
      };
      const { id, description, children } = array[0];
      const newChapters = { id, description, expansion: true, children: children.map(mapChapterStructure) };
      return newChapters;
    } else return [];
  };
  const sortChapters = (chapters) => {
    const order = ["초", "중", "고", "물", "화", "생", "지"];

    return chapters.sort((a, b) => {
      // 첫 글자가 정렬 기준에 있는 경우
      const indexA = order.indexOf(a.description[0]);
      const indexB = order.indexOf(b.description[0]);

      if (indexA !== indexB) {
        return indexA - indexB; // 첫 글자 기준으로 정렬
      }

      // 첫 글자가 동일하거나 정렬 기준에 없는 경우, 나머지 기준으로 오름차순 정렬
      return a.description.localeCompare(b.description);
    });
  };
  useEffect(() => {
    if (chapterData.length !== 0) {
      const simpleArr = simplifyChapter(chapterData);
      setSimpleChapters((prev) =>
        prev.every((chap) => chap.id !== simpleArr.id)
          ? sortChapters([...prev, { ...simpleArr, expansion: prev.length > 0 ? false : true }])
          : [...prev]
      );
    }
  }, [chapterData]);

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

  // 1. 상태 업데이트를 위한 유틸리티 함수들
  const setSelectedRecursively = (chapter, selected) => {
    return {
      ...chapter,
      selected,
      expansion: selected,
      children: chapter.children ? chapter.children.map((child) => setSelectedRecursively(child, selected)) : [],
    };
  };

  const updateChapterSelection = (chapter, targetId, select) => {
    if (chapter.id === targetId) {
      // 클릭된 챕터와 모든 하위 챕터의 상태를 업데이트
      return setSelectedRecursively(chapter, select);
    }

    if (chapter.children.length > 0) {
      // 하위 챕터들을 재귀적으로 업데이트
      const updatedChildren = chapter.children.map((child) => updateChapterSelection(child, targetId, select));

      // 모든 하위 챕터가 선택된 경우 상위 챕터도 선택
      const allChildrenSelected = updatedChildren.every((child) => child.selected);

      return {
        ...chapter,
        selected: allChildrenSelected,
        children: updatedChildren,
      };
    }
    // 하위 챕터가 없는 경우 현재 챕터만 반환
    return { ...chapter };
  };

  // 2. onChapterClick 함수
  const onChapterClick = (thisChap) => {
    const isSelecting = !thisChap.selected;
    const updatedChapters = simpleChapter.map((chapter) => updateChapterSelection(chapter, thisChap.id, isSelecting));

    const { selectedChapters, lastSelectedDescription } = collectSelectedChapters(updatedChapters);

    if (["초", "중", "고"].includes(lastSelectedDescription[0])) {
      setSchool(lastSelectedDescription[0]);
      setGrade(lastSelectedDescription.slice(2, 3));
      setSemester(lastSelectedDescription.slice(-1));
    } else {
      setSchool("고");
      setGrade(lastSelectedDescription[0]);
      setSemester(lastSelectedDescription.slice(-1));
    }
    setSimpleChapters(updatedChapters);
    setSelectedChapters(selectedChapters);
  };

  const collectSelectedChapters = (chapters, level1Description = null) => {
    let selectedChapters = [];
    let lastLevel1Description = level1Description;
    let lastSelectedDescription = " ";

    chapters.forEach((chapter) => {
      // level 1 chapter의 description을 업데이트
      if (level1Description === null) {
        lastLevel1Description = chapter.description;
      }

      if (chapter.selected && chapter.children.length === 0) {
        selectedChapters.push({ id: chapter.id, description: chapter.description });
        lastSelectedDescription = lastLevel1Description; // 마지막 level 1 description 저장
      }

      if (chapter.children.length > 0) {
        const { selectedChapters: childSelectedChapters, lastSelectedDescription: childLastSelectedDescription } =
          collectSelectedChapters(chapter.children, lastLevel1Description);

        selectedChapters = selectedChapters.concat(childSelectedChapters);

        // childLastSelectedDescription이 공백이 아닌 경우에만 업데이트
        if (childLastSelectedDescription !== " ") {
          lastSelectedDescription = childLastSelectedDescription;
        }
      }
    });

    return { selectedChapters, lastSelectedDescription };
  };

  const ChapterBox = ({ thisChap, level }) => {
    return (
      <CQP.ChapterLine
        $level={level - 1}
        onClick={() => {
          thisChap.children.length > 0 && onExpansion(thisChap);
        }}
      >
        {thisChap.children.length > 0 ? (
          <CQP.ExpansionSection $isExpanded={thisChap.expansion}>
            <FontAwesomeIcon icon={thisChap.expansion & (level < 5) ? faCaretDown : faCaretRight} />
          </CQP.ExpansionSection>
        ) : (
          <CQP.EmptyBox>
            <FontAwesomeIcon icon={faCircle} />
          </CQP.EmptyBox>
        )}
        <CQP.CheckBox
          onClick={(e) => {
            e.stopPropagation();
            onChapterClick(thisChap);
          }}
          $isChecked={thisChap.selected}
        >
          {thisChap.selected ? <FontAwesomeIcon icon={faCheck} /> : ""}
        </CQP.CheckBox>
        <CQP.DescriptionBox $isChecked={thisChap.selected}>{thisChap.description}</CQP.DescriptionBox>
      </CQP.ChapterLine>
    );
  };
  const renderChapters = (chapters, level = 1) => {
    return chapters.map((chapter) => (
      <CQP.ChapterContainer key={chapter.id}>
        <ChapterBox thisChap={chapter} level={level} />
        {chapter.expansion && level < 5 && (
          <React.Fragment>{renderChapters(chapter.children, level + 1)}</React.Fragment>
        )}
      </CQP.ChapterContainer>
    ));
  };

  return (
    <React.Fragment>
      <SCHOOLSEM.RowContainer>
        <SCHOOLSEM.SchoolOptionContainer>
          <SCHOOLSEM.BtnContainer>
            {schoolOptions.map((opt) => (
              <SCHOOLSEM.DetailBtn
                key={opt}
                $isSelected={renderingSchool === opt}
                onClick={() => setRenderingSchool(opt)}
              >
                {opt}
              </SCHOOLSEM.DetailBtn>
            ))}
          </SCHOOLSEM.BtnContainer>
        </SCHOOLSEM.SchoolOptionContainer>
        {gradesUponSchool()}
      </SCHOOLSEM.RowContainer>
      <CQP.Wrapper>
        {simpleChapter.length > 0 ? (
          renderChapters(simpleChapter)
        ) : (
          <CQP.ChapterContainer>
            <CQP.ChapterLine $level={0}>
              <CQP.EmptyBox>
                <FontAwesomeIcon icon={faCircle} />
              </CQP.EmptyBox>
              <CQP.DescriptionBox>단원 범위 선택을 위해 상단의 학년을 클릭해주세요.</CQP.DescriptionBox>
            </CQP.ChapterLine>
          </CQP.ChapterContainer>
        )}
      </CQP.Wrapper>
      ;
    </React.Fragment>
  );
};

export default SelectQuestionScope;

const SCHOOLSEM = {
  RowContainer: styled.div`
    width: 86.5rem;
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
    background-color: white;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    height: 6rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  BtnContainer: styled.div`
    width: 18.5rem;
    display: flex;
    align-items: center;
    flex-direction: row;
  `,
  DetailBtn: styled.button`
    width: 5rem;
    height: 4rem;
    margin-right: 1rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: white;
    border: solid ${({ $isSelected, theme }) => ($isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem black`)};
    &:hover {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  SemsterOptionContainer: styled.div`
    min-width: 44.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 0.5rem;
  `,
  SemesterContainer: styled.div`
    margin-left: auto;
    border-left: 0.1rem solid ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6rem;
    padding-left: 0.5rem;
  `,
  RoundBtn: styled.button`
    width: 5rem;
    height: 4rem;
    border-radius: 0.6rem;
    margin-left: 1rem;
    margin-right: 0.4rem;
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray50)};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem ${theme.colors.unselected}`};
    &:hover {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  InitBtn: styled.button`
    width: 17rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    color: ${({ theme }) => theme.colors.gray60};
    margin-left: auto;
    margin-right: 0.5rem;
  `,
};
const CQP = {
  Wrapper: styled.div`
    overflow-y: auto;
    width: 96%;
    height: 61.5rem;
    padding-left: 1rem;
    &::-webkit-scrollbar {
      width: 1.5rem;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ChapterContainer: styled.div`
    ${({ theme }) =>
      css`
        animation: ${keyframes`
      0% {
        background-color:${theme.colors.brightMain};
      }
      100% {
        background-color: none;
      }`} 1s ease-in-out;
        transition: background-color 1s ease-in-out;
      `}
  `,

  ChapterLine: styled.div`
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    margin-left: ${({ $level }) => $level * 2.8}rem;
  `,
  ExpansionSection: styled.div`
    width: 3rem;
    text-align: center;
    align-content: center;
    justify-items: center;
    font-size: 2rem;
    color: ${({ $isExpanded, theme }) => ($isExpanded ? theme.colors.deepDark : theme.colors.unselected)};
    cursor: pointer;
  `,
  EmptyBox: styled.div`
    width: 3rem;
    text-align: center;
    align-content: center;
    justify-items: center;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.unselected};
    cursor: default;
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
    cursor: pointer;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
  `,
  DescriptionBox: styled.div`
    margin-left: 0.75rem;
    font-size: 1.75rem;
    font-weight: 600;
    color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.gray90 : theme.colors.gray50)};
    width: 60rem;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
};
