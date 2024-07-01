import { useEffect, useState } from "react";
import { api } from "../../api";

const useGetStudInfo = () => {
  const [data, setData] = useState();

  const fetchData = async () => {
    await api
      .get("/student/mypage")
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data };
};

export default useGetStudInfo;
