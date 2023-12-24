import React, { useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import styles from "./Tabs.module.css";
import TabBox from "../../../components/_Common/TabBox";
import { getCookie, removeCookie } from "../../../components/_Common/cookie";
import axios from "axios";

const MAINCOLOR = "#05F200";
const TopTab = ({
  activeTab,
  setActiveTab,
  setActiveSubTab,
  myPageSelected,
  setMyPageSelected
}) => {
  const history = useHistory();
  const tabs = ["인원 관리", "문제 관리"];
  const dictionary = {
    "인원 관리": "선생",
    "문제 관리": "추가"
  };

  const ifMyPage = () => {
    if (myPageSelected === true) setActiveTab("");
  };
  useEffect(ifMyPage, [myPageSelected]);

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

  return (
    <div className={styles.TopTab}>
      <h1 className={styles.LogoBox}>
        <span /*className="customLink"*/ style={{ color: MAINCOLOR }}>
          Science
        </span>{" "}
        Match
      </h1>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <TabBox
            key={tab}
            sellected={activeTab === tab}
            text={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveSubTab(dictionary[tab]);
              setMyPageSelected(false);
            }}
          />
        ))}
      </div>
      <div
        className={styles.MyInfo}
        style={{
          margin: 0,
          width: "20%",
          display: "flex",
          alignContent: "center",
          justifyContent: "center"
        }}
      >
        <button
          onClick={logOut}
          style={{
            //미선택 시
            width: "100px", // 너비 수정
            height: "40px", // 높이 수정
            borderRadius: "5px", // border-radius 수정
            border: "0px solid black", // 테두리 스타일을 1px의 검은색 실선으로 수정
            fontSize: "20px",
            fontWeight: "bold",
            color: "black", // 글씨 색을 검정색으로 수정
            backgroundColor: "white", // 배경색을 흰색으로 설정
            cursor: "pointer"
          }}
        >
          로그 아웃
        </button>
      </div>
    </div>
  );
};

export default TopTab;
