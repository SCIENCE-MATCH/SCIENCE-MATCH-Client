import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import InputBox from "../components/InputBox.js";
import InputButton from "../components/InputButton.js";
import SignUpContainer from "../components/SignUpContainer.js";
import { removeCookie, setCookie } from "../cookie.js";

const CustomColors = getComputedStyle(document.documentElement);
const MAINCOLOR = CustomColors.getPropertyValue("--main-color");
const BGCOLOR = CustomColors.getPropertyValue("--background-color");
const YELLOWCOLOR = CustomColors.getPropertyValue("--yellow-color");
const WARNCOLOR = CustomColors.getPropertyValue("--warning-color");

function LogIn({ setAccessToken, setRefreshToken }) {
  const history = useHistory();
  function onLoginSubmit(event) {
    event.preventDefault();
    axios_Login_post();
  }
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const onChangeId = (event) => setLoginId(event.target.value);
  const onChangePw = (event) => setLoginPw(event.target.value);

  const axios_Login_post = () => {
    const url = "https://www.science-match.p-e.kr/auth/login";

    const data = {
      email: loginId,
      password: loginPw,
      access_token_expired_time: 3000,
      refresh_token_expired_time: 3000
    };

    Axios.post(url, data)
      .then((response) => {
        setLoginId("");
        setLoginPw("");
        setCookie("aToken", `${response.data.data.accessToken}`);
        setCookie("rToken", `${response.data.data.refreshToken}`);
        history.push("/teacher");
      })
      .catch((error) => {
        console.log(error);
        alert("아이디 혹은 비밀번호가 틀립니다.");
        setLoginPw("");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "95vh",
        background: "white"
      }}
    >
      <form
        onSubmit={onLoginSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "90vh",
          maxWidth: "400px",
          padding: "20px",
          background: "white",
          borderRadius: "10px"
        }}
      >
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: 50,
            color: "",
            fontWeight: "bolder"
          }}
        >
          <span style={{ color: MAINCOLOR }}>Science</span> Match
        </h1>
        <SignUpContainer>
          <InputBox
            type="text"
            value={loginId}
            onChange={onChangeId}
            maxLength="25"
            placeholder="이메일"
            isRequired={true}
          ></InputBox>
        </SignUpContainer>
        <InputBox
          isRequired={true}
          maxLength="25"
          type="password"
          placeholder="비밀번호"
          value={loginPw}
          onChange={onChangePw}
        ></InputBox>
        <h3>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Link to={`/signup`}>Sign Up</Link>
            <InputButton type="submit" value="Log in" />
          </div>
        </h3>
      </form>
    </div>
  );
}
export default LogIn;
