import axios from "axios";
import { getCookie, setCookie, removeCookie } from "./cookie"; // 쿠키 관리 유틸리티 함수

const useApiClient = () => {
  const apiClient = axios.create({
    baseURL: "https://www.science-match.p-e.kr",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${getCookie("aToken")}`,
    },
  });

  const refreshAccessToken = async () => {
    const refreshToken = getCookie("rToken");
    try {
      const response = await axios.post(
        "https://www.science-match.p-e.kr/auth/reissue",
        {},
        {
          headers: {
            accept: "application/json;charset=UTF-8",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
      setCookie("aToken", newAccessToken);
      setCookie("rToken", newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error("Unable to refresh token", error);
      throw error;
    }
  };

  apiClient.interceptors.request.use(
    (config) => {
      if (getCookie("aToken")) {
        config.headers["Authorization"] = `Bearer ${getCookie("aToken")}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default useApiClient;
