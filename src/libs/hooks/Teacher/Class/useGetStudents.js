import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetStudents = () => {
  const apiClient = useApiClient();
  const [receivedStudents, setData] = useState([]);

  const getStudents = async () => {
    await apiClient
      .get(`/teacher/students`)
      .then((res) => {
        const newArr = res.data.data;
        setData(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { receivedStudents, getStudents };
};

export default useGetStudents;
