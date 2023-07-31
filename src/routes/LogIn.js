import { useState, useEffect } from "react";
import { ReactDOM } from "react";
import { Link } from "react-router-dom";

function LogIn() {
  function onLoginSubmit(event) {
    event.preventDefault();
    setLoginId("");
    setLoginPw("");
    console.log("Submit event Occured");
    loginFetch();
  }
  const [loginId, setLoginId] = useState("member@gmail.com");
  const [loginPw, setLoginPw] = useState("Iammember10!");
  const onChangeId = (event) => setLoginId(event.target.value);
  const onChangePw = (event) => setLoginPw(event.target.value);
  const url = "https://www.sophy.p-e.kr/auth/login";
  const Data = {
    email: loginId,
    password: loginPw,
    access_token_expired_time: 3000,
    refresh_token_expired_time: 3000,
  };
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
  }
  return (
    <form onSubmit={onLoginSubmit}>
      <h1>Science match</h1>
      <input
        required
        maxLength="25"
        type="text"
        name="loginId"
        placeholder="아이디"
        id="loginId"
        value={loginId}
        onChange={onChangeId}
      ></input>
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
