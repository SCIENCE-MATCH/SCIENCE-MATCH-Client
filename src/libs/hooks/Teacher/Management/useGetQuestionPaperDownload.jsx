import useApiClient from "../../useApiClient";
import { useState, useEffect } from "react";

const useGetQuestionPaperDownload = () => {
  const apiClient = useApiClient();
  const [imgsAndSolutions, setData] = useState([]);

  const getPaperToDownload = async (paperId, questionImgs, solutions, solutionImgs) => {
    await apiClient
      .get(
        `/teacher/question-paper/download?questionPaperId=${paperId}&question=${questionImgs}&solution=${solutions}&solutionImage=${solutionImgs}`
      )
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPaperToDownload();
  }, []);
  return { imgsAndSolutions, getPaperToDownload };
};

export default useGetQuestionPaperDownload;
