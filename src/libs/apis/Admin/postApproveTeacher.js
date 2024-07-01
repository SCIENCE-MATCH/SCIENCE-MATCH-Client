import useApiClient from "../../useApiClient";

const usePostApproveTeacher = () => {
  const apiClient = useApiClient();

  const postApproveTeacher = async (id) => {
    try {
      await apiClient.post(`/admin/teachers/${id}`, {});
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.message);
      alert("승인 실패");
    }
  };

  return { postApproveTeacher };
};

export default usePostApproveTeacher;
