import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetQuestions = () => {
  const apiClient = useApiClient();
  const [questionData, setQuestions] = useState([]);

  const difficultyToSendOption = { 하: "LOW", 중하: "MEDIUM_LOW", 중: "MEDIUM", 중상: "MEDIUM_HARD", 상: "HARD" };

  const getQuestions = async (sortedChapters, quesNum, paperDifficulty, quesTypes, mockExam) => {
    const newChapterIds = sortedChapters.map((chap) => `chapterIds=${chap.id}`).join("&");
    const categories = quesTypes.map((cate) => `category=${cate}`).join("&");
    await apiClient
      .post(
        `https://www.science-match.p-e.kr/teacher/questions/normal?${newChapterIds}&questionNum=${quesNum}&level=${difficultyToSendOption[paperDifficulty]}&${categories}&mockExam=${mockExam}`,
        {}
      )
      .then((res) => {
        const newArr = res.data.data;
        setQuestions(newArr);
        return newArr;
      })
      .catch((err) => console.log(err));
  };

  return { questionData, getQuestions };
};

export default usePostGetQuestions;
