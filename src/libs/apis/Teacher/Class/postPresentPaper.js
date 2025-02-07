import useApiClient from "../../../useApiClient";
const usePostPresentPaper = () => {
  const apiClient = useApiClient();

  const postPresentPaper = async (selectedStudIds, paperIds) => {
    let payLoad = "?";
    selectedStudIds.map((studId) => (payLoad = payLoad + `studentIds=${studId}&`));
    paperIds.map((paper) => (payLoad = payLoad + `questionPaperIds=${paper.id}&`));
    payLoad = payLoad.slice(0, payLoad.length - 1);
    await apiClient
      .post(`/teacher/question-paper/multiple-submit${payLoad}`, {})
      .then((res) => {
        alert("출제 완료!");
      })
      .catch((err) => console.log(err));
  };

  return { postPresentPaper };
};

export default usePostPresentPaper;
