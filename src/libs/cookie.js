//패키지 임포트
import { Cookies } from "react-cookie";

const cookies = new Cookies();
//쿠키에 값을 저장할때
export const setCookie = (name, value, option) => {
  const options = {
    path: "/", // 쿠키를 전역적으로 사용하기 위해 경로를 루트로 설정
    //httpOnly: true, // HTTP-only 쿠키 활성화
    secure: true, // HTTPS를 통해서만 쿠키 전송
    ...option, // 추가적인 사용자 정의 옵션
  };
  return cookies.set(name, value, options);
};
//쿠키에 있는 값을 꺼낼때
export const getCookie = (name) => {
  return cookies.get(name);
};
//쿠키를 지울때
export const removeCookie = (name) => {
  return cookies.remove(name);
};
