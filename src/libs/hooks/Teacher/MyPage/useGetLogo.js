import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetLogo = () => {
  const apiClient = useApiClient();
  const [logoUrl, setData] = useState({});
  const [teacherName, setName] = useState("");

  const getLogo = () => {
    apiClient
      .get(`/teacher/mypage`)
      .then((response) => {
        const responseData = response.data.data;
        setData(responseData.logo ?? "");
        setName(responseData.name);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error.response);
      });
  };

  useEffect(() => {
    getLogo();
  }, []);

  return { getLogo, teacherName, logoUrl };
};

export default useGetLogo;
