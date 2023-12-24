import userEvent from "@testing-library/user-event";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import styles from "../../../components/Colors.module.css";
import { getCookie, removeCookie } from "../../../components/_Common/cookie";
import axios from "axios";

const MyPage = () => {
  const history = useHistory();
  const [teacherName, setTeacherName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [academyName, setAcademyName] = useState("");
  const [email, setEmail] = useState("email");
  const init = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/mypage";
      //console.log("전달받은 토큰 : ", accessToken);

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      //console.log("API 응답 데이터:", response.data);
      setTeacherName(response.data.data.name);
      setEmail(response.data.data.id);
      setPhoneNum(response.data.data.phoneNum);
      setAcademyName(response.data.data.academy ?? "학원명 없음");
    } catch (error) {
      // API 요청이 실패한 경우
      alert("마이페이지를 불러오지 못했습니다.");
      //console.error("API 요청 실패:", error);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };
  const logOut = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/auth/logout";
      //console.log("전달받은 토큰 : ", accessToken);

      const response = await Axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("aToken")}`
          }
        }
      );

      console.log("API 응답 데이터:", response.data);
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error);
    }
    removeCookie("aToken");
    removeCookie("rToken");
    history.push("/");
  };

  useEffect(() => {
    init();
  }, []);

  const box0Style = {
    width: "600px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    margin: 20,
    border: "1px solid var(--background)",
    borderRadius: 15
  };
  const box1Style = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    width: 150,
    marginLeft: 20,
    marginTop: 20,
    fontFamily: "Arial, sans-serif", // 폰트 종류 설정
    fontSize: "18px", // 폰트 크기 설정
    fontWeight: "bold" // 굵기 설정 (normal, bold, lighter 등)
  };
  const box2Style = {
    display: "flex",
    alignItems: "center",
    height: 50,
    width: 300,
    marginTop: 20,
    fontFamily: "Arial, sans-serif", // 폰트 종류 설정
    fontSize: "18px", // 폰트 크기 설정
    fontWeight: "normal" // 굵기 설정 (normal, bold, lighter 등)
  };
  return (
    <div
      style={{ marginTop: "50px", height: "700px", backgroundColor: "white" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "",
          justifyItems: "center",
          backgroundColor: "white",
          width: "1300px",
          height: "350px"
        }}
      >
        <div style={box0Style}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={box1Style}>이메일</div>
            <div style={box2Style}>{email}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={box1Style}>비밀번호</div>
            <button>{`{비밀번호 변경}`}</button>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={box1Style}>원장선생님 이름</div>
            <div style={box2Style}>{teacherName}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={box1Style}>연락처</div>
            <div style={box2Style}>{phoneNum}</div>
          </div>
        </div>
        <div style={box0Style}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={box1Style}>교육기관 이름</div>
            <div style={box2Style}>{academyName}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={box1Style}>로고</div>
            <button>{`{로고 변경}`}</button>
          </div>
        </div>
      </div>
      <button style={{ marginLeft: "20px" }} onClick={logOut}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
