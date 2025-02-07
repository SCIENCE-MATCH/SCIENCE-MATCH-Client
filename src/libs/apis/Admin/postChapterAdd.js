import { useState } from "react";
import useApiClient from "../../useApiClient";

const usePostAddChapter = () => {
  const apiClient = useApiClient();
  const [newId, setNewId] = useState(null);

  const postAddChapter = async (school, sem, sub, parentId, description) => {
    await apiClient
      .post(`/admin/chapter`, {
        school: school,
        semester: sem,
        subject: sub,
        parentId: parentId,
        description: description,
      })
      .then((res) => {
        setNewId(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { newId, postAddChapter };
};

export default usePostAddChapter;
