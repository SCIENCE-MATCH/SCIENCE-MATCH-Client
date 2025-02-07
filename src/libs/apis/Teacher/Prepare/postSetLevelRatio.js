import useApiClient from "../../../useApiClient";
const usePostSetRatios = () => {
  const apiClient = useApiClient();

  const postSetRatios = async (ratios) => {
    await apiClient
      .post(`/teacher/level`, ratios)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { postSetRatios };
};

export default usePostSetRatios;
