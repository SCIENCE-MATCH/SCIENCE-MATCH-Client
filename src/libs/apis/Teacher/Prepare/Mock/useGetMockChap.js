import useApiClient from "../../../../useApiClient";
import { useState } from "react";

const useGetMockChap = () => {
  const apiClient = useApiClient();
  const [recievedChaps, setData] = useState([]);

  const getMockChap = async (subject) => {
    await apiClient
      .get(`/csat/chapter/${subject}`)
      .then((res) => {
        const newArr = res.data.data;
        setData(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { recievedChaps, getMockChap };
};

export default useGetMockChap;
