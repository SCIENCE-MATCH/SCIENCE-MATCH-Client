import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleMinus,
  faEllipsisVertical,
  faO,
  faSearch,
  faSliders,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
import ScoreQuiz from "./ScoreQuiz";

const OneOnOneQuiz = ({ studentId }) => {
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

  const [receivedQuizs, setReceivedQuizs] = useState([]);
  const [quizsWithAnswer, setQuizsWithAnswer] = useState([]);
  const [lookMoreIndex, setLookMoreIndex] = useState(-1);
  const onLookMore = (index) => {
    if (lookMoreIndex == index) setLookMoreIndex(-1);
    else setLookMoreIndex(index);
  };
  const [searchName, setSearchName] = useState("");
  const [quizsToRender, setQuizsToRender] = useState([]);

  const [stateToSee, setStateToSee] = useState("전체");
  const stateOptions = ["전체", "제출", "미제출", "O", "X"];

  const changeState = (e) => {
    setStateToSee(e.target.value);
  };
  const [evaluateArray, setEvaluateArray] = useState({
    question: "",
    submitAnswer: "",
    solution: "",
    rightAnswer: false,
  });

  const [isPreviewing, setIsPreviewing] = useState(false);
  const openPreview = (quiz) => {
    setIsPreviewing(true);
    setEvaluateArray({
      answerId: quiz.answerId,
      question: quiz.question,
      submitAnswer: quiz.submitAnswer,
      solution: quiz.solution,
      rightAnswer: quiz.rightAnswer,
    });
  };
  const closePreview = () => {
    setIsPreviewing(false);
    setEvaluateArray({
      answerId: 0,
      question: "",
      submitAnswer: "",
      solution: "",
      rightAnswer: false,
    });
    if (studentId) getQuizs();
  };

  const getQuizs = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/assign-paper-test/${studentId}`;

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const tempQuizs = response.data.data;
      tempQuizs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

      setReceivedQuizs(response.data.data);
    } catch (error) {
      alert("학생 정보를 불러오지 못했습니다.");
      console.error("API 요청 실패:", error.response?.data?.code, error.response?.data?.message);
      if (error.response?.data?.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };
  useEffect(() => {
    if (studentId) getQuizs();
  }, [studentId]);

  const getAnswerForOne = async () => {
    const accessToken = getCookie("aToken");

    // "COMPLETE" 상태가 아닌 퀴즈들을 미리 null 값으로 설정
    const updatedQuizs = receivedQuizs.map((quiz) => {
      if (quiz.assignStatus !== "COMPLETE") {
        return {
          ...quiz,
          answerId: null,
          submitAnswer: null,
          solution: null,
          rightAnswer: null,
          selected: false,
        };
      }
      return quiz;
    });

    // "COMPLETE" 상태인 퀴즈들만 필터링하여 요청 생성
    const promises = updatedQuizs.map((quiz) => {
      if (quiz.assignStatus === "COMPLETE") {
        return Axios.get(`https://www.science-match.p-e.kr/teacher/assign-paper-test/${quiz.id}/complete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => ({
            ...quiz,
            answerId: response.data.data.id,
            submitAnswer: response.data.data.submitAnswer,
            solution: response.data.data.solution,
            rightAnswer: response.data.data.rightAnswer,
            selected: false,
          }))
          .catch((error) => {
            console.error(`Error fetching data for quiz ${quiz.id}`, error);
            throw error; // 다른 종류의 에러는 다시 던짐
          });
      } else {
        // "COMPLETE" 상태가 아닌 퀴즈는 이미 null 값이 설정되어 있으므로 그냥 반환
        return Promise.resolve(quiz);
      }
    });

    try {
      const results = await Promise.all(promises);
      setQuizsWithAnswer(results);
    } catch (error) {
      console.error("Failed to fetch quiz answers:", error);
      setQuizsWithAnswer(updatedQuizs); // 에러 발생 시 원본 리스트 반환
    }
  };

  useEffect(() => {
    getAnswerForOne();
  }, [receivedQuizs]);

  const deleteQuiz = async (quizId) => {
    console.log(`다음의 질문을 삭제합니다 ${quizId}`);
  };

  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const selectQuiz = (id) => {
    let tempQuizs = [...quizsWithAnswer];
    tempQuizs.map((quiz) => {
      if (quiz.id === id) quiz.selected = !quiz.selected;
    });
    setQuizsWithAnswer(tempQuizs);

    let tempArr = [...selectedQuizIds];
    const index = tempArr.indexOf(id);

    if (index === -1) {
      // 배열에 요소가 없으면 추가
      tempArr.push(id);
    } else {
      // 배열에 요소가 있으면 제거
      tempArr.splice(index, 1);
    }
    setSelectedQuizIds(tempArr);
  };
  const deselectAll = () => {
    let tempQuizs = [...quizsWithAnswer];
    tempQuizs.map((quiz) => {
      quiz.selected = false;
    });
    setQuizsWithAnswer(tempQuizs);
    setSelectedQuizIds([]);
  };
  const deleteAll = () => {
    selectedQuizIds.map((qId) => {
      deleteQuiz(qId);
    });
    alert(`질문 ${selectedQuizIds.length}개가 삭제 되었습니다.`);
    deselectAll();
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
    let status = "COMPLETE";
    let score = null;
    switch (stateToSee) {
      case "전체":
        status = "";
        break;
      case "제출":
        break;
      case "미제출":
        status = "WAITING";
        break;
      case "O":
        score = true;
        break;
      case "X":
        score = false;
        break;
      default:
        break;
    }
    if (quizsWithAnswer.length > 0) {
      const filteredArr = quizsWithAnswer.filter((quiz) => {
        const quizDate = new Date(quiz.createdAt);
        return (
          quiz.question.includes(searchName) /*|| quiz.makerName.includes(searchName)*/ &&
          (status === "COMPLETE" && score !== null ? quiz.rightAnswer === score : quiz.assignStatus.includes(status)) &&
          dateFrom < quizDate &&
          quizDate < dateTo
        );
      });
      setQuizsToRender(filteredArr);
    } else {
      setQuizsToRender([]);
    }
  }, [quizsWithAnswer, searchName, dateFrom, dateTo, stateToSee]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 일
    return `${year}.${month}.${day}`;
  };
  const attributes = ["선택", "질문 내용", "출제일", "결과", "다시 채점", "더보기"];
  const widths = [9, 58.5, 12, 12, 12, 9];
  return (
    <OO.Wrapper>
      {isPreviewing && <ScoreQuiz closeModal={closePreview} evaluateArray={evaluateArray} />}
      <OO.FilterLine>
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
        <OO.FilterBtn
          onClick={() => {
            setIsFilterModalOn((prev) => !prev);
          }}
        >
          <FontAwesomeIcon icon={faSliders} />
          {` 날짜`}
        </OO.FilterBtn>
        <OO.SearchBox>
          <OO.SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </OO.SearchIcon>
          <OO.SearchInput
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
            placeholder="질문 내용 검색"
          />
          <OO.XBtn
            onClick={() => {
              setSearchName("");
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </OO.XBtn>
        </OO.SearchBox>
      </OO.FilterLine>
      {isFilterModalOn && (
        <DATEFILTER.Modal>
          <DATEFILTER.Title>검색 날짜</DATEFILTER.Title>
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
          <DATEFILTER.SetContainer>
            <DATEFILTER.CloseBtn
              onClick={() => {
                setIsFilterModalOn(false);
              }}
            >
              닫기
            </DATEFILTER.CloseBtn>
          </DATEFILTER.SetContainer>
        </DATEFILTER.Modal>
      )}
      <OO.ListHeader>
        {attributes.map((att, index) => (
          <OO.AttributeBox key={index} $width={widths[index]} $isTitle={att === "질문 내용"}>
            {att}
          </OO.AttributeBox>
        ))}
      </OO.ListHeader>
      <OO.ListContainer $shorten={selectedQuizIds.length > 0}>
        {quizsToRender.map((quiz, index) => (
          <OO.QuestionPaperLine key={index}>
            <OO.CellBox
              $width={widths[0]}
              style={{ height: `6rem`, cursor: `pointer` }}
              onClick={() => {
                selectQuiz(quiz.id);
              }}
            >
              <OO.CheckBox $isChecked={quiz.selected}>{1 === 1 ? <FontAwesomeIcon icon={faCheck} /> : ""}</OO.CheckBox>
            </OO.CellBox>
            <OO.CellBox $width={widths[1]} $isTitle={true}>
              {cutLongText(quiz.question, 35)}
              <OO.AnswerLine>
                <OO.AnswerLabel>응답 | </OO.AnswerLabel>
                <OO.AnswerText>{quiz.submitAnswer}</OO.AnswerText>
              </OO.AnswerLine>{" "}
            </OO.CellBox>
            <OO.CellBox $width={widths[2]}>{formatDate(quiz.createdAt)}</OO.CellBox>
            <OO.CellBox $width={widths[3]}>
              {quiz.assignStatus === "COMPLETE" ? (
                <OO.OXbox $isCorrect={quiz.rightAnswer}>
                  {quiz.rightAnswer ? <FontAwesomeIcon icon={faO} /> : <FontAwesomeIcon icon={faXmark} />}
                </OO.OXbox>
              ) : (
                `미제출`
              )}
            </OO.CellBox>
            <OO.CellBox $width={widths[4]}>
              {quiz.assignStatus === "COMPLETE" ? (
                <OO.InnerBtn
                  $width={10}
                  onClick={() => {
                    openPreview(quiz);
                  }}
                >
                  다시 채점
                </OO.InnerBtn>
              ) : null}
            </OO.CellBox>
            <OO.CellBox $width={widths[5]}>
              <OO.MoreInfoBtn
                onClick={() => {
                  onLookMore(index);
                }}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </OO.MoreInfoBtn>
              {/* {index == lookMoreIndex && (
                <OO.MoreInfo>
                  <OO.MoreBtn
                    onClick={() => {
                      deleteQuiz(quiz.id);
                    }}
                  >
                    삭제
                  </OO.MoreBtn>
                </OO.MoreInfo>
              )} */}
            </OO.CellBox>
          </OO.QuestionPaperLine>
        ))}
      </OO.ListContainer>
      {selectedQuizIds.length > 0 ? (
        <OO.BottomLine>
          <OO.BottomText>{`질문 ${selectedQuizIds.length}개 선택됨`}</OO.BottomText>
          <OO.BatchActionBtn onClick={deleteAll}>
            <FontAwesomeIcon icon={faCircleMinus} style={{ marginBottom: "0.75rem" }} />
            출제 취소
          </OO.BatchActionBtn>
          <OO.DeselectBtn onClick={deselectAll}>
            <FontAwesomeIcon icon={faXmark} />
          </OO.DeselectBtn>
        </OO.BottomLine>
      ) : null}
    </OO.Wrapper>
  );
};

export default OneOnOneQuiz;

const OO = {
  Wrapper: styled.div`
    width: 113.5rem;
    height: 80rem;
    border-radius: 1rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding-top: 1.5rem;
    overflow: hidden;
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
    width: 30rem;
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
    width: 23rem;
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
    width: 17.5rem;
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
    padding-inline: 1rem;
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
    padding-inline: 1rem;
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
    width: ${({ $isAll }) => ($isAll ? `6.25rem` : `4.5rem`)};
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
    margin-left: 36.3rem;
    margin-top: 6rem;
    background: white;
    border: 0.02rem solid ${({ theme }) => theme.colors.brightGray};
    border-radius: 0.5rem;
    box-shadow: 0rem 1rem 2rem rgba(0, 0, 0, 0.3);
    width: 50rem;
    height: 23.5rem;
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
  `,
  CategoryBtn: styled.button`
    height: 4rem;
    border-radius: 4rem;
    margin: 0.75rem;
    padding-inline: 1rem;
    border: 0.01rem solid ${({ theme }) => theme.colors.unselected};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  SetContainer: styled.div`
    height: 4rem;
    width: 50rem;
    display: flex;
    flex-direction: row;
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
  SaveBtn: styled.button`
    margin-left: auto;
    margin-right: 0.5rem;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.mainColor};
  `,
};
