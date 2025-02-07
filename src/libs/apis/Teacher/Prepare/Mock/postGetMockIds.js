import useApiClient from "../../../../useApiClient";
import { useState } from "react";

const usePostGetMockIds = () => {
  const apiClient = useApiClient();
  const [mockIds, setData] = useState([]);

  const getMockIds = async (subject, year = [], month = [], publisher = []) => {
    await apiClient
      .post(`/csat/ids`, {
        subject: subject,
        year: year,
        month: month,
        publisher: publisher,
      })
      .then((res) => {
        const newArr = res.data.data;
        console.log(newArr);
        setData(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { mockIds, getMockIds };
};

export default usePostGetMockIds;
