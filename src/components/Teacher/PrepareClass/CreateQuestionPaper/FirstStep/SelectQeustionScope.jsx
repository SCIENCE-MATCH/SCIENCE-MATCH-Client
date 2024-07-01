import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const SelectQuestionScope = ({ simpleChapter, setSimpleChapters, selectedChapters, setSelectedChapters }) => {
  const [initialSelectedChaps, setInitialSelectedChaps] = useState([]);

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
    // state를 업데이트합니다.
    setSimpleChapters(updatedSimpleChapter);
  };

  const onChapterClick = (thisChap) => {
    if (thisChap.selected) {
      //unselect Chapter
      const updatedSimpleChapter = simpleChapter.map((chapter) => {
        if (chapter.id === thisChap.id) {
          // 하위 모든 챕터 선택 해제
          const updatedChildren = chapter.children.map((childChap) => {
            const updatedGrandChildren = childChap.children.map((grandchild) => {
              return { ...grandchild, selected: false, expansion: false };
            });
            return { ...childChap, selected: false, expansion: false, children: updatedGrandChildren };
          });
          return { ...chapter, selected: false, expansion: false, children: updatedChildren };
        } else {
          //자식 챕터중 일치하는지 검사
          const updatedChildren = chapter.children.map((childChap) => {
            if (childChap.id === thisChap.id) {
              //찾았으니 해당 자식, 손자 선택 해제
              const updatedGrandChildren = childChap.children.map((grandchild) => {
                return { ...grandchild, selected: false };
              });
              return { ...childChap, selected: false, expansion: false, children: updatedGrandChildren };
            } else {
              //손자 챕터중 일치하는지 검사
              const updatedGrandChildren = childChap.children.map((grandchild) => {
                if (grandchild.id === thisChap.id) {
                  return { ...grandchild, selected: false };
                } else {
                  return { ...grandchild };
                }
              });
              return { ...childChap, children: updatedGrandChildren };
            }
          });
          return { ...chapter, children: updatedChildren };
        }
      });

      const retestedChapter = updatedSimpleChapter.map((chapter) => {
        let unselectLevel1 = false;
        const updatedChildren = chapter.children.map((childChap) => {
          let unselectLevel2 = false;
          //자식 중 일치하는지 검사
          if (childChap.id === thisChap.id) {
            //찾았다면 스스로는 그대로 두고 레벨 1 선택 해제
            unselectLevel1 = true;
            return childChap;
          } else {
            //손자 챕터중 일치하는지 검사
            childChap.children.map((grandchild) => {
              if (grandchild.id === thisChap.id) {
                //찾았다면 스스로는 그대로 두고 레벨 1, 2 선택 해제
                unselectLevel1 = true;
                unselectLevel2 = true;
              }
            });

            if (unselectLevel2 === true) return { ...childChap, selected: false };
            else return childChap;
          }
        });
        if (unselectLevel1 === true) return { ...chapter, selected: false, children: updatedChildren };
        else return { ...chapter, children: updatedChildren };
      });
      setSimpleChapters(retestedChapter);
    } else {
      //select Chapter
      const updatedSimpleChapter = simpleChapter.map((chapter) => {
        if (chapter.id === thisChap.id) {
          // 하위 모든 챕터 선택
          const updatedChildren = chapter.children.map((childChap) => {
            const updatedGrandChildren = childChap.children.map((grandchild) => {
              return { ...grandchild, selected: true };
            });
            return { ...childChap, selected: true, expansion: true, children: updatedGrandChildren };
          });
          return { ...chapter, selected: true, expansion: true, children: updatedChildren };
        } else {
          //자식 챕터중 일치하는지 검사
          const updatedChildren = chapter.children.map((childChap) => {
            if (childChap.id === thisChap.id) {
              //찾았으니 해당 자식, 손자 선택
              const updatedGrandChildren = childChap.children.map((grandchild) => {
                return { ...grandchild, selected: true };
              });
              return { ...childChap, selected: true, expansion: true, children: updatedGrandChildren };
            } else {
              //손자 챕터중 일치하는지 검사
              const updatedGrandChildren = childChap.children.map((grandchild) => {
                if (grandchild.id === thisChap.id) {
                  return { ...grandchild, selected: true };
                } else {
                  return { ...grandchild };
                }
              });
              return { ...childChap, children: updatedGrandChildren };
            }
          });
          return { ...chapter, children: updatedChildren };
        }
      });

      const retestedChapter = updatedSimpleChapter.map((chapter) => {
        let isAllGrandChildSelected = true;
        for (let j = 0; j < chapter.children.length; j++) {
          for (let k = 0; k < chapter.children[j].children.length; k++) {
            if (chapter.children[j].children[k].selected === false) isAllGrandChildSelected = false;
          }
        }
        const updatedChildren = chapter.children.map((childChap) => {
          let isAllChildSelected = true;
          for (let k = 0; k < childChap.children.length; k++) {
            if (childChap.children[k].selected === false) isAllChildSelected = false;
          }
          if (isAllChildSelected === true) return { ...childChap, selected: true };
          else return childChap;
        });
        if (isAllGrandChildSelected === true) return { ...chapter, selected: true, children: updatedChildren };
        else return { ...chapter, children: updatedChildren };
      });
      setSimpleChapters(retestedChapter);
    }
  };

  const uploadSelectedChapters = () => {
    const tempChapters = [];
    simpleChapter.map((chap) => {
      chap.children.map((child) => {
        child.children.map((grandchild) => {
          if (grandchild.selected) tempChapters.push({ id: grandchild.id, description: grandchild.description });
        });
      });
    });
    setSelectedChapters(tempChapters);
  };

  useEffect(() => {
    uploadSelectedChapters();
  }, [simpleChapter]);

  useEffect(() => {
    setInitialSelectedChaps([...selectedChapters]);
    initialSelectedChaps.map((chap) => {
      for (let i = 0; i < simpleChapter.length; i++) {
        for (let j = 0; j < simpleChapter[i].children.length; j++) {
          for (let k = 0; k < simpleChapter[i].children[j].children.length; k++) {
            if (simpleChapter[i].children[j].children[k].id === chap.id)
              onChapterClick(simpleChapter[i].children[j].children[k]);
          }
        }
      }
    });
  }, []);
  //
  const chapterBox = (thisChap, level) => {
    return (
      <CQP.ChapterLine $level={level - 1}>
        <CQP.ExpansionSection
          onClick={() => {
            onExpansion(thisChap);
          }}
          $isExpanded={thisChap.expansion}
        >
          <FontAwesomeIcon icon={thisChap.expansion & (level < 3) ? faCaretDown : faCaretRight} />
        </CQP.ExpansionSection>
        <CQP.CheckBox
          onClick={() => {
            onChapterClick(thisChap);
          }}
          $isChecked={thisChap.selected}
        >
          {thisChap.selected ? <FontAwesomeIcon icon={faCheck} /> : ""}
        </CQP.CheckBox>
        <CQP.DescriptionBox>{thisChap.description}</CQP.DescriptionBox>
      </CQP.ChapterLine>
    );
  };
  return (
    <CQP.Wrapper>
      {simpleChapter.map((thisChap, index) => (
        <div key={index}>
          {chapterBox(thisChap, 1)}
          {thisChap.expansion ? (
            thisChap.children.map((childChap, cIndex) => (
              <div key={cIndex}>
                {chapterBox(childChap, 2)}
                {childChap.expansion ? (
                  childChap.children.map((grandchildChap, gcIndex) => (
                    <div key={gcIndex}>{chapterBox(grandchildChap, 3)}</div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      ))}
    </CQP.Wrapper>
  );
};

export default SelectQuestionScope;

const CQP = {
  Wrapper: styled.div`
    overflow-y: auto;
    width: 96%;
    height: 61.5rem;
    padding-left: 1rem;
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
  `,
  ExpansionSection: styled.div`
    width: 3rem;
    text-align: center;
    align-content: center;
    justify-items: center;
    font-size: 2rem;
    color: ${({ $isExpanded, theme }) => ($isExpanded ? theme.colors.deepDark : theme.colors.unselected)};

    &:hover {
      cursor: pointer;
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
  `,
  DescriptionBox: styled.div`
    margin-left: 0.75rem;
    font-size: 1.75rem;
    width: 20rem;
  `,
};
