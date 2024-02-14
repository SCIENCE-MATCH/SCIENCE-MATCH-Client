import axios from "axios";
import { getCookie } from "../components/_Common/cookie";

const accessToken = getCookie("aToken");

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Authorization: accessToken && `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});
