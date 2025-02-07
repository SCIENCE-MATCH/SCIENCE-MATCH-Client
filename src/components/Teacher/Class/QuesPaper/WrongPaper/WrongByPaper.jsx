import { useState, useEffect } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faL, faMinus, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import usePostGetWrong from "../../../../../libs/apis/Teacher/Class/postGetWrongs";

const WrongByPaper = ({ papers, studentName, openCreateModal }) => {
  const { wrongQuestions, postGetWrong } = usePostGetWrong();
  const [papersToRender, setPapersToRender] = useState([...papers].map((paper) => ({ ...paper, selected: false })));
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [selectedWrongQuestions, setSelectedWrongQuestions] = useState([]);
  const [selectedConceptList, setSelectedConceptList] = useState([]);
  const [selectedQuestionList, setSelectedQuestionList] = useState([]);

  const selectPaper = (id) => {
    let tempPapers = [...papersToRender];
    tempPapers.map((paper) => {
      if (paper.id === id) {
        if (paper.selected) {
          setSelectedWrongQuestions(selectedWrongQuestions.filter((prev) => prev.paperId !== id));
        } else {
          setSelectedWrongQuestions([
            ...selectedWrongQuestions,
            { paperId: id, questions: paper.answerResponseDtos.filter((ques) => ques.rightAnswer == false) },
          ]);
        }
        paper.selected = !paper.selected;
      }
    });
    setPapersToRender(tempPapers);

    let tempArr = [...selectedPaperIds];
    const index = tempArr.indexOf(id);

    if (index === -1) tempArr.push(id);
    else tempArr.splice(index, 1);

    setSelectedPaperIds(tempArr);
  };
  useEffect(() => {
    const uniqueSortedConceptList = [
      ...new Set(selectedWrongQuestions.flatMap((paper) => paper.questions.map((ques) => ques.chapterId))),
    ].sort((a, b) => a - b);
    setSelectedConceptList(uniqueSortedConceptList);

    const uniqueSortedQuestionList = Array.from(
      new Map(selectedWrongQuestions.flatMap((paper) => paper.questions).map((obj) => [obj.id, obj])).values()
    );
    setSelectedQuestionList(uniqueSortedQuestionList);
  }, [selectedWrongQuestions]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 일
    return `${year}.${month}.${day}`;
  };
  const cutLongText = (text, cutLength) => {
    if (text.length > cutLength) return text.slice(0, cutLength) + "...";
    else return text;
  };
  const attributes = ["선택", "출제일", "학습지명", "문항수", "점수"];
  const widths = [8, 9, 48, 7, 7];

  //디테일 부분
  const [byConcept, setByConcept] = useState(true);
  const [quesNumByConcept, setQuesNumByConcpet] = useState(true);

  const [quesPerConcept, setQeusPerConcept] = useState(3);
  const [totalQuesNum, setTotalQuesNum] = useState(150);
  const changeQPC = (e) => {
    const inputValue = e.target.value;
    const numericValue = Number(inputValue);
    const num = isNaN(numericValue) ? 3 : Math.max(0, Math.min(10, numericValue));
    setQeusPerConcept(num);
  };
  const changeQuesNum = (value) => {
    const inputValue = value;
    const numericValue = Number(inputValue);

    // 숫자가 아니면 150을 사용, 그렇지 않으면 0과 150 사이의 숫자로 제한
    const num = isNaN(numericValue) ? 150 : Math.max(0, Math.min(150, numericValue));
    setTotalQuesNum(num);
  };
  return (
    <BP.Wrapper>
      <BP.LeftSection>
        <PAPERLIST.ListHeader>
          {attributes.map((att, index) => (
            <PAPERLIST.AttributeBox key={index} $width={widths[index]} $isTitle={att === "학습지명"}>
              {att}
            </PAPERLIST.AttributeBox>
          ))}
        </PAPERLIST.ListHeader>
        <PAPERLIST.InfoLine>{studentName}학생에게 출제된 학습지만 노출됩니다.</PAPERLIST.InfoLine>
        <PAPERLIST.ListContainer>
          {papersToRender.map((paper, index) => (
            <PAPERLIST.QuestionPaperLine key={index} onClick={() => selectPaper(paper.id)}>
              <PAPERLIST.CellBox $width={widths[0]} style={{ cursor: `pointer` }}>
                <PAPERLIST.CheckBox $isChecked={paper.selected}>
                  <FontAwesomeIcon icon={faCheck} />
                </PAPERLIST.CheckBox>
              </PAPERLIST.CellBox>
              <PAPERLIST.CellBox $width={widths[1]}>{formatDate(paper.createdAt)}</PAPERLIST.CellBox>
              <PAPERLIST.CellBox $width={widths[2]} $isTitle={true}>
                <PAPERLIST.PaperTitleLine>{cutLongText(paper.title, 23)}</PAPERLIST.PaperTitleLine>
              </PAPERLIST.CellBox>
              <PAPERLIST.CellBox $width={widths[3]}>{paper.questionNum}</PAPERLIST.CellBox>
              <PAPERLIST.CellBox $width={widths[4]}>
                {paper.assignStatus === "GRADED" ? (paper.score / paper.questionNum) * 100 : "-"}
              </PAPERLIST.CellBox>
            </PAPERLIST.QuestionPaperLine>
          ))}
        </PAPERLIST.ListContainer>
      </BP.LeftSection>
      <BP.RightSection>
        <BPDetail.InfoLine>선택한 {0}개의 학습지의 틀린 문제로 오답 학습지를 만듭니다.</BPDetail.InfoLine>
        <BPDetail.QuesNumLine>
          선택한 학습지의 틀린 문제 수{" "}
          <BPDetail.QuesNumber style={{ marginLeft: `0.5rem` }}>{selectedQuestionList.length}</BPDetail.QuesNumber>개
        </BPDetail.QuesNumLine>
        <BPDetail.ListOptionLine>
          <BPDetail.ListOptionBtn $isSelected={byConcept} $isLeft={true} onClick={() => setByConcept(true)}>
            틀린 유형 학습지
          </BPDetail.ListOptionBtn>
          <BPDetail.ListOptionBtn $isSelected={!byConcept} $isLeft={false} onClick={() => setByConcept(false)}>
            틀린 문제 학습지
          </BPDetail.ListOptionBtn>
        </BPDetail.ListOptionLine>
        {byConcept ? (
          <BPDetail.SettingSection>
            <BPDetail.DescriptionLine>
              유형별로 고르게 구성된 오답학습지를 만들고 싶을 때 사용합니다.
            </BPDetail.DescriptionLine>
            <BPDetail.Container>
              <BPDetail.Label>출제 방식</BPDetail.Label>
              <BPDetail.GroupBtn onClick={() => setQuesNumByConcpet(true)}>
                <BPDetail.RadioBtn $isChecked={quesNumByConcept}>
                  {quesNumByConcept && <FontAwesomeIcon icon={faCircle} />}
                </BPDetail.RadioBtn>
                유형 별 오답관리
              </BPDetail.GroupBtn>
              <BPDetail.SetBox $isChecked={quesNumByConcept}>
                틀린 유형 {selectedConceptList.length}개 <FontAwesomeIcon icon={faX} />
                <BPDetail.PlusMinusBtn onClick={() => quesPerConcept > 1 && setQeusPerConcept((prev) => prev - 1)}>
                  <FontAwesomeIcon icon={faMinus} />
                </BPDetail.PlusMinusBtn>
                <BPDetail.QuesNumPerConcept value={quesPerConcept} onChange={(e) => changeQPC(e)} />
                <BPDetail.PlusMinusBtn onClick={() => quesPerConcept < 10 && setQeusPerConcept((prev) => prev + 1)}>
                  <FontAwesomeIcon icon={faPlus} />
                </BPDetail.PlusMinusBtn>
                문제
              </BPDetail.SetBox>
              <BPDetail.GroupBtn onClick={() => setQuesNumByConcpet(false)}>
                <BPDetail.RadioBtn $isChecked={!quesNumByConcept}>
                  {!quesNumByConcept && <FontAwesomeIcon icon={faCircle} />}
                </BPDetail.RadioBtn>
                총 문제 수 기준
              </BPDetail.GroupBtn>
              <BPDetail.SetBox $isChecked={!quesNumByConcept}>
                <BPDetail.TotalNumInput value={totalQuesNum} onChange={(e) => changeQuesNum(e.target.value)} />
                문제 <BPDetail.SubText>최대 문제 수 150개</BPDetail.SubText>
              </BPDetail.SetBox>
            </BPDetail.Container>
          </BPDetail.SettingSection>
        ) : (
          <BPDetail.SettingSection>문제로로</BPDetail.SettingSection>
        )}
        <BPDetail.SummaryBox>
          학습지 문제 수{" "}
          <BPDetail.QuesNumber>
            {quesNumByConcept ? selectedConceptList.length * quesPerConcept : totalQuesNum}
          </BPDetail.QuesNumber>{" "}
          개
        </BPDetail.SummaryBox>
        <BPDetail.BtnLine>
          <BPDetail.GrayBtn>기본 템플릿</BPDetail.GrayBtn>
          <BPDetail.GrayBtn>편집 후 만들기</BPDetail.GrayBtn>
          <BPDetail.NextStepBtn $available={selectedConceptList.length !== 0} onClick={openCreateModal}>
            바로 만들기
          </BPDetail.NextStepBtn>
        </BPDetail.BtnLine>
      </BP.RightSection>
    </BP.Wrapper>
  );
};

