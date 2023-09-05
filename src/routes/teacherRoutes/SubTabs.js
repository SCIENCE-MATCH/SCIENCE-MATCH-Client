import React from "react";
import styles from "./Tabs.module.css";
import TabBox from "../TabBox";

const SubTabs = ({
  activeTab,
  activeSubTab,
  setActiveSubTab,
  setMyPageSelected
}) => {
  const subTabsMap = {
    "수업 준비": ["학습지", "1:1 질문지"],
    수업: ["학습내역", "학습지", "1:1 질문지", "보고서"],
    관리: ["학생관리", "반관리"]
  };
  const subTabs = subTabsMap[activeTab];

  return (
    <div className={styles.SubTabs}>
      <div className={styles.tabs}>
        {subTabs &&
          subTabs.map((subTab) => (
            <TabBox
              key={subTab}
              sellected={activeSubTab === subTab}
              text={subTab}
              onClick={() => {
                setActiveSubTab(subTab);
                setMyPageSelected(false);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default SubTabs;
