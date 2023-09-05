import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import InputBox from "../components/InputBox.js";
import InputButton from "../components/InputButton.js";
import "../components/LinkStyle.css";
import SignUpContainer from "../components/SignUpContainer.js";

const MAINCOLOR = "#05F200";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPw, setValidPw] = useState(false);
  const [validPhoneNum, setValidPhoneNum] = useState(false);
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
    //console.log(`email validity: ${validEmail}`);
    event.preventDefault();

    if (validEmail) {
      Axios.post(`https://www.science-match.p-e.kr/auth/dupl-check`, {
        email: email
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
    } else {
      alert("이메일 형식을 올바르게 입력하십시오.");
    }
  };
  //**@.
  //2~10(한글, 영어)
  //8~16(영문, 숫자)
  //10~11(숫자)
  const nameValidityCheck = () => {
    const namePattern = /^[A-Za-z가-힣]{2,10}$/;
    setValidName(namePattern.test(name));
  };
  const emailValidityCheck = () => {
    const emailPattern =
      /^[a-zA-Z0-9._-]{2,64}@[a-zA-Z0-9.-]{2,255}\.[a-zA-Z]{2,4}$/;
    setValidEmail(emailPattern.test(email));
  };
  const pwValidityCheck = () => {
    const pwPattern = /^[A-Za-z0-9]{8,16}$/;
    setValidPw(pwPattern.test(password));
  };
  const phoneNumValidityCheck = () => {
    const phoneNumPattern = /^[0-9]{10,11}$/;
    setValidPhoneNum(phoneNumPattern.test(phoneNum));
  };

  const passwordAccordCheck = () => {
    //console.log("password accord check performed.");
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
      phoneNum !== "" &&
      validName &&
      validPhoneNum &&
      validPw
    ) {
      setSubmitAble(true);
    } else {
      setSubmitAble(false);
    }
  };

  useEffect(nameValidityCheck, [name]);
  useEffect(emailValidityCheck, [email]);
  useEffect(phoneNumValidityCheck, [phoneNum]);
  useEffect(pwValidityCheck, [password]);
  useEffect(passwordAccordCheck, [password, pwCheck]);
  useEffect(finalSummitAble, [emailChecked, pwAccord, name, phoneNum]);

  const signupSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email, //**@.
      name: name, //2~10(한글, 영어)
      password: password, //8~16(영문, 숫자)
      phoneNum: phoneNum //10~11(숫자)
    };
    const url = "https://www.science-match.p-e.kr/auth/signup";
    Axios.post(url, data)
      .then((response) => {
        //console.log(response);
        alert("회원가입 완료");
      })
      .catch((error) => {
        //console.log(error);
        alert("오류 발생");
      });
    history.push("/");
  };

  return (
    <form
      onSubmit={signupSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "95vh"
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
        <Link to={`/`}>
          <span className="customLink" style={{ color: MAINCOLOR }}>
            Science
          </span>{" "}
          Match
        </Link>
      </h1>
      <SignUpContainer>
        <InputBox
          isRequired={true}
          type="text"
          placeholder="이름"
          value={name}
          onChange={fillName}
        ></InputBox>
        {name === "" || validName ? "" : <>한글, 영문 2~10자리</>}
      </SignUpContainer>
      <SignUpContainer>
        <div>
          <button
            style={{
              width: 115,
              height: 0,
              padding: 0,
              border: "none",
              overflow: "hidden",
              disabeld: true
            }}
            tabIndex="-1"
          />
          &nbsp; &nbsp;
          <InputBox
            isRequired={true}
            type="text"
            placeholder="이메일@email.com"
            value={email}
            onChange={fillEmail}
          ></InputBox>
          &nbsp; &nbsp;
          <InputButton
            onClick={duplCheck}
            value={`중복확인`}
            disabled={emailChecked || !validEmail}
          />
        </div>
      </SignUpContainer>
      <SignUpContainer>
        <InputBox
          isRequired={true}
          type="tel"
          placeholder="전화번호"
          value={phoneNum}
          onChange={fillPhoneNum}
        ></InputBox>
        {phoneNum === "" || validPhoneNum ? "" : <>숫자 10~11자리</>}
      </SignUpContainer>
      <SignUpContainer>
        <InputBox
          isRequired={true}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={fillPassword}
        ></InputBox>
        {password === "" || validPw ? "" : <>영문, 숫자 8~16자리</>}
      </SignUpContainer>
      <SignUpContainer>
        <InputBox
          isRequired={true}
          type="password"
          placeholder="비밀번호 확인"
          value={pwCheck}
          onChange={fillPwCheck}
        ></InputBox>
        {password === "" || pwCheck === ""
          ? ""
          : pwAccord
          ? "비밀번호 일치"
          : "비밀번호 불일치"}
      </SignUpContainer>
      <h3>
        <InputButton type="submit" value="Sign Up" disabled={!submitAble} />
      </h3>
    </form>
  );
}

export default SignUp;
