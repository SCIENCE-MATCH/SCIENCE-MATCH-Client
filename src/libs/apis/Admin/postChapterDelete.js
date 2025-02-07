import useApiClient from "../../useApiClient";

const useDeleteChapter = () => {
  const apiClient = useApiClient();

  const deleteChapter = async (deleteTargetId) => {
    await apiClient
      .delete(`/admin/chapter?chapterId=${deleteTargetId}`)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deleteChapter };
};

export default useDeleteChapter;
