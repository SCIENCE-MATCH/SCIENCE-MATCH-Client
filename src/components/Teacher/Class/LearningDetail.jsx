import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import { faArrowRotateLeft, faSliders } from "@fortawesome/free-solid-svg-icons";
import { ko } from "date-fns/locale/ko";
import useGetStudentSummary from "../../../libs/apis/Teacher/Class/postGetStudentSummary";

const LearningDetail = ({ studentId }) => {
  const { summaryData, getSummary } = useGetStudentSummary();

  const modifyDateToStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // 시간을 00:00:00:000로 설정
    return newDate;
  };
  const modifyDateToEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999); // 시간을 23:59:59.999로 설정
    return newDate;
  };
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const [dateFrom, setDateFrom] = useState(modifyDateToStartOfDay(oneMonthAgo));
  const [dateTo, setDateTo] = useState(modifyDateToEndOfDay(today));

  const [isFilterModalOn, setIsFilterModalOn] = useState(false);

  const setOneYear = () => {
    const targetDate = new Date();
    targetDate.setFullYear(today.getFullYear() - 1);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneMonth = () => {
    const targetDate = new Date();
    targetDate.setMonth(today.getMonth() - 1);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneWeek = () => {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - 7);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneDay = () => {
    setDateFrom(modifyDateToStartOfDay(today));
    setDateTo(modifyDateToEndOfDay(today));
  };
  useEffect(() => {
    const addOneDay = (date) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    };

    const adjustedDateTo = addOneDay(dateTo);
    getSummary(studentId, dateFrom, adjustedDateTo);
  }, [studentId, dateFrom, dateTo]);
  /**{
        "assignQuestionTotalNum": 3,
        "assignQuestionAverageScore": 0,
        "assignPaperTotalNum": 6,
        "assignPaperCorrectPercent": 0,
        "summaryAQResponseDtos": [
            {
                "category": "MULTIPLE",
                "title": "예시 문제지",
                "subject": "SCIENCE",
                "questionNum": 3,
                "correctPercent": 0
            }
        ]
    } */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 일
    return `${year}.${month}.${day}`;
  };
  const cutLongText = (text, cutLength) => {
    if (text.length > cutLength) return text.slice(0, cutLength) + "...";
    else return text;
  };
  const attributes = ["학습지명", "문제수", "점수"];
  const widths = [47, 10, 10];
  return (
    <LD.Wrapper>
      {isFilterModalOn && (
        <DATEFILTER.Modal>
          <DATEFILTER.Title>검색 조건</DATEFILTER.Title>
          <DATEFILTER.FilterLine>
            <DATEFILTER.Label>학습지 생성 기간</DATEFILTER.Label>
            <DATEFILTER.DateInput
              selected={dateFrom}
              onChange={(date) => {
                setDateFrom(modifyDateToStartOfDay(date));
                if (date > dateTo) setDateTo(modifyDateToEndOfDay(date));
              }}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select a date"
              locale={ko} // locale 설정
            />
            ~
            <DATEFILTER.DateInput
              selected={dateTo}
              onChange={(date) => {
                setDateTo(modifyDateToEndOfDay(date));
                if (date < dateFrom) setDateFrom(modifyDateToStartOfDay(date));
              }}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select a date"
              locale={ko} // locale 설정
            />
          </DATEFILTER.FilterLine>
          <DATEFILTER.FilterLine>
            <DATEFILTER.Label>빠른 선택</DATEFILTER.Label>
            <DATEFILTER.ButtonContainer>
              <DATEFILTER.CategoryBtn onClick={setOneYear}>1년</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneMonth}>1달</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneWeek}>1주</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneDay}>1일</DATEFILTER.CategoryBtn>
            </DATEFILTER.ButtonContainer>
          </DATEFILTER.FilterLine>
          <DATEFILTER.SetContainer>
            <DATEFILTER.CloseBtn
              onClick={() => {
                setIsFilterModalOn(false);
              }}
            >
              닫기
            </DATEFILTER.CloseBtn>
            <DATEFILTER.ResetBtn
              onClick={() => {
                setOneMonth();
              }}
            >
              <FontAwesomeIcon icon={faArrowRotateLeft} />
              {` 전체 초기화`}
            </DATEFILTER.ResetBtn>
          </DATEFILTER.SetContainer>
        </DATEFILTER.Modal>
      )}
      <LD.DateContainer>
        <LD.EmptyDiv />
        <LD.Title>
          요약 대상 기간 : {formatDate(dateFrom)} ~ {formatDate(dateTo)}
        </LD.Title>
        <LD.FilterBtn
          onClick={() => {
            setIsFilterModalOn((prev) => !prev);
          }}
        >
          <FontAwesomeIcon icon={faSliders} />
          {` 기간 선택`}
        </LD.FilterBtn>
      </LD.DateContainer>
      <LD.Summarys>
        <LD.Completes>
          <LD.TitleLine>
            <LD.Title>풀이 결과</LD.Title>
          </LD.TitleLine>
          <LD.SummaryLine>
            <LD.PaperContainer>
              <LD.OptionLabel>학습지</LD.OptionLabel>
              <LD.InnerBox>
                <LD.InnerLabel>총 문제수</LD.InnerLabel>
                <LD.StatusBox>{summaryData.assignQuestionTotalNum}개</LD.StatusBox>
              </LD.InnerBox>
              <LD.InnerBox>
                <LD.InnerLabel>평균점수</LD.InnerLabel>
                <LD.StatusBox>{summaryData.assignQuestionAverageScore}점</LD.StatusBox>
              </LD.InnerBox>
            </LD.PaperContainer>
            <LD.PaperContainer>
              <LD.OptionLabel2>1:1 질문</LD.OptionLabel2>
              <LD.InnerBox>
                <LD.InnerLabel>총 문제수</LD.InnerLabel>
                <LD.StatusBox>{summaryData.assignPaperTotalNum}개</LD.StatusBox>
              </LD.InnerBox>
              <LD.InnerBox>
                <LD.InnerLabel>정답률</LD.InnerLabel>
                <LD.StatusBox>{summaryData.assignPaperCorrectPercent}%</LD.StatusBox>
              </LD.InnerBox>
            </LD.PaperContainer>
          </LD.SummaryLine>
          <LD.ListHeader>
            {attributes.map((att, index) => (
              <LD.AttributeBox key={index} $width={widths[index]} $isTitle={att === "학습지명"}>
                {att}
              </LD.AttributeBox>
            ))}
          </LD.ListHeader>
          <LD.ListContainer>
            {summaryData.solvedAQDto.map((paper, index) => (
              <LD.QuestionPaperLine key={index}>
                <LD.CellBox $width={widths[0]} $isTitle={true}>
                  <LD.PaperTitleLine>
                    {paper.title}
                    {paper.category === "MULTIPLE" && <LD.AutoEvaluateBox>자동채점</LD.AutoEvaluateBox>}
                  </LD.PaperTitleLine>
                </LD.CellBox>
                <LD.CellBox $width={widths[1]}>{paper.questionNum}문제</LD.CellBox>
                <LD.CellBox $width={widths[2]}>{paper.correctPercent}점</LD.CellBox>
              </LD.QuestionPaperLine>
            ))}
          </LD.ListContainer>
        </LD.Completes>
        <LD.NotCompletes>
          <LD.Papers>
            <LD.LinedTitleLine>
              <LD.Title>미완료 학습지</LD.Title>
            </LD.LinedTitleLine>
            <LD.ListContainer>
              {summaryData.notSolvedAQDto.map((paper, index) => (
                <LD.QuestionPaperLine key={index}>
                  <LD.CellBox $width={32} $isTitle={true}>
                    <LD.PaperTitleLine>
                      {cutLongText(paper.title, 14)}
                      {paper.category === "MULTIPLE" && <LD.AutoEvaluateBox>자동채점</LD.AutoEvaluateBox>}
                    </LD.PaperTitleLine>
                  </LD.CellBox>
                  <LD.CellBox $width={10}>
                    <LD.TagBox $colored={paper.assignStatus === "WAITING"}>
                      {paper.assignStatus === "WAITING" ? "미제출" : "채점 대기"}
                    </LD.TagBox>
                  </LD.CellBox>
                </LD.QuestionPaperLine>
              ))}
            </LD.ListContainer>
          </LD.Papers>
          <LD.Quizs>
            <LD.LinedTitleLine>
              <LD.Title>제출한 1:1질문</LD.Title>
            </LD.LinedTitleLine>
            <LD.ListContainer>
              {summaryData.solvedPTDto.map((quiz, index) => (
                <LD.QuestionPaperLine key={index}>
                  <LD.CellBox $width={32} $isTitle={true}>
                    <LD.PaperTitleLine>{cutLongText(quiz.question, 20)}</LD.PaperTitleLine>
                  </LD.CellBox>
                  <LD.CellBox $width={10}>제출됨</LD.CellBox>
                </LD.QuestionPaperLine>
              ))}
            </LD.ListContainer>
          </LD.Quizs>
        </LD.NotCompletes>
      </LD.Summarys>
    </LD.Wrapper>
  );
};

