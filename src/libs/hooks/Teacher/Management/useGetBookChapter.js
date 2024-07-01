import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetBookChaper = () => {
  const apiClient = useApiClient();
  const [bookChapters, setBookChapters] = useState([]);

  const getBookChapters = async (id) => {
    await apiClient
      .get(`/book/chapter/${id}`)
      .then((res) => {
        const newArr = res.data.data;
        setBookChapters(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { bookChapters, getBookChapters };
};

export default useGetBookChaper;
