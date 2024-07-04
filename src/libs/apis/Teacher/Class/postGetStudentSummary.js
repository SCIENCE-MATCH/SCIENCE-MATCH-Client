import useApiClient from "../../../useApiClient";
import { useState } from "react";

const useGetStudentSummary = () => {
  const apiClient = useApiClient();
  const [summaryData, setSummaryData] = useState({
    assignPaperCorrectPercent: 0,
    assignPaperTotalNum: 0,
    assignQuestionAverageScore: 0,
    assignQuestionTotalNum: 0,
    solvedAQDto: [],
    notSolvedAQDto: [],
    solvedPTDto: [],
  });

  const getSummary = async (id, dateFrom, dateTo) => {
    await apiClient
      .post(`/teacher/student/summary`, {
        studentId: id,
        startDate: dateFrom,
        endDate: dateTo,
      })
      .then((res) => {
        const newArr = res.data.data;
        setSummaryData(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { summaryData, getSummary };
};

export default useGetStudentSummary;
