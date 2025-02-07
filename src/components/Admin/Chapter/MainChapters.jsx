import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faArrowUpWideShort,
  faCaretDown,
  faCaretRight,
  faPenToSquare,
  faPlus,
  faRightFromBracket,
  faSave,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import useGetChapters from "../../../libs/apis/Admin/postChapterGet";
import usePostAddChapter from "../../../libs/apis/Admin/postChapterAdd";
import usePatchUpdateChapter from "../../../libs/apis/Admin/patchChapterUpdate";
import useDeleteChapter from "../../../libs/apis/Admin/postChapterDelete";
import usePostUpdateOrder from "../../../libs/apis/Admin/postChapterParentUpdate";
import { motion } from "framer-motion";
import WarningModal from "../Concept/WarningModal";
const MainChapter = ({ movingChapter, setMovingChapter }) => {
  const { chapters, getChapters } = useGetChapters();
  const { newId, postAddChapter } = usePostAddChapter();
  const { patchUpdateChapter } = usePatchUpdateChapter();
  const { deleteChapter } = useDeleteChapter();
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
  const gradesUponSchool = () => {
    return (
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
    );
  };

  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
  const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
  useEffect(() => {
    setSimpleChapters([]);
    if (school !== null) {
      let sem = "FIRST1";
      let sub = "SCIENCE";
      if (isNaN(grade)) {
        sub = koToEng[grade];
        sem = `${numToEng[semester - 1]}1`;
      } else {
        sub = "SCIENCE";
        sem = `${numToEng[grade - 1]}${semester}`;
      }

      getChapters(schoolToSend[school], sem, sub);
    } else {
      getChapters("ELEMENTARY", "FIRST1", "SCIENCE");
    }
    setMovingChapter({ id: null, description: null, parentId: null, moved: false });
    setEditMode({});
  }, [school, grade, semester]);
  useEffect(() => {
    if (movingChapter.moved) {
      if (school !== null) {
        let sem = "FIRST1";
        let sub = "SCIENCE";
        if (isNaN(grade)) {
          sub = koToEng[grade];
          sem = `${numToEng[semester - 1]}1`;
        } else {
          sub = "SCIENCE";
          sem = `${numToEng[grade - 1]}${semester}`;
        }
        getChapters(schoolToSend[school], sem, sub);
      } else {
        getChapters("ELEMENTARY", "FIRST1", "SCIENCE");
      }
      setMovingChapter({ id: null, description: null, parentId: null, moved: false });
      setEditMode({});
    }
  }, [movingChapter]);

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

  const addEmptyChapter = (id) => {
    const addChapterRecursively = (chapters) => {
      return chapters.map((chapter) => {
        if (chapter.id === id) {
          return {
            ...chapter,
            expansion: true,
            children: [...chapter.children, { id: 0, description: "", expansion: false, children: [] }],
          };
        } else {
          return {
            ...chapter,
            children: addChapterRecursively(chapter.children),
          };
        }
      });
    };

    if (Object.keys(editMode).length === 0) {
      setEditMode({ 0: true });

      if (id === null) {
        setSimpleChapters([...simpleChapter, { id: 0, description: "", expansion: false, children: [] }]);
      } else {
        const updatedSimpleChapter = addChapterRecursively(simpleChapter);
        setSimpleChapters(updatedSimpleChapter);
      }
    }
  };

  const removeChapter = (id) => {
    const removeChildById = (children, targetId) => {
      return children
        .filter((child) => child.id !== targetId)
        .map((child) => ({
          ...child,
          children: removeChildById(child.children, targetId),
        }));
    };

    const updatedSimpleChapter = simpleChapter
      .filter((chapter) => chapter.id !== id)
      .map((chapter) => ({
        ...chapter,
        children: removeChildById(chapter.children, id),
      }));

    setSimpleChapters(updatedSimpleChapter);
  };

  const putChapter = async (parentId, description) => {
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${numToEng[semester - 1]}1`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }

    await postAddChapter(school === null ? "HIGH" : schoolToSend[school], sem, sub, parentId, description);
  };
  useEffect(() => {
    const updateChapterIds = (chapters, newId) => {
      return chapters.map((chapter) => {
        if (chapter.id === 0) {
          return { ...chapter, id: newId };
        } else if (chapter.children && chapter.children.length > 0) {
          return {
            ...chapter,
            children: updateChapterIds(chapter.children, newId),
          };
        } else {
          return chapter;
        }
      });
    };

    const updatedSimpleChapter = updateChapterIds(simpleChapter, newId);
    setSimpleChapters(updatedSimpleChapter);
  }, [newId]);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const deleteChapterFunc = async () => {
    await deleteChapter(deleteTargetId);
    removeChapter(deleteTargetId);
    setDeleteTargetId(null);
  };
  const [editMode, setEditMode] = useState({}); // 각 챕터의 수정 모드를 관리하는 상태

  const rollbackDescription = (thisChap) => {
    const value = editMode.des; // editMode에서 des 값을 가져옵니다.

    const updatedSimpleChapter = simpleChapter.map((chapter) => {
      if (chapter.id === thisChap.id) {
        return { ...chapter, description: value };
      } else {
        const updatedChildren = chapter.children.map((childChap) => {
          if (childChap.id === thisChap.id) {
            return { ...childChap, description: value };
          } else {
            return childChap;
          }
        });
        return { ...chapter, children: updatedChildren };
      }
    });

    const removeChildById = (children, targetId) => {
      return children
        .filter((child) => child.id !== targetId)
        .map((child) => ({
          ...child,
          children: removeChildById(child.children, targetId),
        }));
    };

    const nextFilteredOne = updatedSimpleChapter
      .filter((chapter) => chapter.id !== 0)
      .map((chapter) => ({
        ...chapter,
        children: removeChildById(chapter.children, 0),
      }));

    setSimpleChapters(nextFilteredOne);
  };

  const handleDescriptionChange = (e, thisChap) => {
    const { value } = e.target;

    const updateDescriptionRecursively = (chapters) => {
      return chapters.map((chapter) => {
        if (chapter.id === thisChap.id) {
          return { ...chapter, description: value };
        } else {
          return {
            ...chapter,
            children: updateDescriptionRecursively(chapter.children),
          };
        }
      });
    };

    const updatedSimpleChapter = updateDescriptionRecursively(simpleChapter);
    setSimpleChapters(updatedSimpleChapter);
  };

  const handleDoubleClick = (thisChap) => {
    if (Object.keys(editMode).length === 0) setEditMode({ [thisChap.id]: true, des: thisChap.description });
  };

  const handleKeyPress = (e, thisChap, parentId) => {
    if (e.key === "Enter") {
      if (thisChap.id === 0) putChapter(parentId, e.target.value);
      else patchUpdateChapter(thisChap.id, e.target.value);
      setEditMode({});
    }
  };
  const [hoveredChapter, setHoveredChapter] = useState(null);

  const [movingUpId, setMovingUpId] = useState(null);
  const [movingDownId, setMovingDownId] = useState(null);

  const moveChapterDownAtSameLevel = (parentId, targetId) => {
    const findAndSetAdjacentIds = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId && i < nodes.length - 1) {
          setMovingUpId(nodes[i + 1].id);
          setMovingDownId(targetId);
          return true; // Target과 이전 요소를 찾은 후 루프 종료
        } else if (nodes[i].children && nodes[i].children.length > 0) {
          if (findAndSetAdjacentIds(nodes[i].children)) return true; // 재귀적으로 하위 노드에서 찾기
        }
      }
      return false;
    };

    findAndSetAdjacentIds([...simpleChapter]);

    const swapChapters = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId && i < nodes.length - 1) {
          setMovingUpId(nodes[i + 1].id);
          // Swap with the next chapter in the same level
          const temp = nodes[i];
          nodes[i] = nodes[i + 1];
          nodes[i + 1] = temp;
          postUpdateOrder(
            parentId,
            nodes[i].id,
            nodes.map((node) => node.id)
          );

          return true; // Stop DFS as we found and swapped the target
        } else if (nodes[i].children && nodes[i].children.length > 0) {
          const found = swapChapters(nodes[i].children);
          if (found) return true; // Stop DFS as we found and swapped the target
        }
      }
      return false; // Continue DFS
    };
    setTimeout(() => {
      const updatedChapters = [...simpleChapter]; // Create a shallow copy to avoid direct mutation
      swapChapters(updatedChapters);
      setSimpleChapters(updatedChapters);

      setMovingUpId(null);
      setMovingDownId(null);
    }, 300);
  };
  const moveChapterUpAtSameLevel = (parentId, targetId) => {
    // Target과 그 이전 요소의 ID를 찾기 위한 함수
    const findAndSetAdjacentIds = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId && i > 0) {
          setMovingUpId(targetId);
          setMovingDownId(nodes[i - 1].id);
          return true; // Target과 이전 요소를 찾은 후 루프 종료
        } else if (nodes[i].children && nodes[i].children.length > 0) {
          if (findAndSetAdjacentIds(nodes[i].children)) return true; // 재귀적으로 하위 노드에서 찾기
        }
      }
      return false;
    };

    findAndSetAdjacentIds([...simpleChapter]);

    // 요소를 스왑하는 함수
    const swapChapters = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId && i > 0) {
          const temp = nodes[i];
          nodes[i] = nodes[i - 1];
          nodes[i - 1] = temp;
          postUpdateOrder(
            parentId,
            nodes[i].id,
            nodes.map((node) => node.id)
          );
          return true; // 스왑 완료 후 종료
        } else if (nodes[i].children && nodes[i].children.length > 0) {
          if (swapChapters(nodes[i].children)) return true; // 재귀적으로 하위 노드에서 찾기
        }
      }
      return false;
    };

    setTimeout(() => {
      const updatedChapters = [...simpleChapter]; // 상태 복사를 통해 직접적인 변경 방지
      swapChapters(updatedChapters);
      setSimpleChapters(updatedChapters);

      // 애니메이션이 끝난 후 상태 초기화
      setMovingUpId(null);
      setMovingDownId(null);
    }, 300); // 애니메이션과 동일한 지속 시간 설정
  };
  const moveChapterToAnother = (targetChap, parentId) => {
    setMovingChapter({ id: targetChap.id, description: targetChap.description, parentId: parentId, moved: false });
  };

  const ChapterBox = (thisChap, level, parentId) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        key={thisChap.id}
        $level={level - 1}
        $isExpanded={thisChap.expansion}
        $isMoving={thisChap.id === movingChapter.id}
        onMouseEnter={() => setHoveredChapter(thisChap.id)}
        onMouseLeave={() => setHoveredChapter(null)}
      >
        <CHAPTERSCOPE.ExpansionSection
          $isExpanded={thisChap.expansion}
          onClick={() => {
            onExpansion(thisChap);
          }}
        >
          <FontAwesomeIcon icon={thisChap.expansion && thisChap.children.length > 0 ? faCaretDown : faCaretRight} />
        </CHAPTERSCOPE.ExpansionSection>
        <CHAPTERSCOPE.DescriptionBox
          $isHovering={hoveredChapter === thisChap.id}
          onDoubleClick={() => handleDoubleClick(thisChap)}
        >
          {editMode[thisChap.id] ? (
            <CHAPTERSCOPE.DescriptionInput
              type="text"
              value={thisChap.description}
              onChange={(e) => handleDescriptionChange(e, thisChap)}
              onKeyDown={(e) => handleKeyPress(e, thisChap, parentId)}
              placeholder="한번에 하나만 수정 가능"
              autoFocus
            />
          ) : (
            thisChap.description
          )}
        </CHAPTERSCOPE.DescriptionBox>
        {(hoveredChapter === thisChap.id || editMode[thisChap.id]) && (
          <CHAPTERSCOPE.BtnContainer onMouseDown={(e) => e.preventDefault()} onMouseUp={(e) => e.stopPropagation()}>
            {editMode[thisChap.id] ? (
              <React.Fragment>
                <CHAPTERSCOPE.EditSaveBtn
                  onMouseUp={() => {
                    if (thisChap.description !== "") {
                      if (thisChap.id === 0) putChapter(parentId, thisChap.description);
                      else patchUpdateChapter(thisChap.id, thisChap.description);
                      setEditMode({});
                    }
                  }}
                >
                  {thisChap.description !== "" && <FontAwesomeIcon icon={faSave} />}
                </CHAPTERSCOPE.EditSaveBtn>
                <CHAPTERSCOPE.DeleteBtn
                  onMouseUp={() => {
                    removeChapter(0);
                    rollbackDescription(thisChap);
                    setEditMode({});
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </CHAPTERSCOPE.DeleteBtn>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <CHAPTERSCOPE.EditSaveBtn
                  onMouseUp={() =>
                    (Object.keys(editMode).length === 0 || thisChap.description === "") &&
                    setEditMode({ [thisChap.id]: true, des: thisChap.description })
                  }
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </CHAPTERSCOPE.EditSaveBtn>
                <CHAPTERSCOPE.EditSaveBtn onClick={() => moveChapterUpAtSameLevel(parentId, thisChap.id)}>
                  <FontAwesomeIcon icon={faArrowUpWideShort} />
                </CHAPTERSCOPE.EditSaveBtn>
                <CHAPTERSCOPE.EditSaveBtn onClick={() => moveChapterDownAtSameLevel(parentId, thisChap.id)}>
                  <FontAwesomeIcon icon={faArrowDownWideShort} />
                </CHAPTERSCOPE.EditSaveBtn>
                <CHAPTERSCOPE.EditSaveBtn onMouseUp={() => moveChapterToAnother(thisChap, parentId)}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </CHAPTERSCOPE.EditSaveBtn>
                <CHAPTERSCOPE.DeleteBtn onMouseUp={() => setDeleteTargetId(thisChap.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </CHAPTERSCOPE.DeleteBtn>
              </React.Fragment>
            )}
          </CHAPTERSCOPE.BtnContainer>
        )}
      </CHAPTERSCOPE.ChapterLine>
    );
  };

  const AddBtn = (parentId, level) => {
    return (
      <CHAPTERSCOPE.AddLine
        $level={level - 1}
        onClick={(e) => {
          e.stopPropagation();
          addEmptyChapter(parentId);
        }}
      >
        <CHAPTERSCOPE.ExpansionSection>
          <FontAwesomeIcon icon={faCaretRight} />
        </CHAPTERSCOPE.ExpansionSection>
        <CHAPTERSCOPE.AddBtn>
          <FontAwesomeIcon icon={faPlus} />
        </CHAPTERSCOPE.AddBtn>
      </CHAPTERSCOPE.AddLine>
    );
  };

  const renderChapters = (chapters, level = 1, parentId = null) => {
    return chapters.map((chapter) => (
      <CHAPTERSCOPE.ChapterContainer
        key={chapter.id}
        $isMovingUp={movingUpId === chapter.id}
        $isMovingDown={movingDownId === chapter.id}
      >
        {ChapterBox(chapter, level, parentId)}
        {chapter.expansion && level < 5 && chapter.description !== "" && (
          <React.Fragment>
            {renderChapters(chapter.children, level + 1, chapter.id)}
            {AddBtn(chapter.id, level + 1)}
          </React.Fragment>
        )}
      </CHAPTERSCOPE.ChapterContainer>
    ));
  };

  return (
    <SELECTCHAP.Wrapper $isMoving={movingChapter.id !== null}>
      {deleteTargetId !== null && (
        <WarningModal
          deleteFunc={() => deleteChapterFunc()}
          closeModal={() => setDeleteTargetId(null)}
          warningText={`속하는 개념, 문제에 더해 출제한 모든것이 사라집니다.`}
        />
      )}
      <SCHOOLSEM.RowContainer>
        <SCHOOLSEM.SchoolOptionContainer>
          {schoolOptions.map((opt) => (
            <SCHOOLSEM.DetailBtn key={opt} $isSelected={school === opt} value={opt} onClick={changeSchool}>
              {opt}
            </SCHOOLSEM.DetailBtn>
          ))}
        </SCHOOLSEM.SchoolOptionContainer>
        <SCHOOLSEM.TempStorageBtn $isSelected={school === null} onClick={() => setSchool(null)}>
          임시 보관함
        </SCHOOLSEM.TempStorageBtn>
      </SCHOOLSEM.RowContainer>
      <SCHOOLSEM.RowContainer>{school !== null && gradesUponSchool()}</SCHOOLSEM.RowContainer>

      <CHAPTERSCOPE.ScopeSection>{renderChapters(simpleChapter)}</CHAPTERSCOPE.ScopeSection>
    </SELECTCHAP.Wrapper>
  );
};

export default MainChapter;

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
    ${({ $isMoving }) =>
      $isMoving
        ? css`
            pointer-events: none;
          `
        : ``}
  `,
  ListOptionLine: styled.div`
    width: ${leftSectionWidth};
    height: 6rem;
    display: flex;
    flex-direction: row;
  `,
  ListOptionBtn: styled.button`
    width: 50%;
    height: 6rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
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
          : css`
              border-right: 0.1rem solid ${theme.colors.gray20};
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
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 21rem;
    height: 4rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
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
  TempStorageBtn: styled.button`
    width: 15rem;
    height: 4rem;
    margin-left: 2rem;
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
    transition: transform 0.5s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.5s cubic-bezier(0.42, 0, 0.58, 1);
    will-change: "opacity,transform";
    opacity: ${({ $isMovingUp, $isMovingDown }) => ($isMovingUp || $isMovingDown ? 0.0 : 1)};
    transform: ${({ $isMovingUp, $isMovingDown }) =>
      $isMovingUp ? "translateY(-10px)" : $isMovingDown ? "translateY(10px);" : "translateY(0)"};
  `,

  ChapterLine: styled.div`
    width: ${({ $level }) => 63.5 - $level * 2}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    margin-left: ${({ $level }) => $level * 2}rem;
    padding-right: 1rem;
    ${({ $isMoving, theme }) =>
      $isMoving
        ? css`
            border-radius: 0.5rem;
            background-color: ${theme.colors.mainColor};
            :nth-child(n) {
              color: white;
            }
          `
        : ``}
  `,
  AddLine: styled.div`
    width: ${({ $level }) => 64 - $level * 2}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    margin-left: ${({ $level }) => $level * 2}rem;
    padding-right: 1rem;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
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
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.5rem;
    margin-left: -0.25rem;
    font-size: 1.75rem;
    font-weight: 600;
    width: 32rem;
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
  DescriptionInput: styled.input`
    height: 4rem;
    width: 32rem;
    font-size: 1.75rem;
    font-weight: 600;
    border-radius: 0.6rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    margin-left: -0.75rem;
    padding-left: 0.55rem;
    outline: none;
  `,
  AddBtn: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 0.75rem;
    font-size: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  BtnContainer: styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  EditSaveBtn: styled.button`
    height: 4rem;
    width: 3rem;
    margin-left: 1rem;
    font-size: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  DeleteBtn: styled.button`
    height: 4rem;
    width: 3rem;
    margin-left: 1rem;
    font-size: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.warning};
    }
  `,
};

const CONFIRMMODAL = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    z-index: 10;
    align-items: center;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 70rem;
    min-height: 20rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    height: 7rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  `,
  Title: styled.div`
    font-size: 3rem;
    font-weight: 700;
    margin-top: 2rem;
    color: ${({ theme }) => theme.colors.warning};
  `,
  ContentLine: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-inline: 3rem;
    font-size: 2rem;
    font-weight: 600;
    line-height: 3rem;
  `,
  WarningLine: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-inline: 3rem;
    font-size: 2rem;
    font-weight: 600;
    line-height: 3rem;
    color: ${({ theme }) => theme.colors.warning};
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    padding-inline: 3rem;
    padding-block: 1.5rem;
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    margin-left: auto;
  `,
  WrognBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
    margin-left: 6rem;
    margin-right: auto;
  `,
};
