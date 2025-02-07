import useApiClient from "../../../useApiClient";
import { useState } from "react";

const useGetQuestionPaperDownload = () => {
  const apiClient = useApiClient();
  const [imgsAndSolutions, setData] = useState([]);

  const getPaperToDownload = async (paperIds) => {
    try {
      const promises = paperIds.map((id) =>
        apiClient.get(
          `/teacher/question-paper/download?questionPaperId=${id}&question=${false}&solution=${true}&solutionImage=${true}`
        )
      );

      const results = await Promise.allSettled(promises);

      let tempData = [];
      results.forEach((res, index) => {
        if (res.status === "fulfilled") {
          tempData.push({ ...res.value.data.data, id: paperIds[index] });
        } else {
          tempData.push({ id: paperIds[index], qeustions: null, solutions: null, solutionImgs: null });
        }
      });
      setData(tempData);
    } catch (err) {
      console.log(err);
    }
  };

  return { imgsAndSolutions, getPaperToDownload };
};

export default useGetQuestionPaperDownload;
