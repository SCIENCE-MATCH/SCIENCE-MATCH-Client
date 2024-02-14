import { api } from "../api";

const postPaperTest = (input, id) => {
  console.log(input);
  const clickedPaperTest = input.find((it) => it.id === id);

  if (clickedPaperTest && clickedPaperTest.answer) {
    const answer = clickedPaperTest.answer;

    api
      .post("/student/paper-test", {
        assignPaperTestId: id,
        answer: answer,
      })
      .then((res) => {
        console.log(res);
        window.reload();
      })
      .catch((err) => alert(err.response.data.message));
  } else {
    alert("답을 입력해주세요.");
  }
};

export default postPaperTest;
