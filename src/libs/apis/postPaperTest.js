import { api } from "../api";

const postPaperTest = async ({ input, id }) => {
  const clickedPaperTest = input.find((it) => it.id === id);

  if (clickedPaperTest && clickedPaperTest.answer) {
    const answer = clickedPaperTest.answer;

    await api
      .post("/student/paper-test", {
        assignPaperTestId: id,
        answer: answer,
      })
      .then((res) => {
        // 데이터 들어오면 확인용으로 남겨둠 -> 확인한 뒤에 지울 예정
        console.log(res);
        window.location.reload();
      })
      .catch((err) => alert(err.response.data.message));
  } else {
    alert("답을 입력해주세요.");
  }
};

export default postPaperTest;
