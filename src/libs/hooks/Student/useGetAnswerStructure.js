import { useEffect, useState } from "react";
import useApiClient from "../../useApiClient";

const useGetAnswerStructure = (id) => {
  const apiClient = useApiClient();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    await apiClient
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
};

export default useGetAnswerStructure;
