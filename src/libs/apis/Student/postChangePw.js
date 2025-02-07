import useApiClient from "../../useApiClient";

const usePostChangePw = () => {
  const apiClient = useApiClient();
  const postChangePw = (newPw, checkedPw, handleModal) => {
    if (newPw === checkedPw && newPw.length >= 6) {
      apiClient
        .post("/auth/student/change-pw", `${newPw}`)
        .then((res) => {
          alert(res.data.message);
          handleModal();
        })
        .catch((err) => console.log(err));
    } else {
      newPw !== checkedPw
        ? alert("입력하신 새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.")
        : alert("6자 이상의 비밀번호를 설정해주세요.");
    }
  };
  return { postChangePw };
};

export default usePostChangePw;
