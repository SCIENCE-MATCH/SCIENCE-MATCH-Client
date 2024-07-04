import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetLogo = () => {
  const apiClient = useApiClient();
  const [logoUrl, setData] = useState({});

  const getLogo = () => {
    apiClient
      .get(`/teacher/mypage`)
      .then((response) => {
        const responseData = response.data.data;
        setData(responseData.logo ?? "");
      })
      .catch((error) => {
        console.error("API 요청 실패:", error.response);
        alert("로고를 불러오지 못했습니다.");
      });
  };

  useEffect(() => {
    getLogo();
  }, []);

  return { getLogo, logoUrl };
};

export default useGetLogo;
