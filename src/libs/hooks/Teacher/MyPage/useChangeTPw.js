import useApiClient from "../../../useApiClient"; // Axios 인스턴스 가져오기
import { useState } from "react";

const useChangeTeacherPw = () => {
  const apiClient = useApiClient();
  const [error, setError] = useState(null);

  const submitPwChange = async (pw, newPw, setModalType) => {
    try {
      const url = "https://www.science-match.p-e.kr/auth/teacher/check-pw";

      await apiClient.post(url, { password: pw });

      try {
        await apiClient.post("https://www.science-match.p-e.kr/auth/teacher/change-pw", {
          password: newPw,
        });
        alert("비밀번호가 변경되었습니다.");
        setModalType(0);
      } catch (error) {
        alert("비밀번호 변경 실패");
        console.error("비밀번호 변경 실패:", error.response.data.message);
      }
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.message);
      setError(error.response.data.message);

      if (error.response.data.code === 404) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }
  };

  return { submitPwChange, error };
};

export default useChangeTeacherPw;
