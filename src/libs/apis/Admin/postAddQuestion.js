import useApiClient from "../../useApiClient";

const usePostAddQuestion = () => {
  const apiClient = useApiClient();

  const postAddQuestion = async (id, img, blankImage) => {
    const formData = new FormData();
    formData.append("image", img);
    formData.append("blankImage", blankImage);
    formData.append("chapterId", id);
    await apiClient
      .post(`/admin/concept`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {
        setNewId(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { postAddQuestion };
};

export default usePostAddQuestion;
