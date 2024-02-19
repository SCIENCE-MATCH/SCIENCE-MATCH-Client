import React from "react";
import PageLayout from "./PageLayout";
import styled, { css } from "styled-components";
import useGetCompleteQuestionPaper from "../../../libs/hooks/useGetCompleteQuestionPaper";

const Grading = ({ handleClickedCloseBtn, id }) => {
  const { data } = useGetCompleteQuestionPaper(id);

  // api 수정되면 채점 전/ 후 분기처리 해야 함!!
  const assignStatus = "GRADED";
  const isGraded = assignStatus === "GRADED";

  return (
    <PageLayout isCompleted={true} handleClickedCloseBtn={handleClickedCloseBtn}>
      <St.GradingWrapper>
        {data && (
          <St.ScoreWrapper>
            <St.Score $isGraded={isGraded}> {isGraded ? `${data.score} 점` : "채점 전"}</St.Score>
            <St.QNumWrapper>
              <St.RightQNum $isGraded={isGraded}>{isGraded ? `${data.correctNum}` : "?"}</St.RightQNum>
              <St.TotalQNum>{`/${data.questionNum} 문제`}</St.TotalQNum>
            </St.QNumWrapper>
          </St.ScoreWrapper>
        )}

        <St.ContentsWrapper>
          {data &&
            data.answerResponseDtos.map((it) => {
              return (
                <St.DetailWrapper key={it.id}>
                  <St.AnswerDetail $isRight={it.rightAnswer} $isGraded={isGraded}>
                    <St.QNum>{it.id + 1}</St.QNum>
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
                      <St.GoDescriptBtn type="button">해설 보기</St.GoDescriptBtn>
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

      <St.DescriptWrapper>
        {/* 추후 문제/ 해설 이미지로 대체할 예정 */}
        <St.DescriptImg></St.DescriptImg>
      </St.DescriptWrapper>
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

  Score: styled.p`
    ${({ $isGraded, theme }) =>
      $isGraded
        ? css`
            font-weight: 700;
          `
        : css`
            color: ${theme.colors.subText};
            font-weight: 500;
          `};

    text-align: center;
    font-size: 3.2rem;
    line-height: 3.9rem;
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
    height: calc(100vh - 27rem);
    margin-left: 2rem;
    overflow-y: auto;

    border-radius: 0.9rem;
  `,

  // 추후 이미지로 대체 예정 !! - 내부 정의한 속성은 스크롤 확인을 위해 임의로 넣은 속성임.
  DescriptImg: styled.div`
    height: 100rem;

    background-color: ${({ theme }) => theme.colors.warning};
  `,
};
