import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import Axios from "axios";
import Styles from "./ManageTeahcer.module.css";

const ManageTeacher = ({}) => {
  // 게시판 컴포넌트 구현
  const [teachers, setTeachers] = useState([]);
  const [showStandby, setShowStandby] = useState(true);

  const approveTeacher = async ({ id }) => {
    try {
      const accessToken = getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/admin/teachers/${id}`;
      console.log("id:", id);
      const response = await Axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log(response.data);
      /*
    teacherId: 1,
    name: '김사매',
    email: 'science@gmail.com',
    phoneNum: '01012345678',
    createdAt: '2023-09-08T14:00:19.625632'
     */
    } catch (error) {
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
  const deleteTeacher = async ({ id }) => {
    try {
      const accessToken = getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/admin/teachers/${id}`;
      const response = await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log(response.data.data);
      alert("선생을 삭제했습니다.");
      /*
    teacherId: 1,
    name: '김사매',
    email: 'science@gmail.com',
    phoneNum: '01012345678',
    createdAt: '2023-09-08T14:00:19.625632'
     */
    } catch (error) {
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
  const getStandby = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/teachers/waiting";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setTeachers(response.data.data);
      console.log(response.data);
      /*
    teacherId: 1,
    name: '김사매',
    email: 'science@gmail.com',
    phoneNum: '01012345678',
    createdAt: '2023-09-08T14:00:19.625632'
     */
    } catch (error) {
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
  const getTeachers = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/teachers";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setTeachers(response.data.data);
      console.log(response.data);
      /*
      teacherId: 1,
      name: '김사매',
      email: 'science@gmail.com',
      phoneNum: '01012345678',
      createdAt: '2023-09-08T14:00:19.625632'
       */
    } catch (error) {
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
    showStandby ? getStandby() : getTeachers();
  }, [showStandby]);
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row"
        }}
      >
        <button
          className={
            showStandby === false ? Styles.selectedBtn : Styles.unselectedBtn
          }
          onClick={() => {
            setShowStandby(false);
          }}
        >
          선생
        </button>
        <button
          className={showStandby ? Styles.selectedBtn : Styles.unselectedBtn}
          onClick={() => {
            setShowStandby(true);
          }}
        >
          가입대기
        </button>
      </div>
      <ul>
        {
          /*
          teacherId: 1,
          name: '김사매',
          email: 'science@gmail.com',
          phoneNum: '01012345678',
          createdAt: '2023-09-08T14:00:19.625632'
          */
          teachers.map((teacher, index) => (
            <li key={index}>
              {teacher.teacherId}--{teacher.name}--{teacher.email}--
              {teacher.phoneNum}--가입날짜 : {teacher.createdAt}
              <button
                onClick={() => {
                  approveTeacher({ id: teacher.teacherId });
                }}
              >
                승인
              </button>
              <button
                onClick={() => {
                  deleteTeacher({ id: teacher.teacherId });
                }}
              >
                삭제
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default ManageTeacher;
