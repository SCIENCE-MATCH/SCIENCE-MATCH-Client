import useApiClient from "../../../useApiClient";
import { useState } from "react";

const useGetPaperOfOne = () => {
  const apiClient = useApiClient();
  const [receivedPapers, setPaperWithAnswer] = useState([]);

  const getPaperAndAnswers = async (studentId) => {
    try {
      // 1. 학생의 모든 paper 불러오기
      const response = await apiClient.get(`/teacher/assign-question-paper/${studentId}`);
      let tempPapers = response.data.data;
      tempPapers.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

      // 2. "COMPLETE" 상태가 아닌 paper들을 미리 null 값으로 설정
      const updatedPapers = tempPapers.map((paper) => {
        if (paper.assignStatus !== "COMPLETE") {
          return {
            ...paper,
            score: 0,
            totalScore: 0,
            correctNum: 0,
            answerResponseDtos: [],
          };
        }
        return paper;
      });

      // 3. "COMPLETE" 상태의 paper에 대한 답변 정보 불러오기

      const promises = updatedPapers.map((paper) =>
        apiClient
          .get(`/teacher/assign-question-paper/${paper.id}/complete`)
          .then((response) => ({
            ...paper,
            score: response.data.data.score,
            totalScore: response.data.data.totalScore,
            correctNum: response.data.data.correctNum,
            questionNum: response.data.data.questionNum,
            answerResponseDtos: response.data.data.answerResponseDtos,
            selected: false,
          }))
          .catch((error) => {
            console.error(`Error fetching data for paper ${paper.id}`, error);
            throw error; // 에러 발생 시 다시 던짐
          })
      );
      const results = await Promise.all(promises);

      setPaperWithAnswer(results);
    } catch (error) {
      console.error("Failed to fetch quiz papers and answers:", error);
    }
  };

  return { receivedPapers, getPaperAndAnswers };
};

export default useGetPaperOfOne;
