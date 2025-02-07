import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetAllQuizs = () => {
  const apiClient = useApiClient();
  const [originalQuizs, setQuizs] = useState([]);

  const getQuizs = async (school, dateFrom, dateTo) => {
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const oneDayMore = (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    };
    let schoolSet = [school];
    if (school === "전체") schoolSet = ["초", "중", "고"];

    const gradeToKr = { FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5, SIXTH: 6 };
    const subjectToKr = { SCIENCE: "고", PHYSICS: "물", BIOLOGY: "생", CHEMISTRY: "화", EARTH_SCIENCE: "지" };
    const shortenGrade = (school, subject, semester) => {
      switch (school) {
        case "ELEMENTARY":
          return `초${gradeToKr[semester.slice(0, -1)]}`;
        case "MIDDLE":
          return `중${gradeToKr[semester.slice(0, -1)]}`;
        case "HIGH":
          return `${subjectToKr[subject]}${gradeToKr[semester.slice(0, -1)]}`;
        default:
          return "오류";
      }
    };
    try {
      const promises = schoolSet.map((schoolType) =>
        apiClient.post(`/admin/paper-test`, {
          school: schoolToSend[schoolType],
          start: dateFrom,
          end: oneDayMore(dateTo),
        })
      );

      const results = await Promise.allSettled(promises);

      let tempQuizs = [];
      results.forEach((response) => {
        response.data.data.map((quiz) => {
          tempQuizs.push({ ...quiz, grade: shortenGrade(quiz.school, quiz.subject, quiz.semester), selected: false });
        });
      });
      tempQuizs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setQuizs(tempQuizs);
    } catch (err) {
      console.log(err);
    }
  };

  return { originalQuizs, getQuizs };
};

export default usePostGetAllQuizs;
