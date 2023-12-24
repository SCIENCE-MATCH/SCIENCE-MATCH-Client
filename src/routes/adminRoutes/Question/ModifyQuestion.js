import ImageUpload from "../test";
import FileBase64Converter from "../test";
import ChapterLookUp from "./ChapterLookUp";
import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Styles from "./AddQuestion.module.css";
import SearchQuestion from "./SearchQuestion";

const ModifyQuestion = () => {
  const history = useHistory();
  const [chapToSearch, setChapToSearch] = useState(null);

  const getQuestion = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/question";

      const response = await Axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log(response);
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response,
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        history.push("/");
      }
    }
  };

  return (
    <div className={Styles.backgroundBox}>
      <ChapterLookUp exportChapToAdd={setChapToSearch} />
      <SearchQuestion chapToSearch={chapToSearch} />
    </div>
  );
};

export default ModifyQuestion;
