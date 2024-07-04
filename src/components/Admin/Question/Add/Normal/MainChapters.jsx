import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { getCookie } from "../../../../../libs/cookie";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faCheck,
  faCircleExclamation,
  faPenToSquare,
  faPlus,
  faSave,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
const SelectChapter = ({
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
  const categorySet = { 0: "단원 유형별", 1: "시중교재", 2: "모의고사" };
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
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
          <SCHOOLSEM.RoundBtn
            key={index}
            $isSelected={grade === opt}
            value={opt}
            onClick={() => {
              changeGrade(opt);
            }}
          >
            {opt}
          </SCHOOLSEM.RoundBtn>
        ))}
        <SCHOOLSEM.SemesterContainer>
          <SCHOOLSEM.RoundBtn $isSelected={semester === 1} onClick={() => changeSemester(1)}>
            1
          </SCHOOLSEM.RoundBtn>
          <SCHOOLSEM.RoundBtn $isSelected={semester === 2} onClick={() => changeSemester(2)}>
            2
          </SCHOOLSEM.RoundBtn>
        </SCHOOLSEM.SemesterContainer>
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const getChapters = async (sem, sub) => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/chapter/get";

      const response = await Axios.post(
        url,
        { school: schoolToSend[school], semester: sem, subject: sub },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setChapters(response.data.data);
      setEditMode({});
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };

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

    setChapters([]);
    setCurrentChapter({ id: null, description: "" });
    getChapters(sem, sub);
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
      setCurrentChapter({ id: null, description: "" });
    } else {
      setCurrentChapter({ id: thisChap.id, description: thisChap.description });
    }
  };
  const addEmptyChapter = (id) => {
    if (Object.keys(editMode).length === 0) {
      setEditMode({ 0: true });
      if (id === null) {
        const updatedSimpleChapter = [...simpleChapter, { id: 0, description: "", expansion: false, children: [] }];
        console.log(updatedSimpleChapter);
        setSimpleChapters(updatedSimpleChapter);
      } else {
        const updatedSimpleChapter = simpleChapter.map((chapter) => {
          if (chapter.id === id) {
            // 현재 챕터의 children 속성을 업데이트
            return {
              ...chapter,
              expansion: true,
              children: [...chapter.children, { id: 0, description: "", expansion: false, children: [] }],
            };
          } else {
            // 자식 챕터를 탐색하고 업데이트
            const updatedChildren = chapter.children.map((childChap) => {
              if (childChap.id === id) {
                return {
                  ...childChap,
                  expansion: true,
                  children: [...childChap.children, { id: 0, description: "" }],
                };
              } else {
                return childChap;
              }
            });
            return { ...chapter, children: updatedChildren };
          }
        });
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
      sem = `${semToEng[semester - 1]}`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }
    try {
      const accessToken = getCookie("aToken");

      const response = await Axios.post(
        "https://www.science-match.p-e.kr/admin/chapter",
        {
          school: schoolToSend[school],
          semester: sem,
          subject: sub,
          parentId: parentId,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedSimpleChapter = simpleChapter.map((chapter) => {
        if (chapter.id === 0) {
          return { ...chapter, id: response.data.data };
        } else {
          const updatedChildren = chapter.children.map((childChap) => {
            if (childChap.id === 0) {
              return { ...childChap, id: response.data.data };
            } else {
              const updatedGrandChildren = childChap.children.map((grandchildChap) => {
                if (grandchildChap.id === 0) {
                  return { ...grandchildChap, id: response.data.data };
                } else return grandchildChap;
              });
              return { ...childChap, children: updatedGrandChildren };
            }
          });
          return { ...chapter, children: updatedChildren };
        }
      });
      console.log(updatedSimpleChapter);
      setSimpleChapters(updatedSimpleChapter);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };

  const updateChapter = async (id, description) => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/chapter";

      await Axios.patch(
        url,
        {
          description: description,
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const deleteChapter = async () => {
    if (deleteTargetId)
      try {
        const accessToken = getCookie("aToken");
        const url = `https://www.science-match.p-e.kr/admin/chapter?chapterId=${deleteTargetId}`;

        await Axios.delete(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        removeChapter(deleteTargetId);
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
  };
  const [editMode, setEditMode] = useState({}); // 각 챕터의 수정 모드를 관리하는 상태

  const rollbackDescription = (thisChap) => {
    const value = editMode.des; // editMode에서 des 값을 가져옵니다.
    console.log(value);

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
    const updatedSimpleChapter = simpleChapter.map((chapter) => {
      if (chapter.id === thisChap.id) {
        return { ...chapter, description: value };
      } else {
        const updatedChildren = chapter.children.map((childChap) => {
          if (childChap.id === thisChap.id) {
            return { ...childChap, description: value };
          } else {
            const updatedGrandChildren = childChap.children.map((grandchildChap) => {
              if (grandchildChap.id === thisChap.id) {
                return { ...grandchildChap, description: value };
              } else return grandchildChap;
            });
            return { ...childChap, children: updatedGrandChildren };
          }
        });
        return { ...chapter, children: updatedChildren };
      }
    });
    setSimpleChapters(updatedSimpleChapter);
  };

  const handleDoubleClick = (thisChap) => {
    if (Object.keys(editMode).length === 0) setEditMode({ [thisChap.id]: true, des: thisChap.description });
  };

  const handleKeyPress = (e, thisChap, parentId) => {
    if (e.key === "Enter") {
      if (thisChap.id === 0) putChapter(parentId, e.target.value);
      else updateChapter(thisChap.id, e.target.value);
      setEditMode({});
    }
  };
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const ChapterBox = (thisChap, level, parentId) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        key={thisChap.id}
        $level={level - 1}
        $isExpanded={thisChap.expansion}
        onMouseEnter={() => setHoveredChapter(thisChap.id)}
        onMouseLeave={() => setHoveredChapter(null)}
      >
        {level < 3 ? (
          <CHAPTERSCOPE.ExpansionSection
            $isExpanded={thisChap.expansion}
            onClick={() => {
              if (thisChap.id !== 0) onExpansion(thisChap);
            }}
          >
            <FontAwesomeIcon icon={thisChap.expansion & (level < 3) ? faCaretDown : faCaretRight} />
          </CHAPTERSCOPE.ExpansionSection>
        ) : (
          <CHAPTERSCOPE.ExpansionSection
            onClick={() => {
              if (thisChap.id !== 0) thisChap.id !== "" && onChapterClick(thisChap);
            }}
          >
            <CHAPTERSCOPE.CheckBox $isChecked={currentChapter.id === thisChap.id}>
              {currentChapter.id === thisChap.id ? <FontAwesomeIcon icon={faCheck} /> : ""}
            </CHAPTERSCOPE.CheckBox>
          </CHAPTERSCOPE.ExpansionSection>
        )}
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
        {hoveredChapter === thisChap.id || editMode[thisChap.id] ? (
          <CHAPTERSCOPE.BtnContainer>
            {editMode[thisChap.id] ? (
              <CHAPTERSCOPE.EditSaveBtn
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  if (thisChap.description !== "") {
                    if (thisChap.id === 0) putChapter(parentId, thisChap.description);
                    else updateChapter(thisChap.id, thisChap.description);
                    setEditMode({});
                  }
                }}
              >
                {thisChap.description !== "" && <FontAwesomeIcon icon={faSave} />}
              </CHAPTERSCOPE.EditSaveBtn>
            ) : (
              <CHAPTERSCOPE.EditSaveBtn
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  if (Object.keys(editMode).length === 0 || thisChap.description === "")
                    setEditMode({ [thisChap.id]: true, des: thisChap.description });
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </CHAPTERSCOPE.EditSaveBtn>
            )}
            {editMode[thisChap.id] ? (
              <CHAPTERSCOPE.DeleteBtn
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  removeChapter(0);
                  rollbackDescription(thisChap);
                  setEditMode({});
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </CHAPTERSCOPE.DeleteBtn>
            ) : (
              <CHAPTERSCOPE.DeleteBtn
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  setDeleteTargetId(thisChap.id);
                  setIsConfirming(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </CHAPTERSCOPE.DeleteBtn>
            )}
          </CHAPTERSCOPE.BtnContainer>
        ) : null}
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
        {level < 3 ? (
          <CHAPTERSCOPE.ExpansionSection $isExpanded={false}>
            <FontAwesomeIcon icon={faCaretRight} />
          </CHAPTERSCOPE.ExpansionSection>
        ) : (
          <CHAPTERSCOPE.ExpansionSection>
            <CHAPTERSCOPE.CheckBox />
          </CHAPTERSCOPE.ExpansionSection>
        )}
        <CHAPTERSCOPE.AddBtn>
          <FontAwesomeIcon icon={faPlus} />
        </CHAPTERSCOPE.AddBtn>
      </CHAPTERSCOPE.AddLine>
    );
  };

  const [isConfirming, setIsConfirming] = useState(false);

  const ConfirmDelete = () => {
    return (
      <CONFIRMMODAL.ModalOverlay>
        <CONFIRMMODAL.Modal>
          <CONFIRMMODAL.TitleLine>
            <CONFIRMMODAL.Title>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
              주의
              <FontAwesomeIcon icon={faCircleExclamation} style={{ marginLeft: `1rem`, color: `white` }} />
            </CONFIRMMODAL.Title>
          </CONFIRMMODAL.TitleLine>
          <CONFIRMMODAL.ContentLine>속하는 개념, 문제에 더해 출제한 모든것이 사라집니다.</CONFIRMMODAL.ContentLine>
          <CONFIRMMODAL.ContentLine>데이터 전체가 망가질 수 있습니다.</CONFIRMMODAL.ContentLine>
          <CONFIRMMODAL.WarningLine>삭제시 되돌릴 수 없습니다.</CONFIRMMODAL.WarningLine>
          <CONFIRMMODAL.BtnLine>
            <CONFIRMMODAL.CloseBtn
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              닫기
            </CONFIRMMODAL.CloseBtn>
            <CONFIRMMODAL.WrognBtn
              onClick={() => {
                deleteChapter();
                setIsConfirming(false);
              }}
            >
              삭제하기
            </CONFIRMMODAL.WrognBtn>
          </CONFIRMMODAL.BtnLine>
        </CONFIRMMODAL.Modal>
      </CONFIRMMODAL.ModalOverlay>
    );
  };

  return (
    <SELECTCHAP.Wrapper>
      <SELECTCHAP.ListOptionLine>
        {[0, 1, 2].map((opt) => (
          <SELECTCHAP.ListOptionBtn
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

      <OO.Wrapper>
        {isConfirming && ConfirmDelete()}
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
              {ChapterBox(thisChap, 1, null)}
              {thisChap.expansion ? (
                <div>
                  {thisChap.children.map((childChap, cIndex) => (
                    <div key={cIndex}>
                      {ChapterBox(childChap, 2, thisChap.id)}
                      {childChap.expansion ? (
                        <div>
                          {childChap.children.map((grandchildChap, gcIndex) =>
                            ChapterBox(grandchildChap, 3, childChap.id)
                          )}
                          {AddBtn(childChap.id, 3)}
                        </div>
                      ) : null}
                    </div>
                  ))}
                  {AddBtn(thisChap.id, 2)}
                </div>
              ) : null}
            </div>
          ))}
          {AddBtn(null, 1)}
        </CHAPTERSCOPE.ScopeSection>
      </OO.Wrapper>
    </SELECTCHAP.Wrapper>
  );
};

export default SelectChapter;

const leftSectionWidth = `47.5rem`;
const OO = {
  Wrapper: styled.div`
    width: ${leftSectionWidth};
    height: 80rem;
    overflow: hidden;
  `,
};
const SELECTCHAP = {
  Wrapper: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    height: 80rem;
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
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
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
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
  RoundBtn: styled.button`
    width: 5rem;
    height: 4rem;
    border-radius: 0.6rem;
    margin-inline: 0.5rem;
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray50)};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem ${theme.colors.unselected}`};
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
  `,
  AddLine: styled.div`
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
    font-size: 1.6rem;
    font-weight: 600;
    width: 25rem;
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
    width: 26rem;
    font-size: 1.75rem;
    border-radius: 0.6rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    margin-left: -0.75rem;
    padding-left: 0.5rem;
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
