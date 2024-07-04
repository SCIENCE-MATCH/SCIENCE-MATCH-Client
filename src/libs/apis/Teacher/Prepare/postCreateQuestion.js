import useApiClient from "../../../useApiClient";
const usePostCreateQuestion = () => {
  const apiClient = useApiClient();

  const postCreateQuestion = async (
    school,
    semester,
    subject,
    level,
    title,
    makerName,
    category,
    questionTag,
    selectedQuestions,
    pdfUrl,
    minChapterId,
    maxChapterId,
    tamplateNum,
    selectedColor
  ) => {
    const questionTagToKorean = { NORMAL: "일반", TEXT_BOOK: "교재", MOCK_EXAM: "모의" };
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const difficultyToSendOption = {
      하: "LOW",
      중하: "MEDIUM_LOW",
      중: "MEDIUM",
      중상: "MEDIUM_HARD",
      상: "HARD",
    };
    const idsString = selectedQuestions.map((question) => question.questionId).join(",");
    const formData = new FormData();
    formData.append("school", schoolToSend[school]);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("level", difficultyToSendOption[level]);
    formData.append("title", title);
    formData.append("makerName", makerName);
    formData.append("category", category.includes("SUBJECTIVE") ? "SUBJECTIVE" : "MULTIPLE");
    formData.append("questionTag", questionTag);
    formData.append("questionIds", idsString);
    formData.append("questionNum", selectedQuestions.length);
    formData.append("pdf", pdfUrl, `[${questionTagToKorean[questionTag]}]${title}.pdf`);
    formData.append("minChapterId", minChapterId.id);
    formData.append("maxChapterId", maxChapterId.id);
    formData.append("template", tamplateNum);
    formData.append("themeColor", selectedColor);

    await apiClient
      .post(`/teacher/question-paper/create`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { postCreateQuestion };
};

export default usePostCreateQuestion;
