import { faArrowRight, faGear, faO, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import SetLevelRatio from "./SetLevelRatio";
import { useState } from "react";
const DetailOfNormal = ({
  quesNum,
  setQuesNum,
  quesTypes,
  setQuesTypes,
  mockIncluded,
  setMockIncluded,
  paperDifficulty,
  setPaperDifficulty,
  selectedChapters,
  setCreateStep,
  preventNext,
  getQuestions,
  setIsOnlyConcept,
  onOnlyConceptClick,
}) => {
  const quesNumOptions = [25, 50, 75, 100];
  const difficultyOptions = ["하", "중하", "중", "중상", "상"];
  const quesTypeOptions = ["MULTIPLE", "SUBJECTIVE", "DESCRIPTIVE"];
  const mockOptions = ["모의고사 포함", "모의고사 제외", "모의고사만"];
  const changeQuesNum = (e) => {
    const inputValue = e.target.value;
    const numericValue = Number(inputValue);

    // 숫자가 아니면 0을 사용, 그렇지 않으면 0과 150 사이의 숫자로 제한
    const value = isNaN(numericValue) ? 0 : Math.max(0, Math.min(150, numericValue));
    setQuesNum(value);
  };
  const changeDifficulty = (e) => {
    setPaperDifficulty(e.target.value);
  };
  const changeQuesTypes = (e) => {
    if (quesTypes.includes(e.target.value)) setQuesTypes(quesTypes.filter((type) => type !== e.target.value));
    else setQuesTypes([...quesTypes, e.target.value]);
  };
  const changeIncludeM = (e) => {
    setMockIncluded(e.target.value);
  };

  const typeToKorean = { MULTIPLE: "선택형", SUBJECTIVE: "단답형", DESCRIPTIVE: "서술형" };

  const [isSettingLevel, setIsSettingLevel] = useState(false);

  return (
    <CQP.QuestionSettings>
      {isSettingLevel && (
        <SetLevelRatio
          closeModal={() => {
            setIsSettingLevel(false);
          }}
        />
      )}
      <CQP.LabelContainer>
        <CQP.SettingLabel>문제수</CQP.SettingLabel>
        <CQP.AdditoinalDescription>최대 150문제</CQP.AdditoinalDescription>
      </CQP.LabelContainer>
      <CQP.SettingLine style={{ marginBottom: "0rem" }}>
        <CQP.BtnContainer>
          {quesNumOptions.map((opt) => (
            <CQP.DetailBtn $isSelected={quesNum === opt} value={opt} onClick={changeQuesNum} key={opt}>
              {opt}
            </CQP.DetailBtn>
          ))}
        </CQP.BtnContainer>
        <CQP.InputNumber value={quesNum} onChange={changeQuesNum} />
        <CQP.NumberLabel>문제</CQP.NumberLabel>
      </CQP.SettingLine>
      <CQP.RangeInput type="range" min="0" max="150" value={quesNum} onChange={changeQuesNum} />
      <CQP.NumLabelContainer>
        <CQP.NumberLabel>0</CQP.NumberLabel>
        <CQP.NumberLabel styles={{ marginLeft: "100px" }}>150</CQP.NumberLabel>
      </CQP.NumLabelContainer>

      <CQP.LabelContainer>
        <CQP.SettingLabel>난이도</CQP.SettingLabel>
        <CQP.LevelSetBtn
          onClick={() => {
            setIsSettingLevel(true);
          }}
        >
          <FontAwesomeIcon icon={faGear} style={{ marginRight: `0.5rem` }} />
          난이도 설정
        </CQP.LevelSetBtn>
      </CQP.LabelContainer>
      <CQP.SettingLine>
        {difficultyOptions.map((opt) => (
          <CQP.DetailBtn $isSelected={paperDifficulty === opt} value={opt} onClick={changeDifficulty} key={opt}>
            {opt}
          </CQP.DetailBtn>
        ))}
      </CQP.SettingLine>

      <QT.GrayBox>
        <CQP.NumLabelContainer>
          <CQP.SettingLabel>문제 타입</CQP.SettingLabel>
          <QT.AutoGrading $isAuto={quesTypes.length === 1 && quesTypes[0] === "MULTIPLE"}>
            자동 채점 <FontAwesomeIcon icon={quesTypes.length === 1 && quesTypes[0] === "MULTIPLE" ? faO : faX} />
          </QT.AutoGrading>
        </CQP.NumLabelContainer>

        <CQP.SettingLine>
          {quesTypeOptions.map((opt) => (
            <CQP.DetailBtn $isSelected={quesTypes.includes(opt)} value={opt} onClick={changeQuesTypes} key={opt}>
              {typeToKorean[opt]}
            </CQP.DetailBtn>
          ))}
        </CQP.SettingLine>
      </QT.GrayBox>

      <CQP.LabelContainer>
        <CQP.SettingLabel>모의고사 포함 여부</CQP.SettingLabel>
      </CQP.LabelContainer>
      <CQP.SettingLine>
        {mockOptions.map((opt) => (
          <CQP.DetailBtn $isSelected={mockIncluded === opt} value={opt} onClick={changeIncludeM} key={opt}>
            {opt}
          </CQP.DetailBtn>
        ))}
      </CQP.SettingLine>

      <QT.SummaryBox>
        학습지 문제 수 <QT.QuesNumber>{quesNum}</QT.QuesNumber> 개 | 유형 {selectedChapters.length}개
      </QT.SummaryBox>
      <QT.BtnLine>
        <QT.OnlyConceptBtn
          onClick={async () => {
            setIsOnlyConcept(true);
            await onOnlyConceptClick();
            setCreateStep(3);
          }}
          disabled={preventNext}
          $available={!preventNext}
        >
          개념만 모아 만들기
        </QT.OnlyConceptBtn>
        <QT.NextStepBtn
          onClick={() => {
            setIsOnlyConcept(false);
            setCreateStep(2);
            getQuestions();
          }}
          disabled={preventNext}
          $available={!preventNext}
        >
          다음 단계
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: `0.5rem` }} />
        </QT.NextStepBtn>
      </QT.BtnLine>
    </CQP.QuestionSettings>
  );
};

