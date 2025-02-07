import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useGetLevelRatio from "../../../../../../libs/hooks/Teacher/useGetLevelRatio";
import usePostSetRatios from "../../../../../../libs/apis/Teacher/Prepare/postSetLevelRatio";
const SetLevelRatio = ({ closeModal }) => {
  const { originalLevels, getLevelRatio } = useGetLevelRatio();
  const { postSetRatios } = usePostSetRatios();

  const [readyToSend, setReadyToSend] = useState(false);
  const [emptyRatio, setEmptyRatio] = useState([
    {
      id: 1,
      level: "HARD",
      low: 0,
      mediumLow: 0,
      medium: 30,
      mediumHard: 30,
      hard: 40,
    },
    {
      id: 2,
      level: "MEDIUM_HARD",
      low: 0,
      mediumLow: 20,
      medium: 30,
      mediumHard: 30,
      hard: 20,
    },
    {
      id: 3,
      level: "MEDIUM",
      low: 5,
      mediumLow: 30,
      medium: 30,
      mediumHard: 25,
      hard: 10,
    },
    {
      id: 4,
      level: "MEDIUM_LOW",
      low: 20,
      mediumLow: 40,
      medium: 30,
      mediumHard: 10,
      hard: 0,
    },
    {
      id: 5,
      level: "LOW",
      low: 40,
      mediumLow: 40,
      medium: 20,
      mediumHard: 0,
      hard: 0,
    },
  ]);
  const [ratios, setRatios] = useState([...emptyRatio]);
  const [sumArr, setSumArr] = useState([100, 100, 100, 100, 100]);
  useEffect(() => {
    getLevelRatio();
  }, []);
  useEffect(() => {
    if (originalLevels.length > 0) {
      let tempRatios = [...emptyRatio];
      originalLevels.forEach((level) => {
        const index = tempRatios.findIndex((ratio) => ratio.level === level.level);
        if (index !== -1) {
          tempRatios[index].id = level.id;
        }
      });
      setEmptyRatio(tempRatios);
      setRatios(originalLevels);
      setReadyToSend(true);
    }
  }, [originalLevels]);

  const onRatioChange = (e, level, key) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value > 100) value = value % 10;
    const updatedRatios = ratios.map((ratio) => {
      if (ratio.level === level) {
        return { ...ratio, [key]: value };
      }
      return ratio;
    });
    let allSumsAre100 = true;
    let tempSumArr = [...sumArr];
    updatedRatios.forEach((ratio, index) => {
      let tempSum = ratio.low + ratio.mediumLow + ratio.medium + ratio.mediumHard + ratio.hard;
      tempSumArr[index] = tempSum;
      if (tempSum !== 100) {
        allSumsAre100 = false;
      }
    });
    setSumArr(tempSumArr);
    setReadyToSend(allSumsAre100);
    setRatios(updatedRatios);
  };

  const initRatios = () => {
    setSumArr([100, 100, 100, 100, 100]);
    setRatios(emptyRatio);
    setReadyToSend(true);
  };

  const saveAndPost = async () => {
    await postSetRatios(ratios);
    closeModal();
  };

  const levelToKor = { HARD: "상", MEDIUM_HARD: "중상", MEDIUM: "중", MEDIUM_LOW: "중하", LOW: "하" };

  return (
    <MODAL.Modal_Overlay>
      <MODAL.SettingModal>
        <MODAL.TitleLine>
          <MODAL.ModalTitle>난이도 비율 변경</MODAL.ModalTitle>
          <MODAL.SmallTitle>각 난이도 출제 비율 총합은 100이어야 합니다.</MODAL.SmallTitle>
          <MODAL.CloseBtn
            onClick={() => {
              closeModal();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </MODAL.CloseBtn>
        </MODAL.TitleLine>
        <MODAL.HeaderLine>
          <MODAL.LevelLabel />
          <MODAL.HeaderBox>하</MODAL.HeaderBox>
          <MODAL.HeaderBox>중하</MODAL.HeaderBox>
          <MODAL.HeaderBox>중</MODAL.HeaderBox>
          <MODAL.HeaderBox>중상</MODAL.HeaderBox>
          <MODAL.HeaderBox>상</MODAL.HeaderBox>
          <MODAL.HeaderBox>총합</MODAL.HeaderBox>
        </MODAL.HeaderLine>
        {ratios.map((ratio, index) => (
          <MODAL.SetLine key={ratio.id}>
            <MODAL.LevelLabel>{levelToKor[ratio.level]} 선택시</MODAL.LevelLabel>
            <MODAL.LevelInput
              $value={ratio.low}
              value={ratio.low}
              onChange={(e) => onRatioChange(e, ratio.level, "low")}
            />
            <MODAL.LevelInput
              $value={ratio.mediumLow}
              value={ratio.mediumLow}
              onChange={(e) => onRatioChange(e, ratio.level, "mediumLow")}
            />
            <MODAL.LevelInput
              $value={ratio.medium}
              value={ratio.medium}
              onChange={(e) => onRatioChange(e, ratio.level, "medium")}
            />
            <MODAL.LevelInput
              $value={ratio.mediumHard}
              value={ratio.mediumHard}
              onChange={(e) => onRatioChange(e, ratio.level, "mediumHard")}
            />
            <MODAL.LevelInput
              $value={ratio.hard}
              value={ratio.hard}
              onChange={(e) => onRatioChange(e, ratio.level, "hard")}
            />
            <MODAL.SumBox $wrong={sumArr[index] !== 100}>{sumArr[index]}</MODAL.SumBox>
          </MODAL.SetLine>
        ))}
        <MODAL.BtnContainer>
          <MODAL.InitBtn onClick={initRatios}>기본값 복원</MODAL.InitBtn>
          <MODAL.ConfirmBtn onClick={saveAndPost} disabled={!readyToSend}>
            저장하기
          </MODAL.ConfirmBtn>
        </MODAL.BtnContainer>
      </MODAL.SettingModal>
    </MODAL.Modal_Overlay>
  );
};

export default SetLevelRatio;

const MODAL = {
  Modal_Overlay: styled.div`
    z-index: 15; /* Ensure the dropdown is above other elements */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  SettingModal: styled.div`
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    width: 72rem;
    display: flex;
    flex-direction: column;
  `,
  TitleLine: styled.div`
    width: 100%;
    display: flex;
    height: 7rem;
    padding-left: 3rem;
    flex-direction: row;
    align-items: center;
  `,
  ModalTitle: styled.div`
    height: 5rem;
    font-size: 1.8rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-right: 2rem;
  `,
  SmallTitle: styled.div`
    font-size: 1.5rem;
    margin-top: 0.3rem;
    color: ${({ theme }) => theme.colors.gray40};
    font-weight: bold;
    display: flex;
    align-items: center;
  `,
  CloseBtn: styled.button`
    width: 5rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.gray40};
    margin-left: auto;
    margin-right: 1rem;
  `,
  HeaderLine: styled.div`
    height: 4rem;
    padding-left: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
  `,
  HeaderBox: styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    width: 7.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.gray30};
    margin-right: 1.5rem;
    &:last-child {
      margin-right: 0rem;
      width: 8rem;
    }
  `,
  SetLine: styled.div`
    height: 6.5rem;
    display: flex;
    align-items: center;
    padding-left: 1rem;
  `,
  LevelLabel: styled.div`
    width: 15rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gray70};
  `,
  LevelInput: styled.input`
    width: 7.5rem;
    height: 4rem;
    border-radius: 0.6rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1rem;
    text-align: center;
    margin-right: 1.5rem;
    color: ${({ $value, theme }) => {
      switch (parseInt(($value + 9) / 10)) {
        case 0:
          return theme.colors.gray15;
        case 1:
          return theme.colors.gray40;
        case 2:
          return theme.colors.gray50;
        case 3:
          return theme.colors.gray70;
        case 4:
          return theme.colors.gray90;
        case 5:
          return theme.colors.purple;
        default:
          return theme.colors.mainColor;
      }
    }};
  `,
  SumBox: styled.div`
    width: 8rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 600;
    padding: 1rem;
    text-align: center;
    color: ${({ $wrong, theme }) => ($wrong ? theme.colors.warning : theme.colors.gray80)};
  `,
  BtnContainer: styled.div`
    width: 100%;
    height: 5rem;
    margin-block: 1.5rem;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  `,
  InitBtn: styled.button`
    height: 4rem;
    width: 12rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray00};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    color: ${({ theme }) => theme.colors.gray70};
    font-size: 1.5rem;
  `,
  ConfirmBtn: styled.button`
    height: 4rem;
    width: 14rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray30};
    }
  `,
};
