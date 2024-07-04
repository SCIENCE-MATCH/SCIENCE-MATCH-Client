import useApiClient from "../../../useApiClient";

const useDeleteAssignPaper = () => {
  const apiClient = useApiClient();

  const deleteAssignPaper = async (assignQuestionId) => {
    await apiClient
      .delete(`/teacher/assign-question-paper/${assignQuestionId}`)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deleteAssignPaper };
};

export default useDeleteAssignPaper;
