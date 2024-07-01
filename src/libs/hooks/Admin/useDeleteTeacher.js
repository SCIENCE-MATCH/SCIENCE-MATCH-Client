import useApiClient from "../../useApiClient";

const useDeleteTeacher = () => {
  const apiClient = useApiClient();

  const deleteTeacher = async (id) => {
    try {
      await apiClient.delete(`/admin/teachers/${id}`);
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.message);
      alert("삭제 실패");
    }
  };

  return { deleteTeacher };
};

export default useDeleteTeacher;
