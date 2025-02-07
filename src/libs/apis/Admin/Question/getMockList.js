import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostLookupMock = () => {
  const apiClient = useApiClient();
  const [searchedMockList, setData] = useState([]);

  const postLookupMock = async (subject, year, month) => {
    await apiClient
      .post(`/admin/csat/${subject}/${year}/${month}`, {})
      .then((res) => {
        const newArr = res.data.data;
        /**
          {csatId: 845
          month: 3
          publisher: "테스트1"
          subject: "SCIENCE"
          subjectNum: 0
          year: 2024},
          {...}
      */
        console.log(newArr);
        setData(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { searchedMockList, postLookupMock };
};

export default usePostLookupMock;
