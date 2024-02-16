import { api } from "../api";

const postChangePw = (newPw, checkedPw, handleModal) => {
  if (newPw === checkedPw && newPw.length >= 6) {
    api
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

export default postChangePw;
