import useApiClient from "../../../useApiClient";
const usePostPresentQuiz = () => {
  const apiClient = useApiClient();

  const postPresentQuiz = async (selectedStudIds, quizId) => {
    let payLoad = "?";
    selectedStudIds.map((studId) => (payLoad = payLoad + `studentIds=${studId}&`));
    quizId.map((quizId) => (payLoad = payLoad + `paperTestIds=${quizId}&`));
    payLoad = payLoad.slice(0, payLoad.length - 1);
    await apiClient
      .post(`/teacher/paper-test/multiple-submit${payLoad}`, {})
      .then((res) => {
        alert("출제 완료!");
      })
      .catch((err) => console.log(err));
  };

  return { postPresentQuiz };
};

export default usePostPresentQuiz;
