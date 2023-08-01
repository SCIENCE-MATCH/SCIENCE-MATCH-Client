import React from "react";
import { Link } from "react-router-dom";

const SidebarMember = () => {
  // 이동 가능한 관리페이지 목록
  const manageOptions = ["선생", "학생", "반"];

  return (
    <div style={sidebarStyle}>
      <h2>인원 관리</h2>
      <ul>
        {manageOptions.map((manageOption) => (
          <li key={manageOption}>
            <Link to={`/admin/인원관리/${manageOption}`}>{manageOption}</Link>
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
export default SidebarMember;
