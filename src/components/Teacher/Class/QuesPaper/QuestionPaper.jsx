import { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCheck,
  faCircleMinus,
  faCloudArrowDown,
  faEllipsisVertical,
  faFilePdf,
  faRepeat,
  faSearch,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
import PDFViewer from "../../PrepareClass/QuestionPaper/PreviewPdf";
import ScorePaper from "./ScorePaper";
import useDeleteAssignPaper from "../../../../libs/apis/Teacher/Class/deleteAssignPaper";
import useGetPaperOfOne from "../../../../libs/hooks/Teacher/Class/useGetPaperOfOne";
import usePostPresentPaper from "../../../../libs/apis/Teacher/Class/postPresentPaper";
import MakeWrongPaper from "./WrongPaper/MakeWrongPaper";

const ClassQuestionPaper = ({ studentId, studentInfo }) => {
  const { deleteAssignPaper } = useDeleteAssignPaper();
  const { receivedPapers, getPaperAndAnswers } = useGetPaperOfOne();
  const { postPresentPaper } = usePostPresentPaper();

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
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const [dateFrom, setDateFrom] = useState(modifyDateToStartOfDay(fiveYearsAgo));
  const [dateTo, setDateTo] = useState(modifyDateToEndOfDay(today));

  const [isFilterModalOn, setIsFilterModalOn] = useState(false);

  const [papersWithAnswer, setPaperWithAnswer] = useState([]);
  const [lookMoreIndex, setLookMoreIndex] = useState(-1);
  const onLookMore = (index) => {
    if (lookMoreIndex == index) setLookMoreIndex(-1);
    else setLookMoreIndex(index);
  };
  const [searchName, setSearchName] = useState("");
  const [papersToRender, setPapersToRender] = useState([]);

  const [stateToSee, setStateToSee] = useState("전체");
  const stateOptions = ["전체", "완료", "제출", "미제출"];

  const changeState = (e) => {
    setStateToSee(e.target.value);
  };

  const [makingWrongPaper, setMakingWrongPaper] = useState(false);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [scoringPaper, setScoringPaper] = useState(null);

  const closeScoring = async () => {
    setScoringPaper(null);
    setPaperWithAnswer([]);
    await getPaperAndAnswers(studentId);
  };

  useEffect(() => {
    if (studentId) getPaperAndAnswers(studentId);
  }, [studentId]);
  useEffect(() => {
    setPaperWithAnswer(receivedPapers);
  }, [receivedPapers]);

  const deleteQuetionPaper = async (paperId) => {
    await deleteAssignPaper(paperId);
  };

  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const selectQuiz = (id) => {
    let tempPapers = [...papersWithAnswer];
    tempPapers.map((quiz) => {
      if (quiz.id === id) quiz.selected = !quiz.selected;
    });
    setPaperWithAnswer(tempPapers);

    let tempArr = [...selectedPaperIds];
    const index = tempArr.indexOf(id);

    if (index === -1) tempArr.push(id);
    else tempArr.splice(index, 1);

    setSelectedPaperIds(tempArr);
  };
  const deselectAll = () => {
    let tempPapers = [...papersWithAnswer];
    tempPapers.map((paper) => {
      paper.selected = false;
    });
    setPaperWithAnswer(tempPapers);
    setSelectedPaperIds([]);
    setPapersToRender([]);
  };
  const deleteAll = async () => {
    selectedPaperIds.map(async (qId) => {
      await deleteQuetionPaper(qId);
    });
    alert(`학습지 ${selectedPaperIds.length}개가 삭제 되었습니다.`);
    deselectAll();
  };

  const presentPapers = async (paperId) => {
    if (paperId) await postPresentPaper([studentId], [{ id: paperId }]);
    else
      await postPresentPaper(
        [studentId],
        selectedPaperIds.map((paperId) => ({
          id: paperId,
        }))
      );
    getPaperAndAnswers(studentId);
  };

  const [questionTagSet, setQuestionTagSet] = useState(["단원유형별", "시중교재", "모의고사"]);
  const selectTag = (e) => {
    const gotValue = e.target.value;
    let tempSet = [...questionTagSet];

    if (tempSet.includes(gotValue)) {
      tempSet = tempSet.filter((tag) => tag !== gotValue);
    } else {
      tempSet.push(gotValue);
    }
    setQuestionTagSet(tempSet);
  };

  const cutLongText = (text, cutLength) => {
    if (text.length > cutLength) return text.slice(0, cutLength) + "...";
    else return text;
  };

  const setFiveYears = () => {
    const targetDate = new Date();
    targetDate.setFullYear(today.getFullYear() - 5);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
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
    let status = "";
    switch (stateToSee) {
      case "전체":
        break;
      case "완료":
        status = "GRADED";
        break;
      case "제출":
        status = "COMPLETE";
        break;
      case "미제출":
        status = "WAITING";
        break;
      default:
        break;
    }
    if (papersWithAnswer.length > 0) {
      const filteredArr = papersWithAnswer.filter((quiz) => {
        const quizDate = new Date(quiz.createdAt);
        return (
          quiz.title.includes(searchName) &&
          quiz.assignStatus.includes(status) &&
          dateFrom < quizDate &&
          quizDate < dateTo
        );
      });
      setPapersToRender(filteredArr);
    } else {
      setPapersToRender([]);
    }
  }, [papersWithAnswer, searchName, questionTagSet, dateFrom, dateTo, stateToSee]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 일
    return `${year}.${month}.${day}`;
  };
  const attributes = ["선택", "학년", "학습지명", "출제일", "재출제", "미리보기", "점수", "더보기"];
  const widths = [9, 7, 46.5, 13, 6, 10, 12, 9];
  return (
    <MQP.Wrapper>
      {makingWrongPaper && (
        <MakeWrongPaper
          closeModal={() => setMakingWrongPaper(false)}
          papers={papersToRender}
          studentName={studentInfo.name}
        />
      )}
      {previewPaper && <PDFViewer closeModal={() => setPreviewPaper(null)} paper={previewPaper} />};
      {scoringPaper && <ScorePaper closeModal={closeScoring} paper={scoringPaper} studentInfo={studentInfo} />}
      <MQP.FilterLine>
        <STATUSFILTER.FilterContainer>
          <STATUSFILTER.BtnContainer>
            {stateOptions.map((opt) => (
              <STATUSFILTER.DetailBtn
                key={opt}
                $isSelected={stateToSee === opt}
                $isAll={opt === `전체` || opt === `미제출` || opt === "제출"}
                value={opt}
                onClick={changeState}
              >
                {opt}
              </STATUSFILTER.DetailBtn>
            ))}
          </STATUSFILTER.BtnContainer>
        </STATUSFILTER.FilterContainer>
        <MQP.FilterBtn
          onClick={() => {
            setIsFilterModalOn((prev) => !prev);
          }}
        >
          <FontAwesomeIcon icon={faSliders} />
          {` 필터`}
        </MQP.FilterBtn>
        <MQP.SearchBox>
          <MQP.SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </MQP.SearchIcon>
          <MQP.SearchInput
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
            placeholder="학습지명 검색"
          />
          <MQP.XBtn
            onClick={() => {
              setSearchName("");
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </MQP.XBtn>
        </MQP.SearchBox>
        <MQP.CreateBtn onClick={() => setMakingWrongPaper(true)}>{`기간별 취약 유형 정리`}</MQP.CreateBtn>
      </MQP.FilterLine>
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
              <DATEFILTER.CategoryBtn onClick={setFiveYears}>5년</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneYear}>1년</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneMonth}>1달</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneWeek}>1주</DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn onClick={setOneDay}>1일</DATEFILTER.CategoryBtn>
            </DATEFILTER.ButtonContainer>
          </DATEFILTER.FilterLine>
          <DATEFILTER.FilterLine>
            <DATEFILTER.Label>학습지 유형</DATEFILTER.Label>
            <DATEFILTER.ButtonContainer>
              <DATEFILTER.CategoryBtn
                value={"단원유형별"}
                onClick={selectTag}
                $isSelected={questionTagSet.includes("단원유형별")}
              >
                단원유형별
              </DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn
                value={"시중교재"}
                onClick={selectTag}
                $isSelected={questionTagSet.includes("시중교재")}
              >
                시중교재
              </DATEFILTER.CategoryBtn>
              <DATEFILTER.CategoryBtn
                value={"모의고사"}
                onClick={selectTag}
                $isSelected={questionTagSet.includes("모의고사")}
              >
                모의고사
              </DATEFILTER.CategoryBtn>
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
                setFiveYears();
                setQuestionTagSet(["단원유형별", "시중교재", "모의고사"]);
              }}
            >
              <FontAwesomeIcon icon={faArrowRotateLeft} />
              {` 전체 초기화`}
            </DATEFILTER.ResetBtn>
          </DATEFILTER.SetContainer>
        </DATEFILTER.Modal>
      )}
      <MQP.ListHeader>
        {attributes.map((att, index) => (
          <MQP.AttributeBox key={index} $width={widths[index]} $isTitle={att === "학습지명"}>
            {att}
          </MQP.AttributeBox>
        ))}
      </MQP.ListHeader>
      <MQP.ListContainer $shorten={selectedPaperIds.length > 0}>
        {papersToRender.map((paper, index) => (
          <MQP.QuestionPaperLine key={index}>
            <MQP.CellBox
              $width={widths[0]}
              style={{ height: `6rem`, cursor: `pointer` }}
              onClick={() => {
                selectQuiz(paper.id);
              }}
            >
              <MQP.CheckBox $isChecked={paper.selected}>
                {1 === 1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
              </MQP.CheckBox>
            </MQP.CellBox>
            <MQP.CellBox $width={widths[1]}>고1</MQP.CellBox>
            <MQP.CellBox $width={widths[2]} $isTitle={true}>
              <MQP.PaperTitleLine>
                {cutLongText(paper.title, 23)}
                {paper.category === "MULTIPLE" && <MQP.AutoEvaluateBox>자동채점</MQP.AutoEvaluateBox>}
              </MQP.PaperTitleLine>
              <MQP.DescriptionText>{`${paper.questionNum}문제 | ${
                { LOW: ` 하 `, MEDIUM_LOW: `중하`, MEDIUM: ` 중 `, MEDIUM_HIGH: `중상`, HIGH: ` 상 ` }[paper.level]
              } | ${cutLongText(paper.boundary, 28)}`}</MQP.DescriptionText>
            </MQP.CellBox>
            <MQP.CellBox $width={widths[3]}>{formatDate(paper.createdAt)}</MQP.CellBox>
            <MQP.CellBox $width={widths[4]}>
              <MQP.InnerBtn
                $width={4}
                onClick={() => {
                  presentPapers(paper.originQuestionPaperId);
                }}
              >
                <FontAwesomeIcon icon={faRepeat} />
              </MQP.InnerBtn>
            </MQP.CellBox>
            <MQP.CellBox $width={widths[5]}>
              <MQP.InnerBtn $width={4} onClick={() => setPreviewPaper(paper)}>
                <FontAwesomeIcon icon={faFilePdf} />
              </MQP.InnerBtn>
            </MQP.CellBox>
            <MQP.CellBox $width={widths[6]}>
              <MQP.EvaluateBtn
                disabled={paper.assignStatus === "WAITING"}
                $graded={paper.assignStatus === "GRADED"}
                onClick={() => setScoringPaper(paper)}
              >
                {paper.assignStatus === "WAITING"
                  ? "미제출"
                  : paper.assignStatus === "COMPLETE"
                  ? "채점하기"
                  : paper.totalScore === 0
                  ? `0점`
                  : `${Math.floor((paper.score / paper.totalScore) * 100)}점`}
              </MQP.EvaluateBtn>
            </MQP.CellBox>
            <MQP.CellBox $width={widths[7]}>
              <MQP.MoreInfoBtn
                onClick={() => {
                  onLookMore(index);
                }}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </MQP.MoreInfoBtn>
              {index == lookMoreIndex && (
                <MQP.MoreInfo>
                  <MQP.MoreBtn
                    onClick={async () => {
                      await deleteQuetionPaper(paper.id);
                      getPaperAndAnswers(studentId);
                    }}
                  >
                    삭제
                  </MQP.MoreBtn>
                </MQP.MoreInfo>
              )}
            </MQP.CellBox>
          </MQP.QuestionPaperLine>
        ))}
      </MQP.ListContainer>
      {selectedPaperIds.length > 0 ? (
        <MQP.BottomLine>
          <MQP.BottomText>{`질문 ${selectedPaperIds.length}개 선택됨`}</MQP.BottomText>
          <MQP.BatchActionBtn
            onClick={() => {
              presentPapers();
            }}
          >
            <FontAwesomeIcon icon={faRepeat} style={{ marginBottom: "0.75rem" }} />
            재출제
          </MQP.BatchActionBtn>
          <MQP.BatchActionBtn>
            <FontAwesomeIcon icon={faCloudArrowDown} style={{ marginBottom: "0.75rem" }} />
            다운로드
          </MQP.BatchActionBtn>
          <MQP.BatchActionBtn
            onClick={async () => {
              await deleteAll();
              await getPaperAndAnswers(studentId);
            }}
          >
            <FontAwesomeIcon icon={faCircleMinus} style={{ marginBottom: "0.75rem" }} />
            출제 취소
          </MQP.BatchActionBtn>
          <MQP.DeselectBtn onClick={deselectAll}>
            <FontAwesomeIcon icon={faXmark} />
          </MQP.DeselectBtn>
        </MQP.BottomLine>
      ) : null}
    </MQP.Wrapper>
  );
};

