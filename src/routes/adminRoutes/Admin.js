import { useState, useEffect } from "react";
import ManageMember from "./People/ManageTeacher";
import {
  useHistory,
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Axios from "axios";
import TopTab from "./Tab/TopTab";
import SubTabs from "./Tab/SubTabs";
import ManageStudent from "./People/ManageStudent";
import colors from "../../components/Colors.module.css";
import { getCookie } from "../../components/_Common/cookie";
import ManageTeacher from "./People/ManageTeacher";
import AddQuestion from "./Question/AddQuestion";
import ModifyQuetions from "./Question/ModifyQuestion";
import ManageClasses from "./People/ManageClasses";

function Admin({ accessToken, setAccessToken, refreshToken }) {
  const history = useHistory();
  const [activeMainTab, setActiveMainTab] = useState("인원 관리");
  const [activeSubTab, setActiveSubTab] = useState("선생");
  const [myPageSelected, setMyPageSelected] = useState(false);

  if (getCookie("aToken") === undefined) {
    history.push("/");
    alert("유효하지 않은 접근입니다.");
  }
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
          //=================인원 관리================
          activeMainTab === "인원 관리" ? (
            activeSubTab === "선생" ? (
              <ManageTeacher />
            ) : activeSubTab === "학생" ? (
              <ManageStudent />
            ) : (
              <ManageClasses />
            )
          ) : //================문제 관리===============
          activeSubTab === "추가" ? (
            <AddQuestion />
          ) : (
            <ModifyQuetions />
          )
        }
      </div>
    </div>
  );
}

export default Admin;
