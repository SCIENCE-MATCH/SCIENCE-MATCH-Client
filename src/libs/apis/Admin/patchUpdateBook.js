import useApiClient from "../../useApiClient";

const usePatchUpdateBook = () => {
  const apiClient = useApiClient();

  const patchUpdateBook = async (editingBook) => {
    try {
      await apiClient.patch(`/admin/book/update/${editingBook.id}`, {
        school: editingBook.school,
        semester: editingBook.semester,
        title: editingBook.title,
        editionNum: editingBook.editionNum,
        publisher: editingBook.publisher,
      });
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.message);
      alert("승인 실패");
    }
  };

  return { patchUpdateBook };
};

export default usePatchUpdateBook;
