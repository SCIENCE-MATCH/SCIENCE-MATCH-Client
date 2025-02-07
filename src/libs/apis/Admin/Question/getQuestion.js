import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetQuestion = () => {
  const apiClient = useApiClient();
  const [allQuestions, setData] = useState([]);

  const postGetQuestion = async (id, selectedDifficulty, category) => {
    const difficultyOption = ["하", "중하", "중", "중상", "상"];
    const difficultyToSendOption = { 하: "LOW", 중하: "MEDIUM_LOW", 중: "MEDIUM", 중상: "MEDIUM_HARD", 상: "HARD" };
    const categoryToSendOption = { 선택형: "MULTIPLE", 단답형: "SUBJECTIVE", 서술형: "DESCRIPTIVE" };
    console.log(selectedDifficulty);
    try {
      const promises = difficultyOption.map((diff) => {
        if (selectedDifficulty[diff]) {
          return apiClient
            .post(`/admin/question`, {
              chapterId: id,
              level: difficultyToSendOption[diff],
              category: categoryToSendOption[category],
            })
            .then((res) => res.data.data)
            .catch((err) => {
              console.log(err);
              return [];
            });
        } else {
          return Promise.resolve([]);
        }
      });

      const results = await Promise.all(promises);
      const tempData = results.flat();
      setData(tempData);
      console.log(tempData);
    } catch (err) {
      console.log(err);
    }
  };

  return { allQuestions, postGetQuestion };
};

export default usePostGetQuestion;
