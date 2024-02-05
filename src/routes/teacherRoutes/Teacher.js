import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import TopTab from "./TeacherTab/TopTab";
import SubTabs from "./TeacherTab/SubTabs";
import MyPage from "./More/MyPage";
import ManageStudent from "./Management/ManageStudent";
import { getCookie } from "../../components/_Common/cookie";
import ManageQuestionPaper from "./PrepareClass/ManageQuestionPaper";

const Teacher = ({}) => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState("수업 준비");
  const [activeSubTab, setActiveSubTab] = useState("학습지");
  const [myPageSelected, setMyPageSelected] = useState(false);

  if (getCookie("aToken") === undefined) {
    navigate("/");
    alert("유효하지 않은 접근입니다.");
  }
  const refresh = async () => {
    try {
      const refreshToken = await getCookie("rToken");
      const accessToken = await getCookie("aToken");
      console.log("전달받은 리프레시 토큰 : ", refreshToken);

      const response = await Axios.post(
        "https://www.science-match.p-e.kr/auth/reissue",
        {},
        {
          headers: {
            accept: "application/json;charset=UTF-8",
            Authorization: `Bearer ${accessToken}`,
            Refresh: refreshToken
          }
        }
      );
      console.log("리이슈 API 응답 데이터:", response.data);
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error);
    }
  };
  /*useEffect(() => {
    refresh();
  }, [activeMainTab]);*/
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <TopTab
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        setActiveSubTab={setActiveSubTab}
        myPageSelected={myPageSelected}
        setMyPageSelected={setMyPageSelected}
      ></TopTab>
      {myPageSelected ? (
        <MyPage />
      ) : (
        <>
          <SubTabs
            activeTab={activeMainTab}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            setMyPageSelected={setMyPageSelected}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyItems: "center"
            }}
          >
            {
              //=================수업 준비================
              activeMainTab === "수업 준비" ? (
                activeSubTab === "학습지" ? (
                  <ManageQuestionPaper />
                ) : (
                  "1:1 질문지"
                )
              ) : //================관리===============
              activeMainTab === "관리" ? (
                activeSubTab === "학생관리" ? (
                  <ManageStudent />
                ) : (
                  "반관리"
                )
              ) : //==================수업===============
              activeSubTab === "학습내역" ? (
                "학습내역"
              ) : activeSubTab === "학습지" ? (
                "학습지"
              ) : activeSubTab === "1:1 질문지" ? (
                "질문지"
              ) : (
                "보고서"
              )
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Teacher;
