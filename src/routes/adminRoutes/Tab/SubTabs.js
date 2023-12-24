import React from "react";
import styles from "./Tabs.module.css";
import TabBox from "../../../components/_Common/TabBox";

const SubTabs = ({
  activeTab,
  activeSubTab,
  setActiveSubTab,
  setMyPageSelected
}) => {
  const subTabsMap = {
    "인원 관리": ["선생", "학생", "반"],
    "문제 관리": ["추가", "검색"]
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
