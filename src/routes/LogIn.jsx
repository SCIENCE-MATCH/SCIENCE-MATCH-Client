import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import styled from "styled-components";
import { setCookie } from "../libs/cookie";

function LogIn() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  function onLoginSubmit(event) {
    event.preventDefault();
    if (loginId.includes("@")) teacher_Login_post();
    else student_Login_post();
  }
  const onChangeId = (event) => setLoginId(event.target.value);
  const onChangePw = (event) => setLoginPw(event.target.value);

  const teacher_Login_post = () => {
    const url = "https://www.science-match.p-e.kr/auth/login";

    const data = {
      email: loginId,
      password: loginPw,
      access_token_expired_time: 3000,
      refresh_token_expired_time: 3000,
    };

    Axios.post(url, data)
      .then((response) => {
        setLoginId("");
        setLoginPw("");
        setCookie("aToken", `${response.data.data.accessToken}`);
        setCookie("rToken", `${response.data.data.refreshToken}`);

        loginId === "hyh12100863@gmail.com" ? navigate("/admin") : navigate("/teacher");
      })
      .catch((error) => {
        if (error.code === "ERR_BAD_RESPONSE") {
          alert("서버에 연결할 수 없습니다.");
        } else {
          alert("아이디 혹은 비밀번호가 틀립니다.");
          setLoginPw("");
        }
      });
  };

  const student_Login_post = () => {
    const url = "https://www.science-match.p-e.kr/auth/login/student";

    const data = {
      phoneNum: loginId,
      password: loginPw,
      access_token_expired_time: 3000,
      refresh_token_expired_time: 3000,
    };

    Axios.post(url, data)
      .then((response) => {
        setLoginId("");
        setLoginPw("");
        setCookie("aToken", `${response.data.data.accessToken}`);
        setCookie("rToken", `${response.data.data.refreshToken}`);
        navigate("/student");
        console.log(response.data.data.accessToken);
      })
      .catch((error) => {
        if (error.code === "ERR_BAD_RESPONSE") {
          alert("서버에 연결할 수 없습니다.");
        } else {
          alert("아이디 혹은 비밀번호가 틀립니다.");
          setLoginPw("");
        }
      });
  };

  useEffect(() => {
    setLoginId("");
    setLoginPw("");
  }, []);

  const setStud = () => {
    setLoginId("01087654321");
    setLoginPw("01087654321");
  };

  const setTeacher = () => {
    //setLoginId("testpark01@gmail.com"); //
    setLoginId("science@gmail.com");
    setLoginPw("test1234");
  };
  const setAdmin = () => {
    setLoginId("hyh12100863@gmail.com");
    setLoginPw("hyh12100863@");
  };
  return (
    <LI.Wrapper>
      <LI.MainContent onSubmit={onLoginSubmit}>
        <LI.TitleLine>
          <LI.TitleColor>Science</LI.TitleColor>
          <LI.TitleBlack>Match</LI.TitleBlack>
        </LI.TitleLine>
        <LI.InputLine>
          <LI.InputBox
            type="text"
            value={loginId}
            onChange={onChangeId}
            maxLength="40"
            placeholder="이메일"
            isRequired={true}
          ></LI.InputBox>
        </LI.InputLine>
        <LI.InputBox
          isRequired={true}
          maxLength="25"
          type="password"
          placeholder="비밀번호"
          value={loginPw}
          onChange={onChangePw}
        ></LI.InputBox>
        <LI.SubmitContainer>
          <LI.SignUpBtn
            type="button"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </LI.SignUpBtn>
          <LI.RoundBtn type="submit" disabled={loginId === "" || loginPw === ""}>
            Log In
          </LI.RoundBtn>
        </LI.SubmitContainer>
        {/*이 아래 지우면 됨 */}
        <LI.OptionContainer>
          <LI.OptionBtn onClick={setStud}>Set Student</LI.OptionBtn>
          <LI.OptionBtn onClick={setTeacher}>Set Teacher</LI.OptionBtn>
          <LI.OptionBtn onClick={setAdmin}>Set Admin</LI.OptionBtn>
        </LI.OptionContainer>
      </LI.MainContent>
    </LI.Wrapper>
  );
}
export default LogIn;

const LI = {
  Wrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 95vh;
    background-color: white;
  `,
  MainContent: styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50rem;
    height: 40rem;
  `,
  TitleLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 6rem;
    width: 40rem;
  `,
  TitleColor: styled.div`
    font-size: 5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.mainColor};
  `,
  TitleBlack: styled.div`
    font-size: 5rem;
    font-weight: 600;
    color: black;
  `,

  SubmitContainer: styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;
    font-size: 3rem;
    margin-top: 2rem;
  `,
  OptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 2rem;
  `,
  OptionBtn: styled.button`
    background-color: ${({ theme }) => theme.colors.brightGray};
    width: 15rem;
    height: 4rem;
    margin: 0rem 0.5rem 0rem 0.5rem;
    border-radius: 1.5rem;
  `,
  InputLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 40rem;
    height: 10rem;
  `,
  InputBox: styled.input`
    width: 40rem;
    height: 5rem;
    padding: 2rem;
    font-size: 2rem;
    font-weight: 600;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
    border-radius: 5rem;
  `,
  SignUpBtn: styled.button`
    font-size: 2rem;
    font-weight: 600;
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
  `,
};
