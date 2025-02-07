import useApiClient from "../../../useApiClient";

const useDeleteConcept = () => {
  const apiClient = useApiClient();

  const deleteConcept = async (id) => {
    await apiClient
      .delete(`/admin/concept/${id}`)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return { deleteConcept };
};

export default useDeleteConcept;
