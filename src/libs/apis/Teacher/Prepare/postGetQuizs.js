import useApiClient from "../../../useApiClient";
import { useState } from "react";

const useTeacherGetQuiz = () => {
  const apiClient = useApiClient();
  const [originalQuizs, setQuizs] = useState([]);

  const getQuizs = async (school) => {
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    const dateFrom = fiveYearsAgo;
    const dateTo = today.setHours(23, 59, 59, 999);

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
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const oneDayMore = (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    };

    apiClient
      .post(`/teacher/paper-test`, {
        school: schoolToSend[school],
        start: dateFrom,
        end: oneDayMore(dateTo),
      })
      .then((res) => {
        let tempQuizs = [];
        res.data.data.map((quiz) => {
          tempQuizs.push({
            ...quiz,
            grade: shortenGrade(quiz.school, quiz.subject, quiz.semester),
            selected: false,
            makerName: quiz.makerName ?? "관리자",
          });
        });
        tempQuizs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        setQuizs(tempQuizs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { originalQuizs, getQuizs };
};

export default useTeacherGetQuiz;
