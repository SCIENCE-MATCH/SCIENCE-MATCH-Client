import React from "react";
import { Link } from "react-router-dom";

const SidebarSettings = () => {
  return (
    <div style={sidebarStyle}>
      <ul>
        <li key="settings">
          <Link to={`/admin/settings`}>설정</Link>
        </li>
        <li key="logOut">
          <Link to={"/"}>로그 아웃</Link>
          {/*로그아웃 로직 구현 필요*/}
        </li>
      </ul>
    </div>
  );
};
const sidebarStyle = {
  border: "2px solid black", // 검정색 테두리 적용
  padding: "10px",
};
export default SidebarSettings;
