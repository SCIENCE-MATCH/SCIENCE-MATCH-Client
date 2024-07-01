import useApiClient from "../../useApiClient";

const usePostAddQuestoin = () => {
  const apiClient = useApiClient();

  const postAddQuestion = async (school, semester, newBook) => {
    try {
      await apiClient.post(`/admin/book/create`, {
        school: school,
        semester: semester,
        title: newBook.title,
        editionNum: newBook.editionNum,
        publisher: newBook.publisher,
      });
    } catch (error) {
      console.error("API 요청 실패:", error.response.data.message);
      alert("승인 실패");
    }
  };

  return { postAddQuestion };
};

export default usePostAddQuestoin;
