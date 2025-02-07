import useApiClient from "../../../useApiClient";

const useDeleteQuiz = () => {
  const apiClient = useApiClient();

  const deleteQuiz = async (id) => {
    await apiClient
      .post(`/admin/paper-test/delete`, [id])
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deleteQuiz };
};

export default useDeleteQuiz;