export default DetailOfNormal;

const CQP = {
  QuestionSettings: styled.div`
    background-color: ${({ theme }) => theme.colors.headerBg};
    width: 45rem;
    height: 74rem;
    border-radius: 1rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    overflow: hidden;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  LabelContainer: styled.div`
    width: 100%;
    height: 5rem;
    justify-content: left;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  SettingLabel: styled.div`
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.6rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gray};
  `,
  LevelSetBtn: styled.div`
    width: 10.5rem;
    height: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.gray40};
    margin-left: auto;
    margin-right: 1.5rem;
    cursor: pointer;
  `,
  AdditoinalDescription: styled.a`
    font-size: 1.4rem;
    font-weight: normal;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  NumLabelContainer: styled.div`
    width: 100%;
    height: 4rem;
    padding: 0 0.5rem 0 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  NumberLabel: styled.div`
    width: 4rem;
    height: 4rem;
    align-content: center;
    text-align: center;
    font-size: 1.6rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  SettingLine: styled.div`
    padding: 0 1rem 0 1rem;
    height: 5rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 3rem;
  `,
  BtnContainer: styled.div`
    padding: 0 1rem 0 0;
    height: 5rem;
    width: 27.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
  `,
  DetailBtn: styled.button`
    flex: 1;
    height: 4rem;
    border-radius: 0.4rem;
    margin: 0 0.5rem 0 0.5rem;
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0.1rem ${theme.colors.gray20}`};
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    background-color: white;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray20)};
  `,
  InputNumber: styled.input`
    width: 6rem;
    height: 3.75rem;
    margin: 0 0.5rem 0 1.5rem;
    border-radius: 0.4rem;
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};

    font-size: 1.4rem;
    text-align: center;
  `,
  RangeInput: styled.input.attrs({ type: "range" })`
    -webkit-appearance: none; /* 웹킷(크롬, 사파리 등) 브라우저의 기본 스타일 제거 */
    width: 90%; /* 전체 너비 사용 */
    margin-top: 1.125rem;
    background: transparent; /* 배경색 투명 */

    /* 웹킷 브라우저용 트랙 스타일 */
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 0.5rem;
      background: ${({ theme }) => theme.colors.background};
      border-radius: 5px;
      border: none;
      &:hover {
        background-color: ${({ theme }) => theme.colors.main20};
      }
    }

    /* 웹킷 브라우저용 썸 스타일 */
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 1.5rem;
      width: 1.5rem;
      margin-top: -0.5rem; /* 트랙 중앙에 위치 */
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 2rem;
      cursor: pointer;
      &:hover {
        background-color: ${({ theme }) => theme.colors.main80};
        height: 1.75rem;
        width: 1.75rem;
        margin-top: -0.583rem; /* 트랙 중앙에 위치 */
      }
    }
  `,
};
const QT = {
  GrayBox: styled.div`
    padding: 2rem 0 0 0;
    width: 41rem;
    height: 12rem;
    border-radius: 1.5rem;
    margin-bottom: 2rem;
    background-color: ${({ theme }) => theme.colors.gray05};
  `,
  AutoGrading: styled.div`
    width: 10rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ $isAuto, theme }) => ($isAuto ? theme.colors.gray : theme.colors.unselected)};
  `,
  SummaryBox: styled.div`
    width: 45rem;
    height: 8rem;
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
    width: 39rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  OnlyConceptBtn: styled.button`
    width: 19rem;
    height: 5rem;
    border-radius: 1rem;
    margin-top: 2rem;
    font-size: 1.75rem;
    font-weight: bold;
    color: white;
    background-color: ${({ $available, theme }) => ($available ? theme.colors.warning : theme.colors.gray30)};
  `,
  NextStepBtn: styled.button`
    width: 15rem;
    height: 5rem;
    border-radius: 1rem;
    margin-top: 2rem;
    margin-left: auto;
    font-size: 1.75rem;
    font-weight: bold;
    color: white;
    background-color: ${({ $available, theme }) => ($available ? theme.colors.mainColor : theme.colors.gray30)};
  `,
};
