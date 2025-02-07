import useApiClient from "../../../../useApiClient";
import { useState } from "react";

const usePostGetQuesByChap = () => {
  const apiClient = useApiClient();
  const [questions, setData] = useState([]);

  const getQuesByChap = async (csatId = [], chapterId = [], score = [2, 3]) => {
    await apiClient
      .post(`/csat/question/chapter`, {
        csatId: csatId,
        chapterId: chapterId,
        score: score,
      })
      .then((res) => {
        const newArr = res.data.data;
        setData(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { questions, getQuesByChap };
};

export default usePostGetQuesByChap;
