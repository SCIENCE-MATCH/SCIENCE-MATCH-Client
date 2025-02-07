import useApiClient from "../../../useApiClient";

const useDeletePaper = () => {
  const apiClient = useApiClient();

  const deletePaper = async (id) => {
    await apiClient
      .post(`/teacher/question-paper/delete`, [id])
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deletePaper };
};

export default useDeletePaper;
