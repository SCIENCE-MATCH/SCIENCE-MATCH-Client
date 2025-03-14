import React, { useState } from "react";
import PageLayout from "./PageLayout";
import styled, { css } from "styled-components";
import useGetCompleteQuestionPaper from "../../../libs/hooks/Student/useGetCompleteQuestionPaper";

const Grading = ({ handleClickedCloseBtn, id, assignStatus }) => {
  const { data } = useGetCompleteQuestionPaper(id);

  // 해설 이미지 확인용 코드 -> 주석풀어서 확인하시고 나중에 필요없으면 지워주세용
  // const { data } = useGetCompleteQuestionPaper(57);

  const isGraded = assignStatus === "GRADED";
  const [imgSrc, setImgSrc] = useState("");

  const handleClickDescriptBtn = (src) => {
    setImgSrc(src);
  };

  return (
    <PageLayout isCompleted={true} handleClickedCloseBtn={handleClickedCloseBtn}>
      <St.GradingWrapper>
        {data && (
          <St.ScoreWrapper>
            <St.Wrapper>
              <St.Score $isGraded={isGraded}> {isGraded ? `${data.score}` : "?"}</St.Score>
              <St.TotalScore>{`/${data.totalScore} 점`}</St.TotalScore>
            </St.Wrapper>

            <St.QNumWrapper>
              <St.RightQNum $isGraded={isGraded}>{isGraded ? `${data.correctNum}` : "?"}</St.RightQNum>
              <St.TotalQNum>{`/${data.questionNum} 문제`}</St.TotalQNum>
            </St.QNumWrapper>
          </St.ScoreWrapper>
        )}

        <St.ContentsWrapper>
          {data &&
            data.answerResponseDtos.map((it, index) => {
              return (
                <St.DetailWrapper key={it.id}>
                  <St.AnswerDetail $isRight={it.rightAnswer} $isGraded={isGraded}>
                    <St.QNum>{index + 1}</St.QNum>
                    <St.Answer $isRight={it.rightAnswer} $isGraded={isGraded}>
                      {it.submitAnswer}
                    </St.Answer>
                  </St.AnswerDetail>

                  <div>
                    <St.Icon $isRight={it.rightAnswer} $isGraded={isGraded}>
                      {it.rightAnswer ? "○" : "✕"}
                    </St.Icon>
                  </div>

                  {isGraded && !it.rightAnswer && (
                    <St.RightAnswerWrapper $isGraded={isGraded}>
                      <St.RightAnswer>{`정답: ${it.solution}`}</St.RightAnswer>
                      <St.GoDescriptBtn type="button" onClick={() => handleClickDescriptBtn(it.solutionImg)}>
                        해설 보기
                      </St.GoDescriptBtn>
                    </St.RightAnswerWrapper>
                  )}
                  {!isGraded && (
                    <St.RightAnswerWrapper $isGraded={isGraded}>
                      <St.GoDescriptBtn type="button">해설 보기</St.GoDescriptBtn>
                    </St.RightAnswerWrapper>
                  )}
                </St.DetailWrapper>
              );
            })}
        </St.ContentsWrapper>
      </St.GradingWrapper>

      <St.DescriptWrapper>{imgSrc && <St.DescriptImg src={imgSrc} />}</St.DescriptWrapper>
    </PageLayout>
  );
};

export default Grading;

const St = {
  GradingWrapper: styled.article`
    display: flex;
    flex-direction: column;

    position: relative;

    gap: 2.3rem;
  `,

  ScoreWrapper: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;

    padding: 1rem 0;

    border: 0.1rem solid ${({ theme }) => theme.colors.headerLi};
    border-radius: 1.5rem;
  `,

  Wrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: end;

    padding: 2rem 0;

    gap: 0.5rem;
  `,

  Score: styled.p`
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 3.9rem;
  `,

  TotalScore: styled.p`
    color: ${({ theme }) => theme.colors.subText};
    font-size: 2rem;
    font-weight: 500;
    line-height: 3.3rem;
  `,

  QNumWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: end;

    padding: 2rem 0;

    border-left: 0.1rem solid ${({ theme }) => theme.colors.subText};

    gap: 0.5rem;
  `,

  RightQNum: styled.p`
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 3.9rem;
  `,

  TotalQNum: styled.p`
    color: ${({ theme }) => theme.colors.subText};
    font-size: 2rem;
    font-weight: 500;
    line-height: 3.3rem;
  `,

  ContentsWrapper: styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 39.3rem);

    padding: 1.9rem 2.7rem 1.9rem 1rem;
    overflow-y: auto;

    border: 0.1rem solid ${({ theme }) => theme.colors.statusComplete};
    border-radius: 0.9rem;

    gap: 1.1rem;
  `,

  DetailWrapper: styled.div`
    display: grid;
    grid-template-columns: 6fr 0.7fr;
    align-items: center;

    gap: 1.4rem;
  `,

  AnswerDetail: styled.div`
    display: flex;
    align-items: center;

    padding: 1.3rem;

    border-radius: 1rem;

    background-color: ${({ theme, $isRight, $isGraded }) =>
      $isGraded ? ($isRight ? theme.colors.lightMain : theme.colors.softWarning) : theme.colors.notGraded};

    gap: 3rem;
  `,

  QNum: styled.p`
    font-size: 2rem;
    font-weight: 400;
    line-height: 2.42rem;
  `,

  Answer: styled.p`
    ${({ $isGraded, $isRight, theme }) =>
      $isGraded
        ? css`
            color: ${$isRight ? theme.colors.headerPoint : theme.colors.wrong};

            font-weight: 600;
          `
        : css`
            font-weight: 500;
          `};

    font-size: 2rem;
    line-height: 2.42rem;
  `,

  Icon: styled.p`
    ${({ $isGraded }) =>
      !$isGraded &&
      css`
        display: none;
      `};

    color: ${({ theme, $isRight }) => ($isRight ? theme.colors.mainColor : theme.colors.warning)};
    text-align: center;
    font-size: 4rem;
    font-weight: 600;
  `,

  RightAnswerWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: ${({ $isGraded }) => ($isGraded ? "space-between" : "end")};

    margin-left: 3.8rem;
  `,

  RightAnswer: styled.p`
    color: ${({ theme }) => theme.colors.warning};
    font-size: 2rem;
    font-weight: 700;
    line-height: 2.42rem;
  `,

  GoDescriptBtn: styled.button`
    padding: 0.5rem 1.3rem;

    border-radius: 1rem;

    background-color: ${({ theme }) => theme.colors.statusComplete};

    color: ${({ theme }) => theme.colors.headerBg};
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 2.9rem;
  `,

  DescriptWrapper: styled.article`
    min-height: calc(100vh - 27rem);
    margin-left: 2rem;
    overflow-y: auto;

    border-radius: 0.9rem;
  `,

  DescriptImg: styled.img`
    width: 100%;
    //height: calc(100vh - 27rem);
    height: auto;
    background-color: ${({ theme }) => theme.colors.warning};
  `,
};
