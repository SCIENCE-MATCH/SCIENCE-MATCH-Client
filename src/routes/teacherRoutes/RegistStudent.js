import { eventWrapper } from "@testing-library/user-event/dist/utils";
import Styles from "./RegistStudent.module.css";
import { useState, useEffect } from "react";
import Colors from "../../components/Colors.module.css";
import userEvent from "@testing-library/user-event";

const RegistStudent = ({ closeModal }) => {
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [parentNum, setParentNum] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("초");
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [gradeChanged, setGradeChanged] = useState(true);

  /*
  "grade": "고1",
  "name": "김사피",
  "parentNum": "01012345679",
  "phoneNum": "01087654321" */
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onPhoneNumChange = (event) => {
    setPhoneNum(event.target.value);
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
        <h2>학생 개별 등록</h2>
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
                  <option value="1" selected>
                    1학년
                  </option>
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
            <input
              className={Styles.inputBox}
              type={Number}
              value={phoneNum}
              onChange={onPhoneNumChange}
              maxLength="11"
              placeholder="숫자만 입력해주세요"
            />
          </div>
          <div>
            <p>학부모 연락처</p>
            <input
              className={Styles.inputBox}
              type={Number}
              value={parentNum}
              onChange={onParentNumChange}
              maxLength="11"
              placeholder="숫자만 입력해주세요"
            />
          </div>
        </div>
        <div
          style={{
            alignContent: "",
            width: 550,
            marginTop: 75,
            marginLeft: 25
          }}
        >
          <button className={Styles.closebutton} onClick={closeModal}>
            닫기
          </button>
          <button className={Styles.submitbutton}>등록하기</button>
        </div>
      </div>
    </div>
  );
};

export default RegistStudent;
