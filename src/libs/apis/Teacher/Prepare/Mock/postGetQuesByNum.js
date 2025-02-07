import useApiClient from "../../../../useApiClient";
import { useState } from "react";

const usePostGetQuesByNum = () => {
  const apiClient = useApiClient();
  const [questionsByNum, setData] = useState([]);

  const getQuesByNum = async (mockArr, score) => {
    try {
      const promises = mockArr.map(async (mock) => {
        try {
          const res = await apiClient.post(`/csat/question/num`, [
            {
              csatId: mock.csatId,
              pageOrder: mock.mockQuestions
                .map((ques, index) => (ques ? index + 1 : null))
                .filter((value) => value !== null),
              score: score,
            },
          ]);
          return res.data.data;
        } catch (err) {
          console.log(err);
          return [];
        }
      });

      const results = await Promise.allSettled(promises);

      // fulfilled된 value만 추출하여 1차원 배열로 변환
      let tempData = results
        .filter((result) => result.status === "fulfilled") // fulfilled된 결과만 필터링
        .map((result) => result.value) // fulfilled된 value만 추출
        .flat(); // 1차원 배열로 변환

      tempData = tempData.map((ques) => {
        return { ...ques, imageURL: ques.questionImg };
      });
      setData(tempData);
    } catch (err) {
      console.log(err);
    }
  };

  return { questionsByNum, getQuesByNum };
};

export default usePostGetQuesByNum;