export default LearningDetail;

const LD = {
  Wrapper: styled.div`
    width: 113.5rem;
    height: 80rem;
    display: flex;
    flex-direction: column;
  `,
  FilterBtn: styled.button`
    width: 13rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    background-color: ${({ theme }) => theme.colors.gray10};
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 700;
    margin-right: 3rem;
  `,
  DateContainer: styled.div`
    width: 113.5rem;
    height: 8rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  EmptyDiv: styled.div`
    width: 13rem;
    height: 0.5rem;
    margin-left: 3rem;
  `,
  Summarys: styled.div`
    display: flex;
    flex-direction: row;
  `,
  Completes: styled.div`
    width: 68.5rem;
    height: 70rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-right: 2rem;
  `,
  NotCompletes: styled.div`
    display: flex;
    flex-direction: column;
  `,
  Papers: styled.div`
    width: 43rem;
    height: 34rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
  `,
  Quizs: styled.div`
    width: 43rem;
    height: 34rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    overflow: hidden;
  `,
  TitleLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  LinedTitleLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 600;
    margin-left: 3rem;
  `,
  SummaryLine: styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 3rem;
  `,
  PaperContainer: styled.div`
    width: 31rem;
    height: 7rem;
    margin-right: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

    border-radius: 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  OptionLabel: styled.div`
    height: 7rem;
    width: 9rem;
    background-color: ${({ theme }) => theme.colors.lightMain};
    color: ${({ theme }) => theme.colors.mainColor};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    font-size: 1.6rem;
    font-weight: 600;
  `,
  OptionLabel2: styled.div`
    height: 7rem;
    width: 9rem;
    background-color: ${({ theme }) => theme.colors.lightPurple};
    color: ${({ theme }) => theme.colors.purple};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    font-size: 1.6rem;
    font-weight: 600;
  `,
  InnerBox: styled.div`
    height: 7rem;
    width: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 600;
  `,
  InnerLabel: styled.div`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.gray50};
    margin-bottom: 0.5rem;
  `,
  StatusBox: styled.div`
    font-size: 1.8rem;
    color: black;
    margin-bottom: 0.5rem;
  `,

  /** 속성 */
  ListHeader: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
  `,
  AttributeBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    text-align: ${({ $isTitle }) => ($isTitle ? `left` : `center`)};
    padding-inline: ${({ $isTitle }) => ($isTitle ? `3rem` : `0rem`)};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: 53rem;
    overflow-y: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 0rem;
    }
    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      //border-radius: 1rem;
    }
    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      //border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  QuestionPaperLine: styled.article`
    height: 7rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-block: 0.005rem solid ${({ theme }) => theme.colors.gray10};
  `,
  CellBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    padding-left: ${({ $isTitle }) => ($isTitle ? `3rem` : `0rem`)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isTitle, theme }) => ($isTitle ? theme.colors.gray80 : theme.colors.gray60)};
  `,

  PaperTitleLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray80};
  `,
  AutoEvaluateBox: styled.div`
    width: 6rem;
    height: 2rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray40};
    color: white;
    font-size: 1.2rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
  `,
  TagBox: styled.div`
    width: 9rem;
    height: 3rem;
    border-radius: 0.6rem;
    background-color: ${({ $colored, theme }) => (!$colored ? theme.colors.mainColor : theme.colors.gray40)};
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};

