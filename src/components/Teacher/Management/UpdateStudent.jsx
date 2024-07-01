import { useState, useEffect } from "react";
import { getCookie } from "../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";

const UpdateStudent = ({ closeModal, thisStd }) => {
  const [grade, setGrade] = useState(thisStd.grade);
  const [name, setName] = useState(thisStd.name);
  const [parentNum, setParentNum] = useState(thisStd.parentNum);
  const phoneNum = thisStd.phoneNum;
  const [selectedGrade, setSelectedGrade] = useState(thisStd.grade[0]);
  const [selectedNumber, setSelectedNumber] = useState(thisStd.grade[1]);

  const register = () => {
    const phoneNumPattern = /^[0-9]{10,11}$/;
    const namePattern = /^[A-Za-z가-힣]{2,10}$/;
    phoneNumPattern.test(phoneNum) && namePattern.test(name) ? updateStd() : alert("형식이 맞지 않습니다");
  };

  const updateStd = async () => {
    try {
      const accessToken = await getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/student/update";
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

      alert("저장 완료!");
      closeModal();
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
      if (error.response.data.code === "409") {
        alert("이미 존재하는 학생입니다. 전화번호를 확인하세요.");
      }
    }
  };

  const deleteStd = async () => {
    try {
      const accessToken = await getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/student/delete?phoneNum=${phoneNum}`;
      await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("학생이 퇴원처리 되었습니다.");
      closeModal();
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message, "|", error.response);
      alert("오류가 발생했습니다.");
      closeModal();
    }
  };
  const re_enrollStd = async () => {
    try {
      const accessToken = await getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/student/re-enroll?studentId=${thisStd.id}`;

      await Axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("학생을 재등록했습니다.");
      closeModal();
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message, "|", error.response);
      alert("오류가 발생했습니다.");
      closeModal();
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
        <USTUD.Title>학생 정보 수정</USTUD.Title>
        <USTUD.ContentLine>
          <USTUD.ContentBox>
            <USTUD.InputLabel>학생 이름</USTUD.InputLabel>
            <USTUD.InputBox
              value={name}
              onChange={onNameChange}
              maxLength="15"
              placeholder="이름을 입력하세요"
              disabled={thisStd.disabled}
            />
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
                disabled={thisStd.disabled}
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
                disabled={thisStd.disabled}
              >
                고
              </USTUD.GradeBtn>
              {selectedGrade === "초" ? (
                <USTUD.StyledSelect
                  value={selectedNumber}
                  onChange={(e) => {
                    setSelectedNumber(e.target.value);
                  }}
                  disabled={thisStd.disabled}
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
                  disabled={thisStd.disabled}
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
            <USTUD.InputBox value={formatPhoneNum(phoneNum)} disabled />
          </USTUD.ContentBox>
          <USTUD.ContentBox>
            <USTUD.InputLabel>학부모 연락처</USTUD.InputLabel>
            <USTUD.InputBox
              value={formatPhoneNum(parentNum)}
              onChange={onParentNumChange}
              maxLength="13"
              placeholder="010 이후로 입력하세요"
              disabled={thisStd.disabled}
            />
          </USTUD.ContentBox>
        </USTUD.ContentLine>
        <USTUD.BtnLine>
          <USTUD.CloseBtn onClick={closeModal}>닫기</USTUD.CloseBtn>
          {thisStd.deleted ? (
            <USTUD.ReturnBtn onClick={re_enrollStd}>재등원 처리</USTUD.ReturnBtn>
          ) : (
            <USTUD.DeleteBtn onClick={deleteStd}>퇴원 처리</USTUD.DeleteBtn>
          )}
          {!thisStd.deleted && <USTUD.SubmitBtn onClick={register}>저장하기</USTUD.SubmitBtn>}
        </USTUD.BtnLine>
      </USTUD.Modal>
    </USTUD.ModalOverlay>
  );
};

export default UpdateStudent;

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
  DeleteBtn: styled.button`
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
  ReturnBtn: styled.button`
    margin-left: 1rem;
    width: 12rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.gray40};
    color: white;
    margin-left: auto;
  `,
};
