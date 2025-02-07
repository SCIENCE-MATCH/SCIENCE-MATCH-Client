import useApiClient from "../../useApiClient";

const usePostQuestionPaper = () => {
  const apiClient = useApiClient();
  const postQuestionPaper = async (input, id, questionNum, handleClickedCloseBtn) => {
    const answer = input && input.map((data) => data.answer);
    const hasEmptyAnswer = answer.some((item) => item === "");

    if (answer && answer.length === parseInt(questionNum) && !hasEmptyAnswer) {
      await apiClient
        .post("/student/question-paper", {
          assignQuestionPaperId: id,
          answer: answer,
        })
        .then((res) => {
          // 데이터 들어오면 확인용으로 남겨둠 -> 확인한 뒤에 지울 예정
          console.log(res);
          handleClickedCloseBtn();
        })
        .catch((err) => console.log(err));
    } else {
      alert("답을 모두 입력해주세요.");
    }
  };
  return { postQuestionPaper };
};

export default usePostQuestionPaper;
