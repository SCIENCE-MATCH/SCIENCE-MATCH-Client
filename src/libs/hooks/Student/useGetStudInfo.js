import { useEffect, useState } from "react";
import useApiClient from "../../useApiClient";

const useGetStudInfo = () => {
  const apiClient = useApiClient();
  const [data, setData] = useState();

  const fetchData = async () => {
    await apiClient
      .get("/student/mypage")
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data };
};

export default useGetStudInfo;
