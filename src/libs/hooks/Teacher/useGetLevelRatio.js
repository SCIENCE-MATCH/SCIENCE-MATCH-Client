import useApiClient from "../../useApiClient";
import { useState } from "react";

const useGetLevelRatio = () => {
  const apiClient = useApiClient();
  const [originalLevels, setLevels] = useState([]);

  const getLevelRatio = async () => {
    await apiClient
      .get(`/teacher/level`)
      .then((res) => {
        const newArr = res.data.data;
        setLevels(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { originalLevels, getLevelRatio };
};

export default useGetLevelRatio;
