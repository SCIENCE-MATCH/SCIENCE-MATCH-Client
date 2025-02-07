import React, { useState } from "react";
import styled from "styled-components";
import handleChangeInput from "../../../utils/handleChangeInput";
import useGetPaperTest from "../../../libs/hooks/Student/useGetPaperTest";
import usePostPaperTest from "../../../libs/apis/Student/postPaperTest";

const PaperTest = () => {
  const { postPaperTest } = usePostPaperTest();
  localStorage.clear();
  const { data } = useGetPaperTest();
  const [input, setInput] = useState([]);

  const handleClickSubmitBtn = (e) => {
    const id = e.target.id.split("_")[1];
    postPaperTest(input, id);
  };

  const updateInput = (input) => {
    setInput(input);
  };

  return (
    <St.Wrapper>
      {data &&
        data.map((v, idx) => (
          <St.ContentsWrapper id="question-answer" key={`PaperTest${idx + 1}`}>
            <St.TempWrapper>
              <St.QuestionLabel>질문</St.QuestionLabel>
              <St.QuestionWrapper $withImage={v.image}>
                <St.Question>
                  {v.question +
                    "가나다라마 바사아자차 카 타 파 하 헷 가나다라마 바사아자차 카 타 파 하 헷 가나다라마 바사아자차 카타파하헷 가나다라마 바사아자차 카타파하헷"}
                </St.Question>
                {v.image && <St.ImageBox src={v.image} />}
              </St.QuestionWrapper>
            </St.TempWrapper>

            <St.TempSecondWrapper>
              <St.AnswerLabel>답</St.AnswerLabel>
              <St.AnswerWrapper>
                <St.AnswerInput
                  id={v.id}
                  placeholder="답을 입력하세요."
                  value={(input.find((item) => item.id === v.id) || {}).answer}
                  onChange={(e) => handleChangeInput(e, input, updateInput)}
                />
                <St.BtnWrapper>
                  <St.SubmitBtn id={`submit_${v.id}`} type="submit" onClick={handleClickSubmitBtn}>
                    제출
                  </St.SubmitBtn>
                </St.BtnWrapper>
              </St.AnswerWrapper>
            </St.TempSecondWrapper>
            <St.HorizontalBar />
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

    min-height: 40rem;
    height: calc(100vh - 10rem);
    margin: 7rem 15.5rem 0 15.5rem;
    padding: 1rem 0 2rem 2.5rem;

    background-color: ${({ theme }) => theme.colors.headerBg};
    overflow-y: overlay;
    overflow-x: hidden;
    scrollbar-gutter: stable; /* 스크롤바 공간을 항상 유지 */
    &::-webkit-scrollbar {
      width: 0.75rem;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
      cursor: grab;
    }

    &::-webkit-scrollbar-track {
      background: transparent; /* 트랙을 투명하게 설정 */
    }
    @media only screen and (max-width: 1150px) {
      margin: 7rem 5% 0 5%;
    }
    @media only screen and (max-width: 900px) {
      margin: 12rem 0 0 0;
    }
  `,

  ContentsWrapper: styled.article`
    display: flex;
    flex-direction: column;

    width: calc(100% - 1.75rem);
    padding: 1.5rem 0;

    gap: 1.5rem;
  `,
  HorizontalBar: styled.div`
    align-self: center;
    width: 50%;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray40};
    margin-bottom: -1rem;
  `,

  TempWrapper: styled.div`
    width: 100%;
    padding: 2.5rem 1.8rem;

    border: 0.2rem solid ${({ theme }) => theme.colors.gray40};
    border-radius: 0.5rem;
    position: relative;
  `,
  QuestionWrapper: styled.div`
    display: grid;
    grid-template-columns: ${({ $withImage }) => ($withImage ? `5fr 4fr` : `1fr`)};

    @media only screen and (max-width: 900px) {
      display: flex;
      flex-direction: column;
    }
  `,

  Question: styled.p`
    word-break: keep-all;
    font-weight: 400;
    font-size: 2rem;
    line-height: 2.42rem;
    @media only screen and (max-width: 600px) {
      font-size: 1.5rem;
    }
  `,
  QuestionLabel: styled.div`
    font-weight: 600;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.gray60};
    background-color: white;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray40};
    border-radius: 0.4rem;
    width: 7rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    position: absolute;
    margin: -4rem -0.5rem;
  `,
  ImageWrapper: styled.div`
    display: grid;
    grid-template-columns: 0.8fr 10fr;
    align-items: center;

    width: 100%;
    padding: 2.5rem 1.8rem;

    border: 0.1rem solid;
    border-radius: 0.5rem;
  `,
  ImageBox: styled.img`
    word-break: keep-all;
    width: 100%;
    height: auto;
  `,

  TempSecondWrapper: styled.div`
    width: 100%;
    padding: 0.9rem 1.8rem;

    border: 0.2rem solid ${({ theme }) => theme.colors.gray40};
    border-radius: 0.5rem;
    position: relative;
  `,
  AnswerWrapper: styled.div`
    display: grid;
    grid-template-columns: 5fr 1fr;
    @media only screen and (max-width: 900px) {
      grid-template-columns: 5fr 2fr;
    }
    @media only screen and (max-width: 600px) {
      grid-template-columns: 3fr 2fr;
    }
    align-items: center;
  `,

  AnswerLabel: styled.div`
    font-weight: 600;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.gray60};
    background-color: white;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray40};
    border-radius: 0.4rem;
    width: 7rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    position: absolute;
    margin: -2.25rem -0.5rem;
  `,
  Answer: styled.p`
    word-break: keep-all;
    font-weight: 400;
    font-size: 2rem;
    line-height: 2.42rem;
  `,

  AnswerInput: styled.input`
    height: 4rem;
    border: none;
    margin-top: 0.5rem;

    word-break: keep-all;
    font-weight: 400;
    font-size: 2rem;
    line-height: 2.42rem;
    @media only screen and (max-width: 600px) {
      font-size: 1.5rem;
      width: 20rem;
    }
    &:focus {
      outline: none;
    }
  `,

  BtnWrapper: styled.div`
    text-align: right;
  `,

  SubmitBtn: styled.button`
    width: 11rem;
    height: 4rem;

    border-radius: 1rem;

    background-color: ${({ theme }) => theme.colors.mainColor};

    color: ${({ theme }) => theme.colors.headerBg};
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 2.905rem;
  `,
};
