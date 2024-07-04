import { faCaretDown, faCaretRight, faCircle, faCircleExclamation, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../../../../../style/theme";
import usePostGetConcepts from "../../../../../libs/apis/Teacher/Prepare/postGetConcepts";

const AddConcept = ({
  selectedChapters,
  simpleChapter,
  setSelectedConcepts,
  selectedConceptIds,
  setSelectedConceptIds,
}) => {
  const { conceptData, getConcepts } = usePostGetConcepts();
  const [concepts, setConcepts] = useState([]);
  const [groupedConcepts, setGroupedConcepts] = useState([]);

  const [isGrouped, setIsGrouped] = useState(false);
  const ungroupConcepts = () => setIsGrouped(false);
  const groupConcepts = () => {
    if (groupedConcepts.length > 0) setIsGrouped(true);
  };

  useEffect(() => {
    let result = [];
    let result2 = [];
    if (simpleChapter.length > 0) {
      setSelectedConceptIds([]);
      simpleChapter.forEach((dept1) => {
        if (dept1.children && dept1.children.length > 0) {
          dept1.children.forEach((dept2) => {
            if (dept2.children && dept2.children.length > 0) {
              const selectedChildren = dept2.children.filter((dept3) => dept3.selected);
              if (selectedChildren.length > 0) {
                result.push({
                  ...dept2,
                  expansion: false,
                  children: selectedChildren,
                });
                result2.push(...selectedChildren);
              }
            }
          });
        }
      });
      const selectedConceptIds_temp = [];
      result2.map((concept) => {
        selectedConceptIds_temp.push(concept.id);
      });
      console.log(result);
      console.log(result2);
      setGroupedConcepts(result);
      setConcepts(result2);
      setSelectedConceptIds(selectedConceptIds_temp);
      getConcepts(selectedConceptIds_temp);
    } else {
      setSelectedConceptIds([]);
      result2 = selectedChapters.map((chapter) => ({ ...chapter, selected: false }));
      console.log(result2);
      setGroupedConcepts([]);
      setConcepts(result2);
    }
  }, []);
  useEffect(() => {
    if (conceptData.length > 0) {
      // 기존 groupedConcepts와 concepts를 기반으로 업데이트된 배열 생성
      const updatedGroupedConcepts = groupedConcepts.map((dept2) => {
        const updatedChildren = dept2.children
          .map((dept3) => {
            const matchedConcepts = conceptData.filter((concept) => concept.chapterId === dept3.id);
            return matchedConcepts.map((concept) => ({
              ...dept3,
              conceptId: concept.id,
              conceptUrl: concept.url,
            }));
          })
          .flat();

        return {
          ...dept2,
          children: updatedChildren,
        };
      });

      const updatedConcepts = updatedGroupedConcepts.flatMap((dept2) => dept2.children);

      const selectedConceptIds_temp = updatedConcepts.map((concept) => concept.id);

      console.log(updatedGroupedConcepts);
      console.log(updatedConcepts);
      setGroupedConcepts(updatedGroupedConcepts);
      setConcepts(updatedConcepts);
      setSelectedConceptIds(selectedConceptIds_temp);
    }
  }, [conceptData]);

  useEffect(() => {
    if (concepts.length > 0) {
      const updatedConcepts = concepts.map((concept) => ({
        ...concept,
        selected: selectedConceptIds.includes(concept.id),
      }));

      const updatedGroupedConcepts = groupedConcepts.map((group) => ({
        ...group,
        children: group.children.map((child) => ({
          ...child,
          selected: selectedConceptIds.includes(child.id),
        })),
      }));

      setConcepts(updatedConcepts);
      setGroupedConcepts(updatedGroupedConcepts);
    }
  }, [selectedConceptIds]);

  const onChapterSelect = (id) => {
    const index = selectedConceptIds.indexOf(id);
    let tempArr = selectedConceptIds;
    if (index === -1) {
      tempArr = [...selectedConceptIds, id];
    } else {
      tempArr = selectedConceptIds.filter((item) => item !== id);
    }
    tempArr.sort((a, b) => (a > b ? 1 : -1));
    setSelectedConceptIds(tempArr);
  };

  const onChapterExpand = (chapterId) => {
    setGroupedConcepts((prev) => {
      return prev.map((dept2) => {
        if (dept2.id === chapterId) {
          return { ...dept2, expansion: !dept2.expansion };
        }
        return dept2;
      });
    });
  };

  const toggleExpansion = (conceptId) => {
    setGroupedConcepts((prevGroupedConcepts) => {
      return prevGroupedConcepts.map((dept2) => {
        const updatedChildren = dept2.children.map((dept3) => {
          if (dept3.id === conceptId) {
            return { ...dept3, expansion: !dept3.expansion };
          }
          return dept3;
        });
        return { ...dept2, children: updatedChildren };
      });
    });

    setConcepts((prevConcepts) => {
      return prevConcepts.map((concept) => {
        if (concept.id === conceptId) {
          return { ...concept, expansion: !concept.expansion };
        }
        return concept;
      });
    });
  };

  const selectAll = () => {
    let result = [];
    concepts.map((concept) => result.push(concept.id));
    setSelectedConceptIds(result);
  };
  const cancelAll = () => {
    setSelectedConceptIds([]);
  };

  useEffect(() => {
    setSelectedConcepts(
      conceptData.map((concept, index) => ({ ...concept, chapterId: selectedConceptIds[index], preview: false }))
    );
  }, [conceptData]);
  return (
    <AC.Wrapper>
      <AC.NoticeBox>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
        개념 배치는 다음 단계에서 변경할 수 있습니다.
      </AC.NoticeBox>
      <AC.BtnLine>
        <AC.GroupBtn onClick={ungroupConcepts}>
          <AC.RadioBtn>{!isGrouped && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
          유형별 개념
        </AC.GroupBtn>
        {simpleChapter.length > 0 && (
          <AC.GroupBtn onClick={groupConcepts} $disabled={simpleChapter.length < 1}>
            <AC.RadioBtn>{isGrouped && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
            소단원별 개념
          </AC.GroupBtn>
        )}
        <AC.CancelAllBtn onClick={selectAll}>전체 추가</AC.CancelAllBtn>
        <AC.CancelAllBtn onClick={cancelAll}>전체 취소</AC.CancelAllBtn>
      </AC.BtnLine>
      {isGrouped ? (
        <AC.ConceptSection>
          {groupedConcepts.map((chapter) => (
            <div key={chapter.id}>
              <AC.ChapterLine
                onClick={() => {
                  onChapterExpand(chapter.id);
                }}
              >
                <FontAwesomeIcon
                  icon={chapter.expansion ? faCaretDown : faCaretRight}
                  style={{ marginRight: `2rem` }}
                />
                {chapter.description}
              </AC.ChapterLine>
              {chapter.expansion &&
                chapter.children.map((concept) => (
                  <AC.ConceptContainer key={concept.id} $isSelected={concept.selected}>
                    <AC.ConceptLine
                      $isSelected={concept.selected}
                      onClick={() => {
                        toggleExpansion(concept.id);
                      }}
                    >
                      {concept.description}
                      {concept.selected ? (
                        <AC.AddedBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            onChapterSelect(concept.id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            style={{ marginRight: `0.5rem`, color: theme.colors.mainColor }}
                          />
                          추가 완료
                        </AC.AddedBtn>
                      ) : (
                        <AC.AddBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            onChapterSelect(concept.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} style={{ marginRight: `0.5rem` }} />
                          개념 추가
                        </AC.AddBtn>
                      )}
                    </AC.ConceptLine>
                    {concept.expansion && (
                      <AC.ImageBox>
                        <AC.ConceptImage src={concept.conceptUrl} />
                      </AC.ImageBox>
                    )}
                  </AC.ConceptContainer>
                ))}
            </div>
          ))}
        </AC.ConceptSection>
      ) : (
        <AC.ConceptSection>
          {concepts.map((concept) => (
            <AC.ConceptContainer key={concept.id} $isSelected={concept.selected}>
              <AC.ConceptLine
                $isSelected={concept.selected}
                onClick={() => {
                  toggleExpansion(concept.id);
                }}
              >
                {concept.description}
                {concept.selected ? (
                  <AC.AddedBtn
                    onClick={(e) => {
                      e.stopPropagation();
                      onChapterSelect(concept.id);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ marginRight: `0.5rem`, color: theme.colors.mainColor }}
                    />
                    추가 완료
                  </AC.AddedBtn>
                ) : (
                  <AC.AddBtn
                    onClick={(e) => {
                      e.stopPropagation();
                      onChapterSelect(concept.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: `0.5rem` }} />
                    개념 추가
                  </AC.AddBtn>
                )}
              </AC.ConceptLine>
              {concept.expansion && (
                <AC.ImageBox>
                  <AC.ConceptImage src={concept.conceptUrl} />
                </AC.ImageBox>
              )}
            </AC.ConceptContainer>
          ))}
        </AC.ConceptSection>
      )}
    </AC.Wrapper>
  );
};
export default AddConcept;

const AC = {
  Wrapper: styled.div`
    width: 60rem;
    height: 68rem;
    margin-top: 1rem;
    overflow: hidden;
    //border: 0.1rem solid ${({ theme }) => theme.colors.background};
    //background-color: white;
    padding: 0rem;
  `,
  NoticeBox: styled.div`
    width: 60rem;
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.gray60};
    display: flex;
    align-items: center;
    padding-left: 2rem;
    font-size: 1.5rem;
  `,
  BtnLine: styled.div`
    width: 60rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1rem;
  `,
  RadioBtn: styled.div`
    width: 2rem;
    height: 2rem;
    border: 0.2rem solid black;
    border-radius: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-right: 0.3rem;
  `,
  GroupBtn: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 1rem;
    color: ${({ $disabled, theme }) => ($disabled ? theme.colors.gray30 : `black`)};
    cursor: pointer;
  `,
  CancelAllBtn: styled.button`
    margin-left: auto;
    width: 10rem;
    height: 3.5rem;
    border-radius: 2rem;
    background-color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    &:last-child {
      margin-left: 2rem;
    }
  `,
  ConceptSection: styled.div`
    width: 60rem;
    height: 59.5rem;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0rem; /* 세로 스크롤바의 너비 */
    }
  `,
  ChapterLine: styled.div`
    width: 59.8rem;
    height: 5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    font-size: 2rem;
    font-weight: 600;
    color: white;
    background-color: ${({ theme }) => theme.colors.gray40};
    margin-top: 1rem;
    cursor: pointer;
  `,
  ConceptContainer: styled.div`
    margin-top: 1rem;
    width: 59.8rem;
    border-radius: 1.2rem;
    overflow: hidden;
    background-color: white;
    border: 0.2rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray30)};
  `,
  ConceptLine: styled.div`
    width: 59.8rem;
    height: 5rem;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.gray70 : theme.colors.gray50)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : theme.colors.gray05)};

    padding-left: 2rem;
    cursor: pointer;
  `,
  ImageBox: styled.div`
    width: 59.8rem;
    padding-left: 1.8rem;
    padding-block: 1rem;
    background-color: white;
  `,
  ConceptImage: styled.img`
    width: 56rem;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard syntax */

    pointer-events: none; /* 이미지에 대한 마우스 이벤트 비활성화 */
  `,
  ChapterDes: styled.div``,
  AddBtn: styled.button`
    margin-left: auto;
    margin-right: 2rem;
    width: 12rem;
    height: 3rem;
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  AddedBtn: styled.button`
    margin-left: auto;
    margin-right: 2rem;
    width: 12rem;
    height: 3rem;
    font-size: 1.5rem;
    font-weight: 600;
  `,
};
