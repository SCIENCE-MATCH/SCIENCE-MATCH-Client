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
      .catch((err) => {
        console.log(err);
        setChapters([
          {
            id: null,
            description: "에러 시 나타나는 단원",
            children: [],
          },
        ]);
      });
  };

  return { chapters, getChapters };
};

export default useGetChapters;
