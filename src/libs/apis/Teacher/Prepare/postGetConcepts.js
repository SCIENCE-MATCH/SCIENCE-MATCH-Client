import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetConcepts = () => {
  const apiClient = useApiClient();
  const [conceptData, setConcepts] = useState([]);

  const getConcepts = async (selectedConceptIds) => {
    await apiClient
      .post(`/teacher/question-paper/concept`, selectedConceptIds)
      .then((res) => {
        const newArr = res.data.data;
        setConcepts(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { conceptData, getConcepts };
};

export default usePostGetConcepts;
