import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import handleChangeInput from "../../../utils/handleChangeInput";
import useGetAnswerStructure from "../../../libs/hooks/Student/useGetAnswerStructure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Solving = ({ handleClickedCloseBtn, id, originId, questionNum }) => {
  const { data, loading } = useGetAnswerStructure(id);
  const [input, setInput] = useState([]);
  const [updated, setUpdated] = useState(false);
  const updateInput = (input) => {
    setInput(input);
  };
  useEffect(() => {
    if (data) {
      if (!updated) {
        const updatedInput = [...input];
        data.categories.map((it, idx) => {
          updatedInput.push({ id: `${idx + 1}`, answer: "" });
        });
        updateInput(updatedInput);
        setUpdated(true);
      }
    }
  }, [data]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    // 화면 크기 변경 시 handleResize 호출
    window.addEventListener("resize", handleResize);

    // 초기 크기 설정
    handleResize();

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <PageLayout
      isCompleted={false}
      handleClickedCloseBtn={handleClickedCloseBtn}
      id={id}
      input={input}
      questionNum={questionNum}
    >
      {isMobile || (
        <St.QuestionWrapper>
          {!loading && <iframe title="pdf" src={`${data.pdf}#zoom=100`} width="100%" height="100%" />}
        </St.QuestionWrapper>
      )}

      <St.AnswerWrapper>
        <St.CodeBox>Code : {originId}</St.CodeBox>
        {data &&
          data.categories.map((it, idx) =>
            it === "MULTIPLE" ? (
              <St.Answer key={`radio_${idx}`}>
                <St.Number>{String(idx + 1).padStart(2, "0")}</St.Number>
                <form>
                  <St.RadioLine>
                    {[1, 2, 3, 4, 5].map((multipleV) => (
                      <St.RadioBox
                        key={`choice_${idx + 1}_${multipleV}`}
                        id={idx + 1}
                        name="multiple"
                        data-value={multipleV} // value 대신 data-value 사용
                        onClick={(e) => {
                          const value = e.currentTarget.getAttribute("data-value"); // data-value 값 읽기
                          handleChangeInput({ target: { id: e.currentTarget.id, value } }, input, updateInput);
                        }}
                      >
                        <St.RadioCircle>
                          {input[idx] === undefined ? (
                            ""
                          ) : input[idx].answer === String(multipleV) ? (
                            <FontAwesomeIcon icon={faCircle} />
                          ) : (
                            ""
                          )}
                        </St.RadioCircle>
                        <St.RadioLabel htmlFor={idx + 1}>{multipleV}</St.RadioLabel>
                      </St.RadioBox>
                    ))}
                  </St.RadioLine>
                </form>
              </St.Answer>
            ) : (
              <St.Answer key={`text_${idx}`}>
                <St.Number>{String(idx + 1).padStart(2, "0")}</St.Number>
                <AutoResizeTextAreaForStud
                  id={idx + 1}
                  value={(input.find((item) => item.id === idx + 1) || {}).answer}
                  handleChange={(e) => handleChangeInput(e, input, updateInput)}
                />
              </St.Answer>
            )
          )}
      </St.AnswerWrapper>
    </PageLayout>
  );
};

export default Solving;

const AutoResizeTextAreaForStud = ({ id, value, handleChange }) => {
  const textareaRef = useRef(null);
  const [fakeValue, setFakeValue] = useState(value);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [fakeValue]);

  const handleChangeWithFakeValue = (e) => {
    setFakeValue(e.target.value); // fakeValue 상태 업데이트
    handleChange(e); // 기존 handleChange 호출
  };

  return (
    <ARTA.TextAreaWrapper>
      <ARTA.MyTextArea
        id={id}
        ref={textareaRef}
        placeholder={"정답을 입력하세요"}
        value={value}
        onChange={handleChangeWithFakeValue}
      />
    </ARTA.TextAreaWrapper>
  );
};

const ARTA = {
  TextAreaWrapper: styled.div`
    position: relative;
    margin-inline: 1.4rem 0.7rem;
    /* width: 50rem; */
  `,
  MyTextArea: styled.textarea`
    align-content: center;
    width: 100%;
    min-height: 1rem;
    border-radius: 0.8rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
    padding-left: 1rem;
    padding-right: 0.5rem;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.7rem;
    font-weight: 600;
    line-height: 2rem; /* 텍스트를 정 가운데 배치하도록 조정 */
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    &::placeholder {
      color: ${({ theme }) => theme.colors.gray50};
      font-size: 1.7rem;
      font-weight: 600;
    }
    &:focus {
      outline: none;
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    }
  `,
};

const St = {
  QuestionWrapper: styled.article`
    width: 100%;
    height: calc(100vh - 21.8rem);
    //padding: 2.8rem 5.8rem;
    overflow: hidden;

    border-radius: 1.5rem;

    background-color: ${({ theme }) => theme.colors.brightGray};
  `,

  AnswerWrapper: styled.article`
    display: flex;
    flex-direction: column;

    height: calc(100vh - 25.5rem);
    overflow-y: auto;
    margin: 4.3rem 7.1rem 0 2.7rem;
    padding-bottom: 2.8rem;

    gap: 1.1rem;
    @media only screen and (max-width: 600px) {
      flex-direction: column;
      margin: 4.3rem 1rem 0 1rem;
    }
  `,
  CodeBox: styled.div`
    position: absolute;
    top: 10.5rem;
    font-size: 3rem;
    font-weight: 600;
    align-self: flex-end;
    margin-right: 1.5rem;
    color: gray;
  `,

  Answer: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 15fr;
    align-items: center;

    padding: 1rem 0.6rem 1rem 1.5rem;

    border-radius: 1rem;

    background-color: ${({ theme }) => theme.colors.lightMain};
  `,

  Number: styled.p`
    font-size: 2.4rem;
    font-weight: 600;
    line-height: 2.4rem;
    margin-bottom: 0.4rem;
  `,

  RadioLine: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    margin-left: 1.5rem;
    align-items: center;
  `,
  RadioBox: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  `,
  RadioCircle: styled.div`
    width: 2.2rem;
    height: 2.2rem;
    background-color: white;
    border: ${({ theme }) => theme.colors.black} 0.2rem solid;
    border-radius: 10rem;
    color: black;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  RadioInput: styled.input`
    margin-left: 4.5rem;

    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
    cursor: pointer;
  `,

  RadioLabel: styled.label`
    font-size: 2.2rem;
    font-weight: 400;
    line-height: 2.4rem;
    margin-left: 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;
  `,

  TextInput: styled.textarea`
    min-height: 100%;
    margin-left: 1.4rem;
    resize: vertical;

    border-radius: 1rem;

    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
  `,
};
