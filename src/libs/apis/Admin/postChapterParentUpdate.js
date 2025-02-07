import useApiClient from "../../useApiClient";
const usePostUpdateOrder = () => {
  const apiClient = useApiClient();

  const postUpdateOrder = async (parentId, targetId, orderedChapterIds) => {
    await apiClient
      .post(`/admin/chapter/order`, { parentId: parentId, targetId: targetId, orderedChapterIds: orderedChapterIds })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { postUpdateOrder };
};

export default usePostUpdateOrder;
