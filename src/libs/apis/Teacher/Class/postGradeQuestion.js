import useApiClient from "../../../useApiClient";

const usePostGradeQuestion = () => {
  const apiClient = useApiClient();

  const postGradeQuestion = async (id, isRight) => {
    await apiClient
      .post(`/teacher/grading/question-paper`, {
        answerId: id,
        rightAnswer: isRight,
      })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { postGradeQuestion };
};

export default usePostGradeQuestion;
