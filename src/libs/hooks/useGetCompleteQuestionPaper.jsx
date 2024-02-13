import { useEffect, useState } from "react";
import { api } from "../api";

const useGetCompleteQuestionPaper = (id) => {
  const [data, setData] = useState();

  const fetchData = async () => {
    await api
      .get(`/student/question-paper/${id}/complete`, {
        params: { id: id },
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data };
};

export default useGetCompleteQuestionPaper;
