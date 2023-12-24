import { eventWrapper } from "@testing-library/user-event/dist/utils";
import Styles from "./RegistStudent.module.css";
import { useState, useEffect } from "react";
import Colors from "../../../components/Colors.module.css";
import { getCookie } from "../../../components/_Common/cookie";
import Axios from "axios";

const UpdateStudent = ({ closeModal, thisStd }) => {
  const [grade, setGrade] = useState(thisStd.grade);
  const [name, setName] = useState(thisStd.name);
  const [parentNum, setParentNum] = useState(thisStd.parentNum);
  const [phoneNum, setPhoneNum] = useState(thisStd.phoneNum);
  const [selectedGrade, setSelectedGrade] = useState(thisStd.grade[0]);
  const [selectedNumber, setSelectedNumber] = useState(thisStd.grade[1]);
  const [gradeChanged, setGradeChanged] = useState(true);

  /*
  "grade": "고1",
  "name": "김사피",
  "parentNum": "01012345679",
  "phoneNum": "01087654321" */

  const register = () => {
    const phoneNumPattern = /^[0-9]{10,11}$/;
    const namePattern = /^[A-Za-z가-힣]{2,10}$/;
    phoneNumPattern.test(phoneNum) && namePattern.test(name)
      ? registerStd()
      : alert("형식이 맞지 않습니다");
  };

  const registerStd = async () => {
    try {
      const accessToken = await getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/student/update";
      const data = {
        grade: grade,
        name: name,
        parentNum: parentNum,
        phoneNum: phoneNum
      };
      //console.log(accessToken);
      //console.log(grade, name, parentNum, phoneNum);

      const response = await Axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      //console.log("API 응답 데이터:", response.data);
      alert("저장 완료!");
      closeModal();
    } catch (error) {
      // API 요청이 실패한 경우
      console.error(
        "API 요청 실패:",
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.code === "409") {
        alert("이미 존재하는 학생입니다. 전화번호를 확인하세요.");
      }
    }
  };

  const deleteStd = async () => {
    try {
      const accessTokenForD = await getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/student/delete?phoneNum=${phoneNum}`;
      //console.log(accessToken);
      //console.log(grade, name, parentNum, phoneNum);

      const response = await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessTokenForD}`
        }
      });

      //console.log("API 응답 데이터:", response.data);
      alert("학생이 퇴원처리 되었습니다.");
      closeModal();
    } catch (error) {
      // API 요청이 실패한 경우
      console.error(
        "API 요청 실패:",
        error.response.data.code,
        error.response.data.message,
        "|",
        error.response
      );
    }
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onParentNumChange = (event) => {
    setParentNum(event.target.value);
  };

  useEffect(() => {
    setGrade(`${selectedGrade}${selectedNumber}`);
  }, [selectedGrade, selectedNumber]);
  return (
    <div className={Styles["modal-overlay"]}>
      <div className={Styles.modal}>
        <h2>학생 정보 수정</h2>
        <div
          style={{
            display: "flex",
            alignContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 25,
              marginRight: 25,
              marginBottom: "20px"
            }}
          >
            <p>학생 이름</p>
            <input
              className={Styles.inputBox}
              value={name}
              onChange={onNameChange}
              maxLength="15"
              placeholder="이름을 입력해주세요"
            />
          </div>
          <div>
            <p>학년</p>
            <div>
              <button
                className={
                  selectedGrade === "초" ? Styles.selected : Styles.gradeBtn
                }
                onClick={() => {
                  setSelectedGrade("초");
                  setGradeChanged(true);
                  setSelectedNumber("1");
                }}
              >
                초
              </button>
              <button
                className={
                  selectedGrade === "중" ? Styles.selected : Styles.gradeBtn
                }
                onClick={() => {
                  setSelectedGrade("중");
                  setGradeChanged(true);
                  setSelectedNumber("1");
                }}
              >
                중
              </button>
              <button
                className={
                  selectedGrade === "고" ? Styles.selected : Styles.gradeBtn
                }
                onClick={() => {
                  setSelectedGrade("고");
                  setGradeChanged(true);
                  setSelectedNumber("1");
                }}
              >
                고
              </button>
              {selectedGrade === "초" ? (
                <select
                  value={gradeChanged ? "1" : selectedNumber}
                  onChange={(e) => {
                    setGradeChanged(false);
                    setSelectedNumber(e.target.value);
                  }}
                  style={{ width: 80, height: 45, borderRadius: 10 }}
                >
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                  <option value="5">5학년</option>
                  <option value="6">6학년</option>
                </select>
              ) : (
                <select
                  value={gradeChanged ? "1" : selectedNumber}
                  onChange={(e) => {
                    setGradeChanged(false);
                    setSelectedNumber(e.target.value);
                  }}
                  style={{ width: 80, height: 45, borderRadius: 10 }}
                >
                  <option value="1" selected>
                    1학년
                  </option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 25,
              marginRight: 25
            }}
          >
            <p>학생 연락처</p>
            <input className={Styles.inputBox} value={phoneNum} disabled />
          </div>
          <div>
            <p>학부모 연락처</p>
            <input
              className={Styles.inputBox}
              value={parentNum}
              onChange={onParentNumChange}
              maxLength="11"
              placeholder="숫자만 입력해주세요"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyItems: "center",
            width: 550,
            marginTop: 75,
            marginLeft: 25
          }}
        >
          <button className={Styles.closebutton} onClick={closeModal}>
            닫기
          </button>
          <button className={Styles.deletebutton} onClick={deleteStd}>
            학생 삭제
          </button>
          <button className={Styles.submitbutton} onClick={register}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudent;
