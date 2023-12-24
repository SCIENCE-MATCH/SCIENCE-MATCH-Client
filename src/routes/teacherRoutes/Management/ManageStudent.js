import { useState, useEffect } from "react";
import RegistStudent from "./RegistStudent";
import UpdateStudent from "./UpdateStudent";
import { getCookie } from "../../../components/_Common/cookie";
import Axios from "axios";
import Styles from "./ManageStudent.module.css";

const ManageStudent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [thisStd, setThisStd] = useState([]);
  const [searchGrade, setSearchGrade] = useState("전체");
  const [searchDeleted, setSearchDeleted] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    init();
  };

  const openUpdate = () => {
    setUpdateModalOpen(true);
  };
  const closeUpdate = () => {
    setUpdateModalOpen(false);
    init();
  };

  const init = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/students";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setStudents(response.data.data);
    } catch (error) {
      // API 요청이 실패한 경우
      alert("학생 정보를 불러오지 못했습니다.");
      console.error(
        "API 요청 실패:",
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "flex-end"
        }}
      >
        <button
          className={
            searchGrade === "전체" ? Styles.selectedGrade : Styles.gradeBtn
          }
          onClick={() => {
            setSearchGrade("전체");
          }}
        >
          전체
        </button>
        <button
          className={
            searchGrade === "초" ? Styles.selectedGrade : Styles.gradeBtn
          }
          onClick={() => {
            setSearchGrade("초");
          }}
        >
          초
        </button>
        <button
          className={
            searchGrade === "중" ? Styles.selectedGrade : Styles.gradeBtn
          }
          onClick={() => {
            setSearchGrade("중");
          }}
        >
          중
        </button>
        <button
          className={
            searchGrade === "고" ? Styles.selectedGrade : Styles.gradeBtn
          }
          onClick={() => {
            setSearchGrade("고");
          }}
        >
          고
        </button>
        <button
          className={
            searchDeleted === false ? Styles.selectedGrade : Styles.gradeBtn
          }
          onClick={() => {
            setSearchDeleted(false);
          }}
        >
          재원생
        </button>
        <button
          className={searchDeleted ? Styles.selectedGrade : Styles.gradeBtn}
          onClick={() => {
            setSearchDeleted(true);
          }}
        >
          퇴원생
        </button>
        <button onClick={openModal}>학생 개별 등록</button>
        {modalOpen && <RegistStudent closeModal={closeModal} />}
      </div>
      <div>
        <ul>
          {students.map(
            (student, index) =>
              (searchDeleted ? !student.deleted : student.deleted) || (
                <li key={index}>
                  {student.grade}--{student.name}--{student.phoneNum}--
                  {student.deleted ? "퇴원" : "재원"}--
                  {student.parentNum}
                  <button
                    onClick={() => {
                      openUpdate();
                      setThisStd(student);
                    }}
                  >
                    상세
                  </button>
                </li>
              )
          )}
        </ul>
        {updateModalOpen && (
          <UpdateStudent closeModal={closeUpdate} thisStd={thisStd} />
        )}
      </div>
    </div>
  );
};

export default ManageStudent;
