import useApiClient from "../../../useApiClient";

const usePostAddQuiz = () => {
  const apiClient = useApiClient();

  const postAddQuiz = async (school, semester, chapterId, image, question, solution, subject) => {
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const formData = new FormData();
    formData.append("school", schoolToSend[school]);
    formData.append("semester", semester);
    formData.append("chapterId", chapterId);
    if (image !== null) formData.append("image", image);
    formData.append("makerName", "관리자");
    formData.append("question", question);
    formData.append("solution", solution);
    formData.append("subject", subject);

    await apiClient
      .post(`/admin/paper-test/create`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return { postAddQuiz };
};

export default usePostAddQuiz;
