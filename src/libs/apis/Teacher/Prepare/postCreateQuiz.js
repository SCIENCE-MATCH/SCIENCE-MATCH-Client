import useApiClient from "../../../useApiClient";
const usePostCreateQuiz = () => {
  const apiClient = useApiClient();

  const postCreateQuiz = async (school, semester, chapterId, image, question, solution, subject, teacherName) => {
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const formData = new FormData();
    formData.append("school", schoolToSend[school]);
    formData.append("semester", semester);
    formData.append("chapterId", chapterId);
    if (image !== null) formData.append("image", image);
    formData.append("makerName", teacherName);
    formData.append("question", question);
    formData.append("solution", solution);
    formData.append("subject", subject);
    await apiClient
      .post(`/teacher/paper-test/create`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { postCreateQuiz };
};

export default usePostCreateQuiz;
