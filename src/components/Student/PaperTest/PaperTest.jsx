import React, { useState } from "react";
import styled from "styled-components";
import postPaperTest from "../../../libs/apis/postPaperTest";
import useGetPaperTest from "../../../libs/hooks/useGetPaperTest";

const PaperTest = () => {
  localStorage.clear();
  const { data } = useGetPaperTest();
  const [input, setInput] = useState([]);

  const handleClickSubmitBtn = (e) => {
    const id = e.target.id.split("_")[1];
    postPaperTest(input, id);
  };

  const handleChangeInput = (e) => {
    const questionId = e.target.id;
    const updatedInput = [...input];
    const existingQuestion = updatedInput.find((item) => item.id === questionId);

    if (existingQuestion) {
      // 이미 해당 질문에 대한 답변이 있는 경우 업데이트
      existingQuestion.answer = e.target.value;
    } else {
      // 해당 질문에 대한 답변이 없는 경우 추가
      updatedInput.push({ id: questionId, answer: e.target.value });
    }

    setInput(updatedInput);
  };

  return (
    <St.Wrapper>
      {data &&
        data.map((v, idx) => (
          <St.ContentsWrapper id="question-answer" key={`PaperTest${idx + 1}`}>
            <St.QuestionWrapper>
              <St.Question>질문 :</St.Question>
              <St.Question>{v.question}</St.Question>
            </St.QuestionWrapper>

            <St.AnswerWrapper>
              <St.Answer>답 :</St.Answer>
              <St.AnswerInput
                id={v.id}
                placeholder="답을 입력하세요."
                value={(input.find((item) => item.id === v.id) || {}).answer}
                onChange={handleChangeInput}
              />

              <St.BtnWrapper>
                <St.SubmitBtn id={`submit_${v.id}`} type="submit" onClick={handleClickSubmitBtn}>
                  제출
                </St.SubmitBtn>
              </St.BtnWrapper>
            </St.AnswerWrapper>
          </St.ContentsWrapper>
        ))}
    </St.Wrapper>
  );
};

export default PaperTest;

const St = {
  Wrapper: styled.section`
    display: flex;
    flex-direction: column;

    min-height: calc(100vh - 10.8rem);
    margin: 1.9rem 15.5rem;
    padding: 1rem 2.5rem 2rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
  `,

  ContentsWrapper: styled.article`
    display: flex;
    flex-direction: column;

    width: 100%;
    padding: 1.5rem 0;

    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.headerLi};

    gap: 1.5rem;
  `,

  QuestionWrapper: styled.div`
    display: grid;
    grid-template-columns: 0.8fr 10fr;
    align-items: center;

    width: 100%;
    padding: 2.5rem 1.8rem;

    border: 0.1rem solid;
    border-radius: 0.5rem;
  `,

  Question: styled.p`
    word-break: keep-all;
    font-weight: 400;
    font-size: 2rem;
    line-height: 2.42rem;
  `,

  AnswerWrapper: styled.div`
    display: grid;
    grid-template-columns: 1fr 10fr 2.5fr;
    align-items: center;

    width: 100%;
    padding: 0.9rem 1.8rem;

    border: 0.1rem solid;
    border-radius: 0.5rem;
  `,

  Answer: styled.p`
    word-break: keep-all;
    font-weight: 400;
    font-size: 2rem;
    line-height: 2.42rem;
  `,

  AnswerInput: styled.input`
    border: none;

    word-break: keep-all;
    font-weight: 400;
    font-size: 2rem;
    line-height: 2.42rem;
  `,

  BtnWrapper: styled.div`
    text-align: right;
  `,

  SubmitBtn: styled.button`
    padding: 0.5rem 3.8rem;

    border-radius: 1rem;

    background-color: ${({ theme }) => theme.colors.mainColor};

    color: ${({ theme }) => theme.colors.headerBg};
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 2.905rem;
  `,
};
