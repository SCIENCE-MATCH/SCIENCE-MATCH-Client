import useApiClient from "../../../useApiClient";
import { useState } from "react";

const useUpdateLogo = () => {
  const apiClient = useApiClient();
  const [error, setError] = useState(null);

  const updateLogo = (newLogoImg) => {
    if (newLogoImg === "") {
      return apiClient
        .delete(`/teacher/logo`)
        .then(() => {
          alert("로고가 삭제되었습니다.");
        })
        .catch((error) => {
          setError(error.response.data.message);
          console.error("API 요청 실패:", error);
        });
    } else {
      const formData = new FormData();
      formData.append("logo", newLogoImg);

      return apiClient
        .patch(`/teacher/logo`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          alert("로고가 변경되었습니다.");
        })
        .catch((error) => {
          setError(error.response.data.message);
          console.error("API 요청 실패:", error);
        });
    }
  };

  return { updateLogo, error };
};

export default useUpdateLogo;
