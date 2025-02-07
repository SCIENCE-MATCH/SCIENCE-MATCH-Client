import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetQuizs = () => {
  const apiClient = useApiClient();
  const [originalQuizs, setQuizs] = useState([]);

  const getQuizs = async (school) => {
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    const dateFrom = fiveYearsAgo;
    const dateTo = today.setHours(23, 59, 59, 999);

    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const oneDayMore = (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    };

    apiClient
      .post(`/admin/paper-test`, {
        school: schoolToSend[school],
        start: dateFrom,
        end: oneDayMore(dateTo),
      })
      .then((res) => {
        let tempQuizs = res.data.data;
        tempQuizs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        setQuizs(tempQuizs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { originalQuizs, getQuizs };
};

export default usePostGetQuizs;
