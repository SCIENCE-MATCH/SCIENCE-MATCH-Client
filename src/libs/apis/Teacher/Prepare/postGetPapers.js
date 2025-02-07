import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostGetPapers = () => {
  const apiClient = useApiClient();
  const [paperData, setPapers] = useState([]);

  const oneDayMore = (date) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  };

  const getPapers = async (questionTagSet, school, dateFrom, dateTo) => {
    let schoolSet = [school];
    if (school === "전체") schoolSet = ["초", "중", "고"];
    const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
    const questionTagToSend = { 전체: "", 단원유형별: "NORMAL", 시중교재: "TEXT_BOOK", 모의고사: "MOCK_EXAM" };

    try {
      // 이중 배열을 1차원 배열로 평탄화하기
      const promises = questionTagSet.flatMap((quesTag) =>
        schoolSet.map((schoolType) =>
          apiClient.post(`/teacher/question-paper`, {
            school: schoolToSend[schoolType],
            questionTag: questionTagToSend[quesTag],
            start: dateFrom,
            end: oneDayMore(dateTo),
          })
        )
      );

      const results = await Promise.allSettled(promises);

      let tempPapers = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const quesTag = questionTagSet[Math.floor(index / schoolSet.length)];
          result.value.data.data.forEach((paper) => {
            tempPapers.push({
              ...paper,
              questionTag: quesTag, // questionTag 필드를 추가
              selected: false,
            });
          });
        } else {
          console.error("Failed request:", result.reason);
        }
      });

      tempPapers.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setPapers(tempPapers);
    } catch (error) {
      console.log(error);
    }
  };

  return { paperData, getPapers };
};

export default usePostGetPapers;
