import { useState, useEffect } from "react";
import { getCookie } from "../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const RegistStudent = ({ closeModal, setSortOption, setSearchGrade }) => {
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [parentNum, setParentNum] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("초");
  const [selectedNumber, setSelectedNumber] = useState("3");
  const [continueRegist, setContinueRegist] = useState(false);

  const register = () => {
    const phoneNumPattern = /^[0-9]{11}$/;
    const namePattern = /^[A-Za-z가-힣]{2,10}$/;
    phoneNumPattern.test(phoneNum) && namePattern.test(name) ? registerStd() : alert("형식이 맞지 않습니다");
  };

  const registerStd = async () => {
    try {
      const accessToken = await getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/student/create";
      const data = {
        grade: grade,
        name: name,
        parentNum: parentNum,
        phoneNum: phoneNum,
      };
      await Axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("등록 완료!");
      {
        continueRegist || closeModal();
      }
      setName("");
      setParentNum("");
      setPhoneNum("");
      setSortOption("default");
      setSearchGrade("전체");
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
      if (error.response.data.code === "409") {
        alert("이미 존재하는 학생입니다. 전화번호를 확인하세요.");
      }
    }
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const formatPhoneNum = (num) => {
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };
  const onPhoneNumChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    if (/^\d*$/.test(newValue)) {
      if (phoneNum === "") setPhoneNum("010" + newValue);
      else if (newValue.length < 4) setPhoneNum("");
      else setPhoneNum(newValue);
    }
  };
  const onParentNumChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    if (/^\d*$/.test(newValue)) {
      if (parentNum === "") setParentNum("010" + newValue);
      else if (newValue.length < 4) setParentNum("");
      else setParentNum(newValue);
    }
  };

  useEffect(() => {
    setGrade(`${selectedGrade}${selectedNumber}`);
  }, [selectedGrade, selectedNumber]);
  return (
    <USTUD.ModalOverlay>
      <USTUD.Modal>
        <USTUD.Title>학생 등록</USTUD.Title>
        <USTUD.ContentLine>
          <USTUD.ContentBox>
            <USTUD.InputLabel>학생 이름</USTUD.InputLabel>
            <USTUD.InputBox value={name} onChange={onNameChange} maxLength="15" placeholder="이름을 입력하세요" />
          </USTUD.ContentBox>
          <USTUD.ContentBox>
            <USTUD.InputLabel>학년</USTUD.InputLabel>
            <USTUD.GradeLine>
              <USTUD.GradeBtn
                $isSelected={selectedGrade === "초"}
                onClick={() => {
                  setSelectedGrade("초");
                  setSelectedNumber("3");
                }}
              >
                초
              </USTUD.GradeBtn>
              <USTUD.GradeBtn
                $isSelected={selectedGrade === "중"}
                onClick={() => {
                  setSelectedGrade("중");
                  setSelectedNumber("1");
                }}
              >
                중
              </USTUD.GradeBtn>
              <USTUD.GradeBtn
                $isSelected={selectedGrade === "고"}
                onClick={() => {
                  setSelectedGrade("고");
                  setSelectedNumber("1");
                }}
              >
                고
              </USTUD.GradeBtn>
              {selectedGrade === "초" ? (
                <USTUD.StyledSelect
                  value={selectedNumber}
                  onChange={(e) => {
                    setSelectedNumber(e.target.value);
                  }}
                >
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                  <option value="5">5학년</option>
                  <option value="6">6학년</option>
                </USTUD.StyledSelect>
              ) : (
                <USTUD.StyledSelect
                  value={selectedNumber}
                  onChange={(e) => {
                    setSelectedNumber(e.target.value);
                  }}
                >
                  <option value="1" selected>
                    1학년
                  </option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </USTUD.StyledSelect>
              )}
            </USTUD.GradeLine>
          </USTUD.ContentBox>
        </USTUD.ContentLine>
        <USTUD.ContentLine>
          <USTUD.ContentBox>
            <USTUD.InputLabel>학생 연락처</USTUD.InputLabel>
            <USTUD.InputBox
              value={formatPhoneNum(phoneNum)}
              onChange={onPhoneNumChange}
              maxLength="13"
              placeholder="010 이후로 입력하세요"
            />
          </USTUD.ContentBox>
          <USTUD.ContentBox>
            <USTUD.InputLabel>학부모 연락처</USTUD.InputLabel>
            <USTUD.InputBox
              value={formatPhoneNum(parentNum)}
              onChange={onParentNumChange}
              maxLength="13"
              placeholder="010 이후로 입력하세요"
            />
          </USTUD.ContentBox>
        </USTUD.ContentLine>
        <USTUD.BtnLine>
          <USTUD.CloseBtn onClick={closeModal}>닫기</USTUD.CloseBtn>
          <USTUD.CheckBoxContainer
            onClick={() => {
              setContinueRegist((prev) => !prev);
            }}
          >
            <USTUD.CheckBox $isChecked={continueRegist}>
              {continueRegist ? <FontAwesomeIcon icon={faCheck} /> : ""}
            </USTUD.CheckBox>
            <USTUD.CheckBoxLabel>계속 등록하기</USTUD.CheckBoxLabel>
          </USTUD.CheckBoxContainer>

          <USTUD.SubmitBtn onClick={register}>등록하기</USTUD.SubmitBtn>
        </USTUD.BtnLine>
      </USTUD.Modal>
    </USTUD.ModalOverlay>
  );
};

export default RegistStudent;

const USTUD = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  `,
  Modal: styled.div`
    background: white;
    padding-top: 2.5rem;
    padding-inline: 3rem;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 60rem;
    height: 33.5rem;
    display: flex;
    flex-direction: column;
  `,
  ContentLine: styled.div`
    margin-top: 2rem;
    margin-left: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  ContentBox: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,

  /* 모달 내용 스타일 */
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
  `,
  InputLabel: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1rem;
  `,
  InputBox: styled.input`
    width: 25rem;
    height: 4rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.5rem;
    font-weight: 500;
    margin-right: 1rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  GradeLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  GradeBtn: styled.button`
    width: 4.5rem;
    height: 4.5rem;
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.2rem ${theme.colors.mainColor}` : `0.1rem ${theme.colors.unselected}`};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : `white`)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    margin-right: 1rem;
  `,

  StyledSelect: styled.select`
    width: 8rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    font-size: 1.5rem;
    font-weight: 700;
    margin-right: 1rem;
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    margin-top: 4rem;
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  SubmitBtn: styled.button`
    margin-left: 1rem;
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
  `,
  KeepRegist: styled.input`
    margin-left: 1rem;
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
    margin-inline: auto;
  `,
  CheckBoxContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    margin-left: auto;
  `,
  CheckBoxLabel: styled.div`
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 700;
  `,
  CheckBox: styled.div`
    height: 2.75rem;
    width: 2.75rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : theme.colors.unselected)} solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2.5rem;
    text-align: center;
    overflow: hidden;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
  `,
};
