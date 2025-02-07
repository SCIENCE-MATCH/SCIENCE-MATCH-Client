import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetMockQuestions = () => {
  const apiClient = useApiClient();
  const [mockQuestions, setData] = useState([]);

  const postGetMockQuestions = async (subject, year, month, publisher) => {
    await apiClient
      .post(`/admin/csat/question`, { subject: subject, year: [year], month: [month], publisher: [publisher] })
      .then((res) => {
        const newArr = res.data.data;
        const questions = Array.from({ length: 20 }, (_, index) => ({
          questionId: null,
          imageURL: null,
          pageOrder: index + 1,
        }));
        newArr.forEach((element) => {
          questions[element.pageOrder - 1] = element;
        });

        console.log(newArr);
        console.log(questions);
        setData(questions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { mockQuestions, postGetMockQuestions };
};

export default usePostGetMockQuestions;
