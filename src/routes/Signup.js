import { ReactDOM } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import reactRouterDom from "react-router-dom";
import { useHistory } from "react-router-dom";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [pwAccord, setPwAccord] = useState(false);
  const [submitAble, setSubmitAble] = useState(false);

  const fillName = (event) => setName(event.target.value);
  const fillEmail = (event) => {
    setEmail(event.target.value);
    setEmailChecked(false);
  };
  const fillPhoneNum = (event) => setPhoneNum(event.target.value);
  const fillPassword = (event) => setPassword(event.target.value);
  const fillPwCheck = (event) => setPwCheck(event.target.value);

  const duplCheck = async (event) => {
    event.preventDefault(); /*
    const response = await fetch(`{{LOCAL_URL}}/auth/dupl-check`);
    const json = await response.json();*/
    if (true /*json.code !== 409*/) {
      setEmailChecked(true);
      alert("이메일 사용 가능!");
    }
  };
  const passwordAccordCheck = () => {
    console.log("password accord check performed.");
    if (password === pwCheck && password !== "") {
      setPwAccord(true);
    } else {
      setPwAccord(false);
    }
  };
  const finalSummitAble = () => {
    if (
      emailChecked === true &&
      pwAccord === true &&
      name !== "" &&
      phoneNum !== ""
    ) {
      setSubmitAble(true);
    } else {
      setSubmitAble(false);
    }
  };

  useEffect(passwordAccordCheck, [password, pwCheck]);
  useEffect(finalSummitAble, [emailChecked, pwAccord, name, phoneNum]);

  const Data = {
    email: email,
    name: name,
    password: password,
    phoneNum: phoneNum,
  };
  const otherParams = {
    method: "post",
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
  };
  const signupFetch = () => {
    console.log(Data);
    fetch("{{LOCAL_URL}}/auth/signup", otherParams)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res.message);
      })
      .catch((error) => console.log(error));
  };
  const signupSubmit = () => {
    signupFetch();
    alert("회원가입 완료!");
    history.push("/");
  };

  return (
    <form onSubmit={signupSubmit}>
      <h1>Science match</h1>
      <input
        required
        type="text"
        placeholder="이름"
        value={name}
        onChange={fillName}
      ></input>
      <br></br>
      <input
        required
        type="text"
        placeholder="이메일"
        value={email}
        onChange={fillEmail}
      ></input>
      <button onClick={duplCheck} disabled={emailChecked}>
        중복 확인
      </button>
      <br></br>
      <input
        required
        type="tel"
        placeholder="전화번호"
        value={phoneNum}
        onChange={fillPhoneNum}
      ></input>
      <br></br>
      <input
        required
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={fillPassword}
      ></input>
      <br></br>
      <input
        required
        type="password"
        placeholder="비밀번호 확인"
        value={pwCheck}
        onChange={fillPwCheck}
      ></input>
      <h5>{pwAccord ? "비밀번호 일치" : "비밀번호 불일치"}</h5>
      <h3>
        <input type="submit" value="Sign Up" disabled={!submitAble} />
      </h3>
    </form>
  );
}

export default SignUp;
