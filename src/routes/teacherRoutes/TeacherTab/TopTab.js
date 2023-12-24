import React, { useEffect } from "react";
import styles from "./Tabs.module.css";
import TabBox from "../../../components/_Common/TabBox";
import MyPageBtn from "../../../components/Teacher/MyPageButton";

const MAINCOLOR = "#05F200";
const TopTab = ({
  activeTab,
  setActiveTab,
  setActiveSubTab,
  myPageSelected,
  setMyPageSelected
}) => {
  const tabs = ["수업 준비", "수업", "관리"];
  const dictionary = {
    "수업 준비": "학습지",
    수업: "학습내역",
    관리: "학생관리"
  };

  const ifMyPage = () => {
    if (myPageSelected === true) setActiveTab("");
  };
  useEffect(ifMyPage, [myPageSelected]);

  return (
    <div className={styles.TopTab}>
      <h1
        style={{
          fontFamily: "Inter",
          fontSize: 30,
          fontWeight: "bolder",
          margin: 20,
          cursor: "default",
          width: "20%"
        }}
      >
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
      <div className={styles.MyInfo}>
        {
          //<button className="refresh-button">↻</button>
        }
        <MyPageBtn
          text="내 정보"
          myPageSelected={myPageSelected}
          setMyPageSelected={setMyPageSelected}
        />
      </div>
    </div>
  );
};

export default TopTab;
