import useApiClient from "../../../useApiClient";

const useDeleteQuestion = () => {
  const apiClient = useApiClient();

  const deleteQuestion = async (id) => {
    await apiClient
      .delete(`/admin/question?questionId=${id}`)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deleteQuestion };
};

export default useDeleteQuestion;
