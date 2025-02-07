import useApiClient from "../../../useApiClient";

const usePostAddQuestion = () => {
  const apiClient = useApiClient();

  const postAddQuestion = async (
    difficulty,
    chapToAdd,
    solutionFile,
    answer,
    questionFile,
    category,
    score = 1,
    questionTag = "NORMAL",
    bookId = null,
    page = null,
    questionOrder = null,
    csatId = null
  ) => {
    const difficultyToSendOption = { 하: "LOW", 중하: "MEDIUM_LOW", 중: "MEDIUM", 중상: "MEDIUM_HARD", 상: "HARD" };
    const categoryToSendOption = { 선택형: "MULTIPLE", 단답형: "SUBJECTIVE", 서술형: "DESCRIPTIVE" };
    const formData = new FormData();
    formData.append("level", difficultyToSendOption[difficulty]);
    formData.append("chapterId", chapToAdd.id);
    formData.append("solutionImg", solutionFile);
    formData.append("solution", answer);
    formData.append("image", questionFile);
    formData.append("category", categoryToSendOption[category]);
    formData.append("score", score);
    formData.append("questionTag", questionTag);
    csatId && formData.append("csatId", csatId);
    bookId && formData.append("bookId", bookId);
    page && formData.append("page", page);
    questionOrder && formData.append("pageOrder", questionOrder);

    await apiClient
      .post(`/admin/question/post`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {
        alert("문제를 성공적으로 추가했습니다.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { postAddQuestion };
};

export default usePostAddQuestion;
