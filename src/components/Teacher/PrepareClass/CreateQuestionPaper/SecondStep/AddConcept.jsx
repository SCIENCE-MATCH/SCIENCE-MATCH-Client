import { faCircle, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../../../../../style/theme";
import axios from "axios";
import { getCookie } from "../../../../../libs/cookie";

const AddConcept = ({ simpleChapter, setSelectedConcepts, selectedConceptIds, setSelectedConceptIds }) => {
  const [concepts, setConcepts] = useState([]);
  const [groupedConcepts, setGroupedConcepts] = useState([]);

  const [isGrouped, setIsGrouped] = useState(true);
  const ungroupConcepts = () => setIsGrouped(false);
  const groupConcepts = () => setIsGrouped(true);

  useEffect(() => {
    let result = [];
    let result2 = [];
    simpleChapter.forEach((dept1) => {
      if (dept1.children && dept1.children.length > 0) {
        dept1.children.forEach((dept2) => {
          if (dept2.children && dept2.children.length > 0) {
            const selectedChildren = dept2.children.filter((dept3) => dept3.selected);
            if (selectedChildren.length > 0) {
              result.push({
                ...dept2,
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
    setGroupedConcepts(result);
    setConcepts(result2);
    setSelectedConceptIds(selectedConceptIds_temp);
  }, []);

  useEffect(() => {
    if (concepts.length > 0) {
      const updatedConcepts = concepts.map((concept) => ({
        ...concept,
        selected: selectedConceptIds.includes(concept.id),
      }));
      console.log(updatedConcepts);

      const updatedGroupedConcepts = groupedConcepts.map((group) => ({
        ...group,
        children: group.children.map((child) => ({
          ...child,
          selected: selectedConceptIds.includes(child.id),
        })),
      }));

      getConcepts(selectedConceptIds);
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

  const selectAll = () => {
    let result = [];
    concepts.map((concept) => result.push(concept.id));
    setSelectedConceptIds(result);
  };
  const cancelAll = () => {
    setSelectedConceptIds([]);
  };

  const getConcepts = async (payload) => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/question-paper/concept";

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = response.data.data.map((concept, index) => ({ ...concept, chapterId: selectedConceptIds[index] }));
      setSelectedConcepts(result);
      console.log(result);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };
  return (
    <AC.Wrapper>
      <AC.NoticeBox>
        <FontAwesomeIcon icon={faCircleExclamation} />
        개념 배치는 다음 단계에서 변경할 수 있습니다.
      </AC.NoticeBox>
      <AC.BtnLine>
        <AC.GroupBtn onClick={ungroupConcepts}>
          <AC.RadioBtn>{!isGrouped && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
          유형별 개념
        </AC.GroupBtn>
        <AC.GroupBtn onClick={groupConcepts}>
          <AC.RadioBtn>{isGrouped && <FontAwesomeIcon icon={faCircle} />}</AC.RadioBtn>
          소단원별 개념
        </AC.GroupBtn>
        <AC.CancelAllBtn onClick={selectAll}>전체 추가</AC.CancelAllBtn>
        <AC.CancelAllBtn onClick={cancelAll}>전체 취소</AC.CancelAllBtn>
      </AC.BtnLine>
      {isGrouped ? (
        <AC.ConceptContainer>
          {groupedConcepts.map((chapter) => (
            <div key={chapter.id}>
              <AC.ChapterLine>{chapter.description}</AC.ChapterLine>
              {chapter.children.map((concept) => (
                <AC.ConceptLine
                  $isSelected={concept.selected}
                  key={concept.id}
                  onClick={() => {
                    onChapterSelect(concept.id);
                  }}
                >
                  {concept.description}
                  {concept.selected ? (
                    <AC.AddedBtn>
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{ marginRight: `0.5rem`, color: theme.colors.mainColor }}
                      />
                      추가 완료
                    </AC.AddedBtn>
                  ) : (
                    <AC.AddBtn>추가</AC.AddBtn>
                  )}
                </AC.ConceptLine>
              ))}
            </div>
          ))}
        </AC.ConceptContainer>
      ) : (
        <AC.ConceptContainer>
          {concepts.map((concept) => (
            <AC.ConceptLine
              $isSelected={concept.selected}
              key={concept.id}
              onClick={() => {
                onChapterSelect(concept.id);
              }}
            >
              {concept.description}
              {concept.selected ? (
                <AC.AddedBtn>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    style={{ marginRight: `0.5rem`, color: theme.colors.mainColor }}
                  />
                  추가 완료
                </AC.AddedBtn>
              ) : (
                <AC.AddBtn>추가</AC.AddBtn>
              )}
            </AC.ConceptLine>
          ))}
        </AC.ConceptContainer>
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
    border-radius: 1rem;
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
  ConceptContainer: styled.div`
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
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
    color: white;
    background-color: ${({ theme }) => theme.colors.gray40};
    margin-top: 1rem;
  `,
  ConceptLine: styled.div`
    width: 59.8rem;
    height: 5rem;
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.gray70 : theme.colors.gray50)};
    border: 0.2rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray30)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : theme.colors.gray05)};
    margin-top: 1rem;
    padding-left: 2rem;
  `,
  ChapterDes: styled.div``,
  AddBtn: styled.button`
    margin-left: auto;
    margin-right: 2rem;
    width: 11rem;
    height: 3rem;
    border-radius: 2rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  AddedBtn: styled.button`
    margin-left: auto;
    margin-right: 2rem;
    width: 12rem;
    height: 3rem;
    border-radius: 2rem;
    font-size: 1.5rem;
    font-weight: 600;
  `,
};