const DATEFILTER = {
  Modal: styled.div`
    position: absolute;

    z-index: 5; /* Ensure the dropdown is above other elements */
    margin-left: 32.5rem;
    margin-top: 6rem;
    background: white;
    border: 0.02rem solid ${({ theme }) => theme.colors.brightGray};
    border-radius: 0.5rem;
    box-shadow: 0rem 1rem 2rem rgba(0, 0, 0, 0.3);
    width: 50rem;
    //height: 25rem;
  `,
  Title: styled.div`
    display: flex;
    align-items: center;
    width: 50rem;
    height: 5rem;
    padding-left: 2rem;
    margin-top: 1rem;
    font-size: 1.75rem;
    font-weight: 600;
  `,
  FilterLine: styled.div`
    width: 50rem;
    height: 6rem;
    display: flex;
    align-items: center;
    font-size: 1.75rem;
    font-weight: 600;
  `,
  Label: styled.div`
    margin-left: 2rem;

    width: 15rem;
    font-size: 1.6rem;
    font-weight: 600;
  `,
  DateInput: styled(DatePicker)`
    width: 13rem;
    height: 4.5rem;
    border: 1px solid ${({ theme }) => theme.colors.unselected};
    border-radius: 0.25rem;
    padding: 0.5rem;
    box-sizing: border-box;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    margin-inline: 1rem;
  `,
  ButtonContainer: styled.div`
    padding: 0.25rem;
    width: 34rem;
    display: flex;
    justify-content: space-between;
    padding-left: 1.25rem;
    padding-right: 2.5rem;
  `,
  CategoryBtn: styled.button`
    width: 6.5rem;
    height: 4rem;
    border-radius: 4rem;

    padding-inline: 1rem;
    box-shadow: 0 0 0
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.2rem${theme.colors.mainColor} inset` : `0.1rem${theme.colors.unselected} inset`};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : `white`)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray60)};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  SetContainer: styled.div`
    height: 6rem;
    width: 50rem;
    display: flex;
    flex-direction: row;
    padding-block: 1rem;
    padding-inline: 1.5rem;
  `,
  CloseBtn: styled.button`
    font-size: 1.6rem;
    font-weight: 600;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    color: ${({ theme }) => theme.colors.gray60};
    width: 10rem;
    height: 4rem;
  `,
  ResetBtn: styled.button`
    margin-left: auto;
    margin-right: 0.5rem;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray40};
  `,
  SaveBtn: styled.button`
    margin-left: auto;
    margin-right: 0.5rem;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.mainColor};
  `,
};