export default WrongByPaper;

const BP = {
  Wrapper: styled.div`
    background-color: white;
    overflow-y: auto;
    width: 133rem;
    height: 75rem;
    margin: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 0.01rem solid ${({ theme }) => theme.colors.gray20};
    display: flex;
    flex-direction: row;
    overflow: hidden;
  `,
  LeftSection: styled.section`
    width: 80rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  RightSection: styled.section`
    width: 52.8rem;
    height: 75rem;
    border-left: 0 1rem solid ${({ theme }) => theme.colors.gray20};
    background-color: red;
  `,
};

const PAPERLIST = {
  Wrapper: styled.div`
    width: 113.5rem;
    height: 80rem;
    border-radius: 1rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding-top: 1.5rem;
    overflow: hidden;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  ListHeader: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
  `,
  InfoLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
    padding-left: 2.5rem;
    font-size: 1.4rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray50};
  `,
  AttributeBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    text-align: ${({ $isTitle }) => ($isTitle ? `left` : `center`)};
    padding-left: ${({ $isTitle }) => ($isTitle ? `3rem` : `0rem`)};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: 66rem;
    overflow-y: hidden;
    &:hover {
      overflow-y: overlay;
    }
    &::-webkit-scrollbar {
      width: 0.75rem;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
      cursor: grab;
    }
    &::-webkit-scrollbar-track {
      background: transparent; /* 트랙을 투명하게 설정 */
    }
  `,
  QuestionPaperLine: styled.article`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-block: 0.005rem solid ${({ theme }) => theme.colors.gray10};
  `,
  CellBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    height: 5rem;
    padding-left: ${({ $isTitle }) => ($isTitle ? `3rem` : `0rem`)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isTitle, theme }) => ($isTitle ? theme.colors.gray80 : theme.colors.gray60)};
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
    cursor: pointer;
    overflow: hidden;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
  `,
  PaperTitleLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray80};
  `,
};

const BPDetail = {
  InfoLine: styled.div`
    width: 100%;
    height: 5rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 400;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
  `,
  QuesNumLine: styled.div`
    width: 100%;
    height: 5rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray50};
  `,
  ListOptionLine: styled.div`
    width: 100%;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  `,
  ListOptionBtn: styled.button`
    width: 26.5rem;
    height: 4.5rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
    border-top: ${({ $isSelected, theme }) => ($isSelected ? `0.1rem solid ${theme.colors.gray20}` : `none`)};
    border-bottom: ${({ $isSelected, theme }) => ($isSelected ? `none` : `0.1rem solid ${theme.colors.gray20}`)};
    border-right: ${({ $isLeft, theme }) => $isLeft && `0.1rem solid ${theme.colors.gray20}`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
  `,
  SettingSection: styled.div`
    width: 53rem;
    height: 46.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    background-color: white;
    padding-inline: 1rem;
    overflow: hidden;
    &:hover {
      overflow-y: overlay;
    }
    &::-webkit-scrollbar {
      width: 0.75rem;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
      cursor: grab;
    }
    &::-webkit-scrollbar-track {
      background: transparent; /* 트랙을 투명하게 설정 */
    }
  `,
  DescriptionLine: styled.div`
    width: 51rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  Container: styled.div`
    width: 51rem;
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    padding: 2rem;
    margin-top: 1rem;
  `,
  Label: styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    margin-top: 0.5rem;
  `,

  GroupBtn: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 1.75rem;
    cursor: pointer;
    margin-block: 1rem;
  `,
  RadioBtn: styled.div`
    width: 1.8rem;
    height: 1.8rem;
    border: ${({ $isChecked, theme }) => ($isChecked ? `0.2rem ${theme.colors.mainColor}` : `0.1rem black`)} solid;
    border-radius: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    margin-right: 1rem;
    color: ${({ theme }) => theme.colors.mainColor};
    &:hover {
      border: ${({ theme }) => `0.2rem ${theme.colors.mainColor}`} solid;
    }
  `,
  SetBox: styled.div`
    width: 48rem;
    height: 6.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    font-size: 1.4rem;
    font-weight: 600;
    gap: 1rem;
    color: ${({ theme }) => theme.colors.deepDark};
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.brightMain : `white`)};
    border: ${({ $isChecked, theme }) =>
        $isChecked ? `0.1rem ${theme.colors.mainColor}` : `0.1rem ${theme.colors.gray20}`}
      solid;
  `,
  PlusMinusBtn: styled.button`
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.2rem;
    background-color: white;
    color: ${({ theme }) => theme.colors.gray50};
    border: ${({ theme }) => `0.1rem ${theme.colors.gray20}`} solid;
  `,
  QuesNumPerConcept: styled.input`
    width: 4.5rem;
    height: 3rem;
    border-radius: 0.5rem;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray50};
    border: ${({ theme }) => `0.1rem ${theme.colors.gray20}`} solid;
  `,
  TotalNumInput: styled.input`
    width: 6rem;
    height: 3.75rem;
    border-radius: 0.5rem;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray50};
    border: ${({ theme }) => `0.1rem ${theme.colors.gray20}`} solid;
  `,
  SubText: styled.p`
    font-size: 1.4rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray50};
  `,

  SummaryBox: styled.div`
    width: 53rem;
    height: 7rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.deepDark};
    text-align: center;
    align-content: center;
  `,
  QuesNumber: styled.a`
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.mainColor};
    cursor: default;
  `,
  BtnLine: styled.div`
    width: 53rem;
    height: 7rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
  `,
  GrayBtn: styled.button`
    height: 4rem;
    padding-inline: 1.5rem;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gray60};
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    margin-right: 2rem;
  `,
  NextStepBtn: styled.button`
    width: 13rem;
    height: 4rem;
    border-radius: 0.5rem;
    margin-left: auto;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    background-color: ${({ $available, theme }) => ($available ? theme.colors.mainColor : theme.colors.gray30)};
  `,
};
