import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCirclePlus,
  faEllipsisVertical,
  faSearch,
  faSliders,
  faTrash,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
import CreateQuiz from "./CreateQuiz";
import PreviewQuiz from "./PreviewQuiz";
import PresentQuiz from "./PresentQuiz";
import useDeleteQuiz from "../../../../libs/apis/Teacher/Prepare/deleteQuiz";

const PrepareOneOnOneQuiz = () => {
  const { deleteQuiz } = useDeleteQuiz();
  const [isCreating, setIsCreating] = useState(false);

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
  const oneDayMore = (date) => {
    const nextDate = new Date(date);
    nextDate.setDate(today.getDate() + 1);
    return nextDate;
  };
  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const [dateFrom, setDateFrom] = useState(modifyDateToStartOfDay(fiveYearsAgo));
  const [dateTo, setDateTo] = useState(modifyDateToEndOfDay(today));

  const [school, setSchool] = useState("전체");
  const [isFilterModalOn, setIsFilterModalOn] = useState(false);

  const [receivedQuizs, setReceivedQuizs] = useState([]);
  const [lookMoreIndex, setLookMoreIndex] = useState(-1);
  const onLookMore = (index) => {
    if (lookMoreIndex == index) setLookMoreIndex(-1);
    else setLookMoreIndex(index);
  };
  const [searchName, setSearchName] = useState("");
  const [quizsToRender, setQuizsToRender] = useState([]);

  const [previewText, setPreviewText] = useState("");

  const [isPreviewing, setIsPreviewing] = useState(false);
  const openPreview = (text) => {
    setIsPreviewing(true);
    setPreviewText(text);
  };
  const closePreview = () => {
    setIsPreviewing(false);
    setPreviewText("");
  };
  const [presentId, setPresentId] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isPresentingMany, setIsPresentingMany] = useState(false);
  const openPresent = (text, id) => {
    setIsPresenting(true);
    setPresentId(id);
    setPreviewText(cutLongText(text, 35));
  };
  const closePresent = () => {
    setIsPresenting(false);
    setPresentId(0);
    setPreviewText("");
  };
  const openPresentMany = () => {
    setIsPresentingMany(true);
  };
  const closePresentMany = () => {
    setIsPresentingMany(false);
    deselectAll();
  };

  const schoolOptions = ["전체", "초", "중", "고"];
  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };

  const goToCreate = () => {
    setIsCreating(true);
  };
  const comeBackToList = () => {
    setIsCreating(false);
    getQuizs();
  };

  const changeSchool = (e) => {
    setSchool(e.target.value);
  };

  const gradeToKr = { FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5, SIXTH: 6 };
  const subjectToKr = { SCIENCE: "고", PHYSICS: "물", BIOLOGY: "생", CHEMISTRY: "화", EARTH_SCIENCE: "지" };
  const shortenGrade = (school, subject, semester) => {
    switch (school) {
      case "ELEMENTARY":
        return `초${gradeToKr[semester.slice(0, -1)]}`;
      case "MIDDLE":
        return `중${gradeToKr[semester.slice(0, -1)]}`;
      case "HIGH":
        return `${subjectToKr[subject]}${gradeToKr[semester.slice(0, -1)]}`;
      default:
        return "오류";
    }
  };

  const getQuizs = async () => {
    let schoolSet = [school];
    if (school === "전체") schoolSet = ["초", "중", "고"];

    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/paper-test";

      const promises = schoolSet.map((schoolType) =>
        Axios.post(
          url,
          {
            school: schoolToSend[schoolType],
            start: dateFrom,
            end: oneDayMore(dateTo),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );

      const responses = await Promise.all(promises);

      // 각 응답에 대한 추가 작업을 여기서 수행할 수 있습니다.
      let tempQuizs = [];
      responses.forEach((response) => {
        response.data.data.map((quiz) => {
          tempQuizs.push({ ...quiz, grade: shortenGrade(quiz.school, quiz.subject, quiz.semester), selected: false });
        });
      });
      tempQuizs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setReceivedQuizs(tempQuizs);
    } catch (error) {
      // API 요청이 실패한 경우
      alert("질문지를 불러오지 못했습니다.");
      console.error("API 요청 실패:", error.response?.data?.code, error.response?.data?.message);
      if (error.response?.data?.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
    setLookMoreIndex(-1);
  };
  useEffect(() => {
    getQuizs();
  }, []);

  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const selectQuiz = (id) => {
    let tempQuizs = [...receivedQuizs];
    tempQuizs.map((quiz) => {
      if (quiz.id === id) quiz.selected = !quiz.selected;
    });
    setReceivedQuizs(tempQuizs);

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
    let tempQuizs = [...receivedQuizs];
    tempQuizs.map((quiz) => {
      quiz.selected = false;
    });
    setReceivedQuizs(tempQuizs);
    setSelectedQuizIds([]);
  };
  const deleteAll = async () => {
    await selectedQuizIds.map((qId) => {
      deleteQuiz(qId);
    });
    alert(`질문 ${selectedQuizIds.length}개가 삭제 되었습니다.`);
    deselectAll();
    getQuizs();
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
    const filteredArr = receivedQuizs.filter((quiz) => {
      const quizDate = new Date(quiz.createdAt);
      return (
        (quiz.school === schoolToSend[school] || school === "전체") &&
        quiz.question.includes(searchName) /*|| quiz.makerName.includes(searchName)*/ &&
        dateFrom < quizDate &&
        quizDate < dateTo
      );
    });
    setQuizsToRender(filteredArr);
  }, [receivedQuizs, school, searchName, dateFrom, dateTo]);

  const attributes = ["선택", "학년", "질문 내용", "생성일", "상세보기", "출제", "더보기"];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 일
    return `${year}.${month}.${day}`;
  };
  const widths = [9, 9, 60, 15, 15, 15, 10];
  return (
    <OO.Wrapper>
      {isPreviewing && <PreviewQuiz closeModal={closePreview} questionText={previewText} />}
      {isPresenting && <PresentQuiz closeModal={closePresent} questionText={previewText} quizId={[presentId]} />}
      {isPresentingMany && <PresentQuiz closeModal={closePresentMany} quizId={selectedQuizIds} />}
      {isCreating ? (
        <CreateQuiz goBack={comeBackToList} deliveredList={receivedQuizs} getQuizs={getQuizs} />
      ) : (
        <OO.ManageSection>
          <OO.FilterLine>
            <SCHOOLSEM.SchoolOptionContainer>
              <SCHOOLSEM.BtnContainer>
                {schoolOptions.map((opt) => (
                  <SCHOOLSEM.DetailBtn
                    key={opt}
                    $isSelected={school === opt}
                    $isAll={opt === `전체`}
                    value={opt}
                    onClick={changeSchool}
                  >
                    {opt}
                  </SCHOOLSEM.DetailBtn>
                ))}
              </SCHOOLSEM.BtnContainer>
            </SCHOOLSEM.SchoolOptionContainer>
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
                placeholder="질문 내용, 출제자 검색"
              />
              <OO.XBtn
                onClick={() => {
                  setSearchName("");
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </OO.XBtn>
            </OO.SearchBox>
            <OO.CreateBtn onClick={goToCreate}>
              <FontAwesomeIcon icon={faCirclePlus} />
              {` 1:1질문 만들기`}
            </OO.CreateBtn>
          </OO.FilterLine>
          {isFilterModalOn && (
            <FILTER.Modal>
              <FILTER.Title>검색 날짜</FILTER.Title>
              <FILTER.FilterLine>
                <FILTER.Label>학습지 생성 기간</FILTER.Label>
                <FILTER.DateInput
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
                <FILTER.DateInput
                  selected={dateTo}
                  onChange={(date) => {
                    setDateTo(modifyDateToEndOfDay(date));
                    if (date < dateFrom) setDateFrom(modifyDateToStartOfDay(date));
                  }}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="Select a date"
                  locale={ko} // locale 설정
                />
              </FILTER.FilterLine>
              <FILTER.FilterLine>
                <FILTER.Label>빠른 선택</FILTER.Label>
                <FILTER.ButtonContainer>
                  <FILTER.CategoryBtn onClick={setFiveYears}>5년</FILTER.CategoryBtn>
                  <FILTER.CategoryBtn onClick={setOneYear}>1년</FILTER.CategoryBtn>
                  <FILTER.CategoryBtn onClick={setOneMonth}>1달</FILTER.CategoryBtn>
                  <FILTER.CategoryBtn onClick={setOneWeek}>1주</FILTER.CategoryBtn>
                  <FILTER.CategoryBtn onClick={setOneDay}>1일</FILTER.CategoryBtn>
                </FILTER.ButtonContainer>
              </FILTER.FilterLine>
              <FILTER.SetContainer>
                <FILTER.CloseBtn
                  onClick={() => {
                    setIsFilterModalOn(false);
                  }}
                >
                  닫기
                </FILTER.CloseBtn>
              </FILTER.SetContainer>
            </FILTER.Modal>
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
                  <OO.CheckBox $isChecked={quiz.selected}>
                    {1 === 1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                  </OO.CheckBox>
                </OO.CellBox>
                <OO.CellBox $width={widths[1]}>{quiz.grade}</OO.CellBox>
                <OO.CellBox $width={widths[2]} $isTitle={true}>
                  {cutLongText(quiz.question, 40)}
                  <OO.DescriptionText>{`${quiz.chapterDescription}`}</OO.DescriptionText>
                </OO.CellBox>
                <OO.CellBox $width={widths[3]}>{formatDate(quiz.createdAt)}</OO.CellBox>
                <OO.CellBox $width={widths[4]}>
                  <OO.InnerBtn
                    $width={4}
                    onClick={() => {
                      openPreview(quiz.question);
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </OO.InnerBtn>
                </OO.CellBox>
                <OO.CellBox $width={widths[5]}>
                  <OO.InnerBtn
                    $width={10}
                    onClick={() => {
                      openPresent(quiz.question, quiz.id);
                    }}
                  >
                    출제하기
                  </OO.InnerBtn>
                </OO.CellBox>
                <OO.CellBox $width={widths[6]}>
                  <OO.MoreInfoBtn
                    onClick={() => {
                      onLookMore(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </OO.MoreInfoBtn>
                  {index == lookMoreIndex && (
                    <OO.MoreInfo>
                      <OO.MoreBtn
                        onClick={async () => {
                          await deleteQuiz(quiz.id);
                          getQuizs();
                        }}
                      >
                        삭제
                      </OO.MoreBtn>
                    </OO.MoreInfo>
                  )}
                </OO.CellBox>
              </OO.QuestionPaperLine>
            ))}
          </OO.ListContainer>

          {selectedQuizIds.length > 0 ? (
            <OO.BottomLine>
              <OO.BottomText>{`질문 ${selectedQuizIds.length}개 선택됨`}</OO.BottomText>
              <OO.BatchActionBtn onClick={openPresentMany}>
                <FontAwesomeIcon icon={faUsers} style={{ marginBottom: "0.75rem" }} />
                일괄출제
              </OO.BatchActionBtn>
              <OO.BatchActionBtn onClick={deleteAll}>
                <FontAwesomeIcon icon={faTrash} style={{ marginBottom: "0.75rem" }} />
                전부삭제
              </OO.BatchActionBtn>
              <OO.DeselectBtn onClick={deselectAll}>
                <FontAwesomeIcon icon={faXmark} />
              </OO.DeselectBtn>
            </OO.BottomLine>
          ) : null}
        </OO.ManageSection>
      )}
    </OO.Wrapper>
  );
};

export default PrepareOneOnOneQuiz;

const OO = {
  Wrapper: styled.div`
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: auto; /*standard: 1400*/
    height: 80rem;
    margin-top: 2rem;
  `,
  ManageSection: styled.div`
    width: 135rem;
    min-width: 135rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    padding-top: 1.5rem;
    border: 0.05rem solid ${({ theme }) => theme.colors.gray20};
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
    background-color: ${({ $isFiltering, theme }) => theme.colors.gray05};
    color: ${({ $isFiltering, theme }) => theme.colors.gray70};
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `4rem` : "2rem")};
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `4rem` : "2rem")};
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
  DescriptionText: styled.span`
    color: brown;
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0.5rem;
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
    width: 135rem;
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

const SCHOOLSEM = {
  SchoolOptionContainer: styled.div`
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
    width: ${({ $isAll }) => ($isAll ? `6rem` : `4.5rem`)};
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

const FILTER = {
  Modal: styled.div`
    position: absolute;

    z-index: 1000; /* Ensure the dropdown is above other elements */
    margin-left: 27rem;
    margin-top: 6rem;
    background: white;
    border: 0.02rem solid ${({ theme }) => theme.colors.brightGray};
    border-radius: 0.5rem;
    box-shadow: 0rem 1.5rem 2rem rgba(0, 0, 0, 0.3);
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
