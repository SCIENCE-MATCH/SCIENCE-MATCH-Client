import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetTeacherInfo = () => {
  const apiClient = useApiClient();
  const [data, setData] = useState({
    name: "",
    email: "",
    phoneNum: "",
    academyName: "학원명 없음",
    logoUrl: "",
  });

  const getInfo = () => {
    apiClient
      .get(`/teacher/mypage`)
      .then((response) => {
        const responseData = response.data.data;
        setData({
          name: responseData.name,
          email: responseData.id,
          phoneNum: responseData.phoneNum,
          academyName: responseData.academy ?? "학원명 없음",
          logoUrl: responseData.logo ?? "",
        });
      })
      .catch((error) => {
        console.error("API 요청 실패:", error.response);
        alert("마이페이지를 불러오지 못했습니다.");
      });
  };

  useEffect(() => {
    getInfo();
  }, []);

  return { getInfo, data };
};

export default useGetTeacherInfo;
