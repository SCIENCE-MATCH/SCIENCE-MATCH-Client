import React from "react";
import styles from "./TabBox.module.css";
import colors from "../Colors.module.css";

const TabBox = ({ keyId, sellected, text, onClick }) => {
  return (
    <div
      id={keyId}
      className={sellected ? styles.SellectedTab : styles.TabBox}
      onClick={onClick}
      style={{ position: "relative" }} // 탭박스에 position: relative 스타일 추가
    >
      {text}
      <div
        style={{
          position: "absolute", // 막대기에 position: absolute 스타일 추가
          bottom: 0, // 막대기를 탭박스의 최하단에 배치
          left: "50%", // 가운데 정렬을 위해 left를 50%로 설정
          transform: "translateX(-50%)", // 막대기를 가운데 정렬하기 위해 transform 사용
          width: sellected ? 125 : 0,
          height: 4,
          backgroundColor: "var(--main-color)"
        }}
      ></div>
    </div>
  );
};

export default TabBox;
