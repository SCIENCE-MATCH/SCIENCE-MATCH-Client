import useApiClient from "../../useApiClient";
import { useState } from "react";

const useGetChapters = () => {
  const apiClient = useApiClient();
  const [chapters, setChapters] = useState([]);

  const getChapters = async (school, semester, subject) => {
    await apiClient
      .post(`/admin/chapter/get`, {
        school: school,
        semester: semester,
        subject: subject,
      })
      .then((res) => {
        const newArr = res.data.data;
        setChapters(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { chapters, getChapters };
};

export default useGetChapters;
