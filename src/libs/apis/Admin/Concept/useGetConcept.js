import useApiClient from "../../../useApiClient";
import { useState } from "react";
const useGetConcept = () => {
  const apiClient = useApiClient();
  const [receivedConcepts, setData] = useState({ id: null });

  const getConcept = async (id) => {
    await apiClient
      .get(`/admin/concept?chapterId=${id}`)
      .then((res) => setData(res.data.data))
      .catch((err) => {});
  };

  return { receivedConcepts, getConcept };
};

export default useGetConcept;
