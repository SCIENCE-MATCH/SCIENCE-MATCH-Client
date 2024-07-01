import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetBookQuestion = () => {
  const apiClient = useApiClient();
  const [bookQuestions, setQuestions] = useState([]);

  const getBookQuestion = async (id, page) => {
    await apiClient
      .get(`/book/question/${id}/${page}`)
      .then((res) => {
        const newArr = res.data.data;
        setQuestions(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { bookQuestions, getBookQuestion };
};

export default useGetBookQuestion;
