import { useNavigate } from "react-router";
import { removeCookie } from "../../../cookie";
import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useLogOut = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const logOut = () => {
    apiClient
      .post(`/auth/logout`)
      .then(() => {
        removeCookie("refreshToken");
        navigate("/");
      })
      .catch((error) => {
        console.error("API 요청 실패:", error.response);
        alert("로그아웃 실패.");
        navigate("/");
      });
  };

  return { logOut };
};

export default useLogOut;
