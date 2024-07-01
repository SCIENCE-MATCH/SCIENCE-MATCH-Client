import { api } from "../../api";

const postQuestionPaper = async (input, id, questionNum, handleClickedCloseBtn) => {
  const answer = input && input.map((data) => data.answer);
  if (answer && answer.length === parseInt(questionNum)) {
    await api
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

export default postQuestionPaper;
