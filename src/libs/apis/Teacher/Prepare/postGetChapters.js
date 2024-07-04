import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetChapters = () => {
  const apiClient = useApiClient();
  const [chapterData, setChapters] = useState([]);

  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };

  /**school: "초", semester: 'THIRD1', subject: "SCIENCE" */
  const getChapters = async (school, semester, subject) => {
    await apiClient
      .post(`/admin/chapter/get`, {
        school: schoolToSend[school],
        semester: semester,
        subject: subject,
      })
      .then((res) => {
        const newArr = res.data.data;
        setChapters(newArr);
      })
      .catch((err) => console.log(err));
  };

  return { chapterData, getChapters };
};

export default usePostGetChapters;
