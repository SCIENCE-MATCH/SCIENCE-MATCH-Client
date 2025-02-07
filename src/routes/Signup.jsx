import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import styled from "styled-components";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPw, setValidPw] = useState(false);
  const [validPhoneNum, setValidPhoneNum] = useState(false);
  const [pwAccord, setPwAccord] = useState(false);
  const [submitAble, setSubmitAble] = useState(false);

  const fillName = (event) => {
    const newName = event.target.value;
    if (newName.length < 11) setName(newName);
  };
  const fillPhoneNum = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    if (/^\d*$/.test(newValue) && newValue.length < 12) {
      if (phoneNum === "") setPhoneNum("010" + newValue);
      else if (newValue.length < 4) setPhoneNum("");
      else setPhoneNum(newValue);
    }
  };
  const fillPassword = (event) => {
    const newPw = event.target.value;
    if (newPw.length < 17) setPassword(newPw);
  };
  const fillPwCheck = (event) => {
    const newPw = event.target.value;
    if (newPw.length < 17) setPwCheck(newPw);
  };

  const formatPhoneNum = (num) => {
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
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
    const emailPattern = /^[a-zA-Z0-9._-]{2,64}@[a-zA-Z0-9.-]{2,255}\.[a-zA-Z]{2,4}$/;
    setValidEmail(emailPattern.test(email));
  };
  const pwValidityCheck = () => {
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    setValidPw(pwPattern.test(password));
  };
  const phoneNumValidityCheck = () => {
    const phoneNumPattern = /^[0-9]{10,11}$/;
    setValidPhoneNum(phoneNumPattern.test(phoneNum));
  };

  const passwordAccordCheck = () => {
    if (password === pwCheck && password !== "") {
      setPwAccord(true);
    } else {
      setPwAccord(false);
    }
  };
  const finalSummitAble = () =>
    setSubmitAble(validEmail && pwAccord && validName && validName && validPhoneNum && validPw);

  useEffect(nameValidityCheck, [name]);
  useEffect(emailValidityCheck, [email]);
  useEffect(phoneNumValidityCheck, [phoneNum]);
  useEffect(pwValidityCheck, [password]);
  useEffect(passwordAccordCheck, [password, pwCheck]);
  useEffect(finalSummitAble, [validEmail, pwAccord, validName, validPhoneNum, validPw]);

  const signupSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email, //**@.
      name: name, //2~10(한글, 영어)
      password: password, //8~16(영문, 숫자)
      phoneNum: phoneNum, //10~11(숫자)
    };
    await Axios.post(`https://www.science-match.p-e.kr/auth/dupl-check`, {
      email: email,
    })
      .then((response) => {
        if (response.data.code === 200) {
          Axios.post("https://www.science-match.p-e.kr/auth/signup", data)
            .then(() => {
              alert("회원가입 완료");
            })
            .catch(() => {
              alert("회원가입이 정상적으로 처리되지 않았습니다");
            });
        }
      })
      .catch(() => {
        alert("이미 가입된 이메일입니다.");
      });
    navigate("/");
  };

  return (
    <SUP.Wrapper>
      <SUP.SignUpSection>
        <SUP.TitleLine
          onClick={() => {
            navigate("/");
          }}
        >
          <SUP.TitleColor>Science</SUP.TitleColor>
          <SUP.TitleBlack>Match</SUP.TitleBlack>
        </SUP.TitleLine>

        <SUP.InputLine>
          <SUP.InputBox
            isRequired={true}
            type="text"
            placeholder="이름"
            value={name}
            onChange={fillName}
            $isValid={name === "" || validName}
          ></SUP.InputBox>
        </SUP.InputLine>
        {name === "" || validName ? null : <SUP.WarningLine>한글, 영문 2~10자리</SUP.WarningLine>}

        <SUP.InputLine>
          <SUP.InputBox
            placeholder="이메일@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $isValid={email === "" || validEmail}
            spellCheck="false"
          ></SUP.InputBox>
        </SUP.InputLine>

        <SUP.InputLine>
          <SUP.InputBox
            placeholder="전화번호"
            value={formatPhoneNum(phoneNum)}
            onChange={fillPhoneNum}
            $isValid={phoneNum === "" || phoneNum > 1000000000}
          ></SUP.InputBox>
        </SUP.InputLine>

        <SUP.InputLine>
          <SUP.InputBox
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={fillPassword}
            $isValid={password === "" || validPw}
          ></SUP.InputBox>
        </SUP.InputLine>
        {password === "" || validPw ? null : <SUP.WarningLine>영문, 숫자 8~16자리</SUP.WarningLine>}

        <SUP.InputLine>
          <SUP.InputBox
            type="password"
            placeholder="비밀번호 확인"
            value={pwCheck}
            onChange={fillPwCheck}
            $isValid={password === "" || pwCheck === "" || pwAccord}
          ></SUP.InputBox>
        </SUP.InputLine>
        {password === "" || pwCheck === "" ? "" : pwAccord ? null : <SUP.WarningLine>비밀번호 불일치</SUP.WarningLine>}

        <SUP.BtnLine>
          <SUP.RoundBtn type="submit" disabled={!submitAble} onClick={signupSubmit}>
            회원 가입
          </SUP.RoundBtn>
        </SUP.BtnLine>
      </SUP.SignUpSection>
    </SUP.Wrapper>
  );
}

export default SignUp;

const SUP = {
  Wrapper: styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 87rem;
  `,
  SignUpSection: styled.div`
    display: flex;
    flex-direction: column;
  `,
  TitleLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 6rem;
    width: 40rem;
    cursor: pointer;
    @media only screen and (max-width: 500px) {
      height: 8rem;
    }
  `,
  TitleColor: styled.div`
    font-size: 5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.mainColor};
    @media only screen and (max-width: 500px) {
      font-size: 4.5rem;
    }
  `,
  TitleBlack: styled.div`
    font-size: 5rem;
    font-weight: 600;
    color: black;
    @media only screen and (max-width: 500px) {
      font-size: 4.5rem;
    }
  `,
  InputLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 40rem;
    height: 7.5rem;
  `,
  InputBox: styled.input`
    width: 40rem;
    height: 5rem;
    padding: 2rem;
    font-size: 2rem;
    font-weight: 600;
    border: 0.2rem solid ${({ $isValid, theme }) => ($isValid ? theme.colors.gray50 : theme.colors.warning)};
    border-radius: 5rem;
    &:focus {
      outline: none;
    }
    @media only screen and (max-width: 500px) {
      width: 37rem;
      height: 6.5rem;
      border-radius: 1rem;
    }
  `,
  WarningLine: styled.div`
    margin-top: -1rem;
    width: 40rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.warning};
    margin-bottom: -1rem;
  `,
  RoundBtn: styled.button`
    color: white;
    font-size: 2rem;
    font-weight: 600;
    width: 13rem;
    height: 5rem;
    border-radius: 10rem;
    border: none;
    background-color: ${({ theme }) => theme.colors.mainColor};
    outline: none;
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray30};
    }
    margin-inline: 1rem;
    @media only screen and (max-width: 500px) {
      width: 37rem;
      height: 6.5rem;
      border-radius: 1rem;
      margin-top: -1.5rem;
    }
  `,
  BtnLine: styled.div`
    margin-top: 2rem;
    width: 40rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};
