import React, { useState } from "react";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import handleChangeInput from "../../../utils/handleChangeInput";
import useGetAnswerStructure from "../../../libs/hooks/useGetAnswerStructure";

const Solving = ({ handleClickedCloseBtn, id, questionNum }) => {
  const { data } = useGetAnswerStructure(id);
  const [input, setInput] = useState([]);

  const updateInput = (input) => {
    setInput(input);
  };

  return (
    <PageLayout
      isCompleted={false}
      handleClickedCloseBtn={handleClickedCloseBtn}
      id={id}
      input={input}
      questionNum={questionNum}
    >
      <St.QuestionWrapper>
        {/* api 통신 후 받아온 pdf로 대체 - 현재는 pdf 주소 임시로 넣어둠 */}
        <iframe title="pdf" src="https://www.pdfa.org/norm-refs/XFA-3_3.pdf" width="100%" height="100%"></iframe>
      </St.QuestionWrapper>

      <St.AnswerWrapper>
        {data &&
          data.map((it, idx) =>
            it === "MULTIPLE" ? (
              <St.Answer key={`radio_${idx}`}>
                <St.Number>{idx + 1}</St.Number>
                <form>
                  {[1, 2, 3, 4, 5].map((multipleV) => (
                    <React.Fragment key={`choice_${idx + 1}_${multipleV}`}>
                      <St.RadioInput
                        id={idx + 1}
                        type="radio"
                        name="multiple"
                        value={multipleV}
                        onChange={(e) => handleChangeInput(e, input, updateInput)}
                      />
                      <St.RadioLabel htmlFor={idx + 1}>{multipleV}</St.RadioLabel>
                    </React.Fragment>
                  ))}
                </form>
              </St.Answer>
            ) : (
              <St.Answer key={`text_${idx}`}>
                <St.Number>{idx + 1}</St.Number>
                <St.TextInput
                  id={idx + 1}
                  rows={1}
                  value={(input.find((item) => item.id === idx + 1) || {}).answer}
                  onChange={(e) => handleChangeInput(e, input, updateInput)}
                />
              </St.Answer>
            )
          )}
      </St.AnswerWrapper>
    </PageLayout>
  );
};

export default Solving;

const St = {
  QuestionWrapper: styled.article`
    width: 100%;
    height: calc(100vh - 21.8rem);
    padding: 2.8rem 5.8rem;
    overflow-y: auto;

    border-radius: 1.5rem;

    background-color: ${({ theme }) => theme.colors.brightGray};
  `,

  AnswerWrapper: styled.article`
    display: flex;
    flex-direction: column;

    height: calc(100vh - 21.8rem);
    overflow-y: auto;
    margin: 0 7.1rem 0 2.7rem;
    padding: 2.8rem 0;

    gap: 1.1rem;
  `,

  Answer: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 15fr;
    align-items: center;

    padding: 0.7rem 0.6rem 0.7rem 1.4rem;

    border-radius: 1rem;

    background-color: ${({ theme }) => theme.colors.lightMain};
  `,

  Number: styled.p`
    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
  `,

  RadioInput: styled.input`
    margin-left: 5.5rem;

    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
  `,

  RadioLabel: styled.label`
    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
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
