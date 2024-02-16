import { useEffect, useState } from "react";
import { api } from "../api";

const useGetPaperTest = () => {
  const [data, setData] = useState();

  const fetchData = async () => {
    await api
      .get("/student/paper-test")
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data };
};

export default useGetPaperTest;
