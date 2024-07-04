import useApiClient from "../../../useApiClient";
const usePostCreateQuiz = () => {
  const apiClient = useApiClient();

  const postCreateQuiz = async (school, semester, subject, selectedChapter, newQuestion, newAnswer) => {
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    await apiClient
      .post(`/teacher/paper-test/create`, [
        {
          school: schoolToSend[school],
          subject: subject,
          semester: semester,
          chapterId: selectedChapter.id,
          question: newQuestion,
          solution: newAnswer,
        },
      ])
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { postCreateQuiz };
};

export default usePostCreateQuiz;
