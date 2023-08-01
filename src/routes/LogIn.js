import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import InputBox from "../components/InputBox";

function LogIn() {
  const axios = require(`axios`);

  function onLoginSubmit(event) {
    event.preventDefault();
    setLoginId("");
    setLoginPw("");
    axios_Login_post();
  }
  const [loginId, setLoginId] = useState("science@gmail.com");
  const [loginPw, setLoginPw] = useState("test1234");
  const onChangeId = (event) => setLoginId(event.target.value);
  const onChangePw = (event) => setLoginPw(event.target.value);
  /*
  const otherParams = {
    method: "post",
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
  };
  function loginFetch() {
    fetch(url, otherParams)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.accessToken);
      })
      .catch((error) => console.log(error));
  }*/

  const axios_Login_post = () => {
    const url = "https://www.science-match.p-e.kr/auth/login";

    const data = {
      email: loginId,
      password: loginPw,
      access_token_expired_time: 3000,
      refresh_token_expired_time: 3000,
    };

    Axios.post(url, data)
      .then((response) => {
        console.log(response);
        console.log(`acces Token : ${response.data.data.accessToken}`);
        console.log(`refresth Token : ${response.data.data.refreshToken}`);
      })
      .catch((error) => {
        console.log(error);
        alert("아이디 혹은 비밀번호가 틀립니다.");
      });
  };

  return (
    <form onSubmit={onLoginSubmit}>
      <h1>Science match</h1>
      <InputBox
        type="text"
        value={loginId}
        onChange={onChangeId}
        maxLegnth="25"
        placeholder="아이디"
        isRequired="true"
      ></InputBox>
      <br></br>
      <input
        required
        maxLength="25"
        type="password"
        name="loginPw"
        placeholder="비밀번호"
        id="loginPw"
        value={loginPw}
        onChange={onChangePw}
      ></input>
      <h3>
        <Link to={`/signup`}>Sign Up</Link>{" "}
        <input type="submit" value="Log in" />
      </h3>
    </form>
  );
}
export default LogIn;
