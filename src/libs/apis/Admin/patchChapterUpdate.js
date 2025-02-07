import useApiClient from "../../useApiClient";

const usePatchUpdateChapter = () => {
  const apiClient = useApiClient();

  const patchUpdateChapter = async (id, description) => {
    await apiClient
      .patch(`/admin/chapter`, {
        id: id,
        description: description,
      })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return { patchUpdateChapter };
};

export default usePatchUpdateChapter;
