import useApiClient from "../../useApiClient";
import { useState, useEffect } from "react";

const useGetTeachers = () => {
  const apiClient = useApiClient();
  const [approved, setData] = useState([]);

  const getTeachers = async () => {
    await apiClient
      .get(`/admin/teachers`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTeachers();
  }, []);
  return { approved, getTeachers };
};

export default useGetTeachers;
