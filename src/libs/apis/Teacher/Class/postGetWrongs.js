import { useState } from "react";
import useApiClient from "../../../useApiClient";

const usePostGetWrong = () => {
  const apiClient = useApiClient();
  const [wrongQuestions, setData] = useState([]);
  const postGetWrong = async (ids) => {
    await apiClient
      .post(`/teacher/question-paper/wrong/assign`, ids)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  return { wrongQuestions, postGetWrong };
};

export default usePostGetWrong;
