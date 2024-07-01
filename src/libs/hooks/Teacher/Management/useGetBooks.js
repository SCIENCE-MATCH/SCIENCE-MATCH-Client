import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetBooks = () => {
  const apiClient = useApiClient();
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    await apiClient
      .get(`/book/question-paper`)
      .then((res) => {
        const newArr = res.data.data;
        newArr.sort((a, b) => (a.id > b.id ? 1 : -1));
        setBooks(newArr);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBooks();
  }, []);
  return { books, getBooks };
};

export default useGetBooks;
