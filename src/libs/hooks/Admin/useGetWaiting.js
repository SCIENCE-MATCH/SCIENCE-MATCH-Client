import useApiClient from "../../useApiClient";
import { useState, useEffect } from "react";

const useGetWaiting = () => {
  const apiClient = useApiClient();
  const [waitings, setData] = useState([]);

  const getWaitng = async () => {
    await apiClient
      .get(`/admin/teachers/waiting`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWaitng();
  }, []);
  return { waitings, getWaitng };
};

export default useGetWaiting;
