import { faCaretDown, faCaretRight, faCircle, faCircleExclamation, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../../../../../../style/theme";
import usePostGetConcepts from "../../../../../../libs/apis/Teacher/Prepare/postGetConcepts";

const AddConcept = ({
  selectedChapters,
  simpleChapter,
  setSelectedConcepts,
  selectedConceptIds,
  setSelectedConceptIds,
  addBlank,
  setAddBlank,
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
    let result2 = [];
    if (simpleChapter.length > 0) {
      const collectSelectedConcepts = (chapter) => {
        const selectedConcepts = [];

        const groupedConcepts = [];

        const traverseChapters = (chapters) => {
          const result = [];

          chapters.forEach((chapter) => {
            if (chapter.children.length > 0) {
              const selectedChildren = traverseChapters(chapter.children);

              if (selectedChildren.length > 0) {
                groupedConcepts.push({
                  ...chapter,
                  expansion: false,
                  children: selectedChildren,
                });
              }
            } else if (chapter.selected) {
              result.push({ ...chapter, expansion: false, selected: false });
              selectedConcepts.push({ ...chapter, expansion: false, selected: false });
            }
          });

          return result;
        };

        traverseChapters(chapter);
        const selectedConceptIds = selectedConcepts.map((concept) => concept.id);

        setGroupedConcepts(groupedConcepts);
        setConcepts(selectedConcepts);
        setSelectedConceptIds(selectedConceptIds);
        getConcepts(selectedConceptIds);
      };

      // 사용 예시
      setSelectedConceptIds([]);
      collectSelectedConcepts(simpleChapter);
    } else {
      setSelectedConceptIds([]);
      result2 = selectedChapters.map((chapter) => ({ ...chapter, selected: false }));

      setGroupedConcepts([]);
      setConcepts(result2);
    }
  }, []);
  useEffect(() => {
    if (conceptData.length > 0) {
      setSelectedConcepts(conceptData);
      // 기존 groupedConcepts와 concepts를 기반으로 업데이트된 배열 생성
      const updatedGroupedConcepts = groupedConcepts.map((chap) => {
        const updatedChildren = chap.children
          .map((childChap) => {
            const matchedConcepts = conceptData.filter((concept) => concept.chapterId === childChap.id);
            return matchedConcepts.map((concept) => ({
              ...childChap,
              conceptId: concept.id,
              conceptImage: concept.image,
              conceptBlankImg: concept.blankImage,
            }));
          })
          .flat();

        return {
          ...chap,
          children: updatedChildren,
        };
      });

      const updatedConcepts = updatedGroupedConcepts.flatMap((chap) => chap.children);

      const selectedConceptIds_temp = updatedConcepts.map((concept) => concept.id);

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
    //소단원 확장
    setGroupedConcepts((prev) => {
      return prev.map((chap) => {
        if (chap.id === chapterId) {
          return { ...chap, expansion: !chap.expansion };
        }
        return chap;
      });
    });
  };

  const toggleExpansion = (conceptId) => {
    //개념 확장
    const toggleExpansion = (items, conceptId) => {
      return items.map((item) =>
        item.id === conceptId
          ? { ...item, expansion: !item.expansion }
          : item.children
          ? { ...item, children: toggleExpansion(item.children, conceptId) }
          : item
      );
    };

    setGroupedConcepts((prev) => toggleExpansion(prev, conceptId));

    setConcepts((prevConcepts) => toggleExpansion(prevConcepts, conceptId));
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
    if (conceptData.length > 0)
      setSelectedConcepts(conceptData.filter((concept) => selectedConceptIds.includes(concept.chapterId)));
  }, [selectedConceptIds]);
  return (
    <AC.Wrapper>
      <AC.NoticeBox>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
        개념 배치는 다음 단계에서 변경할 수 있으며, 빈칸은 항상 일괄 적용됩니다.
      </AC.NoticeBox>
      <AC.BtnLine>
        <AC.GroupBtn onClick={ungroupConcepts}>
          <AC.RadioBtn>{!isGrouped && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
          유형별
        </AC.GroupBtn>
        {simpleChapter.length > 0 && (
          <AC.GroupBtn onClick={groupConcepts} $disabled={simpleChapter.length < 1}>
            <AC.RadioBtn>{isGrouped && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
            소단원별
          </AC.GroupBtn>
        )}
        <AC.BlankBtn onClick={() => setAddBlank((prev) => !prev)}>
          <AC.RadioBtn>{addBlank && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
          빈칸
        </AC.BlankBtn>

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
                      {`${addBlank ? `( 빈칸 ) ` : ``}${concept.description}`}
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
                        <AC.ConceptImage src={addBlank ? concept.conceptBlankImg : concept.conceptImage} />
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
                {`${addBlank ? `( 빈칸 ) ` : ``}${concept.description}`}
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
                  <AC.ConceptImage src={addBlank ? concept.conceptBlankImg : concept.conceptImage} />
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
    padding-left: 1rem;
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
    margin-right: 0.5rem;
  `,
  GroupBtn: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 1.75rem;
    color: ${({ $disabled, theme }) => ($disabled ? theme.colors.gray30 : `black`)};
    cursor: pointer;
  `,
  BlankBtn: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-left: auto;
    margin-right: 1rem;
    color: ${({ $disabled, theme }) => ($disabled ? theme.colors.gray30 : `black`)};
    cursor: pointer;
  `,
  CancelAllBtn: styled.button`
    margin-left: 2rem;
    width: 10rem;
    height: 3.5rem;
    border-radius: 2rem;
    background-color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
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
