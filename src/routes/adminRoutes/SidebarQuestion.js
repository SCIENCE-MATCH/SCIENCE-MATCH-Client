import React from "react";
import { Link } from "react-router-dom";

const SidebarQuestion = () => {
  // 이동 가능한 관리페이지 목록
  const manageOptions = ["추가", "검색"];

  return (
    <div style={sidebarStyle}>
      <h2>문제 관리</h2>
      <ul>
        {manageOptions.map((manageOption) => (
          <li key={manageOption}>
            <Link to={`/admin/문제관리/${manageOption}`}>{manageOption}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
const sidebarStyle = {
  border: "2px solid black", // 검정색 테두리 적용
  padding: "10px",
};
export default SidebarQuestion;
