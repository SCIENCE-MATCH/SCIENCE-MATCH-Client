import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Axios from "axios";

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
    event.preventDefault();

    Axios.post(`https://www.science-match.p-e.kr/auth/dupl-check`, {
      email: email,
    })
      .then((response) => {
        if (response.data.code === 200) {
          setEmailChecked(true);
          alert(response.data.message);
        }
      })
      .catch((error) => {
        alert("중복된 이메일 입니다.");
      });
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

  const signupSubmit = (event) => {
    event.preventDefault();
    console.log(
      `email:${email}, name:${name}, pw:${password},${typeof password}, pN:${phoneNum},${typeof phoneNum}`
    );
    Axios.post(`https://www.science-match.p-e.kr/auth/signup`, {
      email: "science@gmail.y",
      name: "김사매",
      password: "test1234",
      phoneNum: "01012345678",
      /*
      email: email,
      name: name,
      password: password,
      phoneNum: phoneNum,*/
    })
      .then((response) => {
        console.log("우선 보내긴 함");
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        alert("오류 발생");
      });
    //history.push("/");
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
