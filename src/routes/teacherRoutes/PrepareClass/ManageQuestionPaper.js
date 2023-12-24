import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Styles from "./ManageQuestionPaper.module.css";
import CreateQuestionPaper from "./CreateQuestionPaper";

const ManageQuestionPaper = () => {
  const history = useHistory();
  const [createMode, setCreateMode] = useState(false);

  const refresh = async () => {
    try {
      const refreshToken = await getCookie("rToken");
      const accessToken = await getCookie("aToken");
      console.log("전달받은 리프레시 토큰 : ", refreshToken);
      const url = "https://www.science-match.p-e.kr/auth/reissue";

      const response = await Axios.post(url, null, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
          Refresh: `${refreshToken}`
        }
      });
      console.log("리이슈 API 응답 데이터:", response.data);
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error);
    }
  };

  return (
    <div className={Styles.backgroundBox}>
      {createMode ? (
        <CreateQuestionPaper />
      ) : (
        <div>
          <button
            onClick={() => {
              setCreateMode(true);
            }}
          >
            새로 만들기
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageQuestionPaper;
