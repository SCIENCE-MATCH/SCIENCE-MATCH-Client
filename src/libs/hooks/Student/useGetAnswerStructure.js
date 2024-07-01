import { useEffect, useState } from "react";
import { api } from "../../api";

const useGetAnswerStructure = (id) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    await api
      .get("/student/question-paper/detail", {
        params: {
          AssignQuestionPaperId: id,
        },
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading };
};

export default useGetAnswerStructure;