export default ClassQuestionPaper;

const MQP = {
  Wrapper: styled.div`
    width: 113.5rem;
    height: 80rem;
    border-radius: 1rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding-top: 1.5rem;
    overflow: hidden;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  FilterLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
  `,
  FilterBtn: styled.button`
    width: 9rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    background-color: ${({ $isFiltering, theme }) => theme.colors.gray10};
    color: ${({ $isFiltering, theme }) => theme.colors.gray60};
    margin-left: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
  `,
  SearchBox: styled.div`
    width: 25rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    display: flex;
    flex-direction: row;
    font-size: 1.5rem;
    font-weight: 500;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    overflow: hidden;
    margin-left: auto;
    margin-right: 1rem;
  `,
  SearchIcon: styled.div`
    width: 4.5rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-top: -0.1rem;
    color: ${({ theme }) => theme.colors.gray50};
  `,
  SearchInput: styled.input`
    width: 18rem;
    height: 4.5rem;
    margin-top: -0.1rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    outline: none;
  `,
  XBtn: styled.button`
    width: 4.5rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-top: -0.1rem;
    color: ${({ theme }) => theme.colors.gray50};
  `,
  CreateBtn: styled.button`
    width: 22rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
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
    padding-left: ${({ $isTitle }) => ($isTitle ? `3rem` : `0rem`)};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: ${({ $shorten }) => (!$shorten ? `68.5rem` : `60.5rem`)};
    overflow-y: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
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
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : theme.colors.unselected)} solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
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
  DescriptionText: styled.span`
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0.5rem;
  `,
  TagBox: styled.div`
    width: 7rem;
    height: 3rem;
    border-radius: 0.6rem;
    background-color: ${({ $tag, theme }) =>
      $tag === "모의고사" ? theme.colors.warning : $tag === "시중교재" ? theme.colors.mainColor : theme.colors.gray40};
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  AnswerLine: styled.div`
    margin-top: 1rem;
  `,
  AnswerLabel: styled.span`
    color: ${({ theme }) => theme.colors.subText};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  AnswerText: styled.span`
    font-size: 1.4rem;
    font-weight: 600;
  `,
  InnerBtn: styled.button`
    width: ${({ $width }) => `${$width}rem`};
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  EvaluateBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ $graded, theme }) => ($graded ? theme.colors.gray00 : theme.colors.mainColor)};
    color: ${({ $graded }) => ($graded ? `black` : `white`)};
    border: solid ${({ $graded, theme }) => ($graded ? `0.1rem ${theme.colors.gray30}` : `0rem`)};
    font-size: 1.5rem;
    font-weight: 600;
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray05};
      border: 0.1rem ${({ theme }) => theme.colors.gray15} solid;
      color: ${({ theme }) => theme.colors.gray60};
      cursor: default;
    }
  `,
  OXbox: styled.div`
    font-size: 3rem;
    color: ${({ $isCorrect, theme }) => ($isCorrect ? theme.colors.mainColor : theme.colors.warning)};
  `,
  MoreInfoBtn: styled.button`
    width: 4rem;
    height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  MoreInfo: styled.div`
    position: sticky;
    padding: 0.5rem;
    background-color: white;
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    border-radius: 0.6rem;
    z-index: 5; /* Ensure the dropdown is above other elements */
    box-shadow: 0rem 0rem 1rem rgba(0, 0, 0, 0.3);
    margin-right: 12rem;
    margin-top: -4.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  MoreBtn: styled.button`
    width: 9rem;
    height: 3rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  BottomLine: styled.div`
    width: 113.5rem;
    height: 7rem;
    margin-top: 1rem;
    background-color: ${({ theme }) => theme.colors.gray50};
    display: flex;
    align-items: center;
    flex-direction: row;
    padding-left: 3rem;
    padding-right: 2rem;
  `,
  BottomText: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
    color: white;
    margin-right: auto;
  `,
  BatchActionBtn: styled.div`
    margin-left: 1rem;
    width: 8rem;
    height: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: 400;
  `,
  DeselectBtn: styled.button`
    width: 6rem;
    height: 6rem;
    margin-left: 1rem;
    font-size: 2rem;
    color: white;
    cursor: pointer;
  `,
};

const STATUSFILTER = {
  FilterContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
    height: 4rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
  `,
  BtnContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  DetailBtn: styled.button`
    width: 6.25rem;
    height: 4.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.2rem ${theme.colors.mainColor}` : `0.05rem ${theme.colors.unselected}`};
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
