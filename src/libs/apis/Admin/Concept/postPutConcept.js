import { useState } from "react";
import useApiClient from "../../../useApiClient";

const usePostPutConcept = () => {
  const apiClient = useApiClient();
  const [newId, setNewId] = useState(null);

  const postPutConcept = async (id, img, blankImage) => {
    const formData = new FormData();
    formData.append("image", img);
    formData.append("blankImage", blankImage);
    formData.append("chapterId", id);
    await apiClient
      .post(`/admin/concept`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {
        setNewId(res.data.data);
        alert("저장 완료");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { newId, postPutConcept };
};

export default usePostPutConcept;
