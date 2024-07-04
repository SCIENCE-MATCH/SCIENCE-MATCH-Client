import useApiClient from "../../../useApiClient";

const useDeleteAssignQuiz = () => {
  const apiClient = useApiClient();

  const deleteAssignQuiz = async (paperTestId) => {
    await apiClient
      .delete(`/teacher/assign-paper-test/${paperTestId}`)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deleteAssignQuiz };
};

export default useDeleteAssignQuiz;
