import React from "react";
import styled from "styled-components";
import PageLayout from "./PageLayout";

const Solving = ({ handleClickedCloseBtn }) => {
  // api 통신 후 받은 결과로 대체
  const data = ["MULTIPLE", "SUBJECTIVE", "DESCRIPTIVE", "MULTIPLE", "MULTIPLE", "SUBJECTIVE"];

  return (
    <PageLayout isCompleted={false} handleClickedCloseBtn={handleClickedCloseBtn}>
      <St.QuestionWrapper>
        {/* 추후 학습지 이미지로 대체할 예정 */}
        <St.QuestionImg></St.QuestionImg>
      </St.QuestionWrapper>

      <St.AnswerWrapper>
        {data.map((it, idx) =>
          it === "MULTIPLE" ? (
            <St.Answer>
              <St.Number>{idx + 1}</St.Number>
              <form>
                {[1, 2, 3, 4, 5].map((multipleV) => (
                  <>
                    <St.RadioInput
                      id={`choice_${idx + 1}_${multipleV}`}
                      type="radio"
                      name="multiple"
                      value={multipleV}
                    />
                    <St.RadioLabel htmlFor={`choice_${idx + 1}_${multipleV}`}>{multipleV}</St.RadioLabel>
                  </>
                ))}
              </form>
            </St.Answer>
          ) : (
            <St.Answer>
              <St.Number>{idx + 1}</St.Number>
              <St.TextInput rows={1} />
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

  // 추후 학습지 이미지로 대체 예정 ! - 이미지 추가 후 속성 수정/ 제거 예정
  QuestionImg: styled.div`
    width: 100%;
    height: 100%;

    // 이미지 추가 후 제거할 속성임
    background-color: white;
  `,

  AnswerWrapper: styled.article`
    display: flex;
    flex-direction: column;

    margin: 2.8rem 7.1rem 6.3rem 2.7rem;

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
