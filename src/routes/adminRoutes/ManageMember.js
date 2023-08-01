import React from "react";

const ManageMember = ({ match }) => {
  const manageOption = match.params.manageOpt;
  console.log(match.params);

  // 게시판 컴포넌트 구현

  return (
    <div>
      <h1>{manageOption}</h1>
      {manageOption} 관리 페이지 표시
    </div>
  );
};

export default ManageMember;
