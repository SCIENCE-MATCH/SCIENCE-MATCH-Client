import { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCirclePlus,
  faEllipsisVertical,
  faSearch,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import CreateQuiz from "./CreateQuiz";
import PreviewQuiz from "./PreviewQuiz";
import PresentQuiz from "./PresentQuiz";
import useTeacherGetQuiz from "../../../../libs/apis/Teacher/Prepare/postGetQuizs";

const PrepareOneOnOneQuiz = () => {
  const { originalQuizs, getQuizs } = useTeacherGetQuiz();
  const [isCreating, setIsCreating] = useState(false);

  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const [receivedQuizs, setReceivedQuizs] = useState([]);
  const [lookMoreIndex, setLookMoreIndex] = useState(-1);
  const onLookMore = (index) => {
    if (lookMoreIndex == index) setLookMoreIndex(-1);
    else setLookMoreIndex(index);
  };
  const [searchName, setSearchName] = useState("");
  const [quizsToRender, setQuizsToRender] = useState([]);

  const [previewText, setPreviewText] = useState("");
  const [previewQuiz, setPreviewQuiz] = useState("");

  const [isPreviewing, setIsPreviewing] = useState(false);
  const openPreview = (quiz) => {
    setPreviewQuiz(quiz);
    setIsPreviewing(true);
  };
  const closePreview = () => {
    setIsPreviewing(false);
    setPreviewQuiz("");
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

  const [school, setSchool] = useState("초");
  const [grade, setGrade] = useState(3);
  const [semester, setSemester] = useState(1);
  const schoolOptions = ["초", "중", "고"];
  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const grades = { 초: [3, 4, 5, 6], 중: [1, 2, 3], 고: [1, "물리", "화학", "생명", "지구"] };
  const changeGrade = (opt) => {
    setGrade(opt);
  };
  const changeSemester = (opt) => {
    setSemester(opt);
  };

  const goToCreate = () => {
    setIsCreating(true);
  };
  const comeBackToList = () => {
    setIsCreating(false);
    getQuizs();
  };

  const changeSchool = (e) => {
    const newValue = e.target.value;
    setSchool(newValue);
    if (newValue === "초") setGrade(3);
    else setGrade(1);
  };

  useEffect(() => {
    getQuizs(school);
  }, [school]);

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

  const cutLongText = (text, cutLength) => {
    if (text.length > cutLength) return text.slice(0, cutLength) + "...";
    else return text;
  };
  useEffect(() => {
    setReceivedQuizs(originalQuizs);
  }, [originalQuizs]);
  useEffect(() => {
    const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
    const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
    const semToEng = ["FIRST1", "SECOND1"];
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${semToEng[semester - 1]}`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }
    const filteredArr = receivedQuizs.filter((quiz) => {
      return (
        (quiz.school === schoolToSend[school] || school === "전체") &&
        (quiz.question.includes(searchName) || quiz.makerName.includes(searchName)) &&
        quiz.semester === sem &&
        quiz.subject === sub
      );
    });
    setQuizsToRender(filteredArr);
  }, [receivedQuizs, school, searchName, semester, grade]);

  const attributes = ["선택", "학년", "질문 내용", "출제자", "상세보기", "출제", "더보기"];

  const widths = [9, 9, 60, 15, 15, 15, 10];
  return (
    <OO.Wrapper>
      {isPreviewing && <PreviewQuiz closeModal={closePreview} previewQuiz={previewQuiz} />}
      {isPresenting && <PresentQuiz closeModal={closePresent} questionText={previewText} quizId={[presentId]} />}
      {isPresentingMany && <PresentQuiz closeModal={closePresentMany} quizId={selectedQuizIds} />}
      {isCreating ? (
        <CreateQuiz goBack={comeBackToList} deliveredList={originalQuizs} getQuizs={getQuizs} />
      ) : (
        <OO.ManageSection>
          <OO.FilterLine>
            <SCHOOLSEM.SchoolOptionContainer>
              <SCHOOLSEM.BtnContainer>
                {schoolOptions.map((opt) => (
                  <SCHOOLSEM.RoundBtn key={opt} $isSelected={school === opt} value={opt} onClick={changeSchool}>
                    {opt}
                  </SCHOOLSEM.RoundBtn>
                ))}
              </SCHOOLSEM.BtnContainer>
            </SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.SemsterOptionContainer>
              {grades[school].map((opt, index) => (
                <SCHOOLSEM.RoundBtn
                  key={index}
                  $isSelected={grade === opt}
                  value={opt}
                  onClick={() => {
                    changeGrade(opt);
                  }}
                >
                  {opt}
                </SCHOOLSEM.RoundBtn>
              ))}
              <SCHOOLSEM.SemesterContainer>
                <SCHOOLSEM.RoundBtn $isSelected={semester === 1} onClick={() => changeSemester(1)}>
                  1
                </SCHOOLSEM.RoundBtn>
                <SCHOOLSEM.RoundBtn $isSelected={semester === 2} onClick={() => changeSemester(2)}>
                  2
                </SCHOOLSEM.RoundBtn>
              </SCHOOLSEM.SemesterContainer>
            </SCHOOLSEM.SemsterOptionContainer>
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
          <OO.ListHeader>
            {attributes.map((att, index) => (
              <OO.AttributeBox key={index} $width={widths[index]} $isTitle={att === "질문 내용"}>
                {att}
              </OO.AttributeBox>
            ))}
          </OO.ListHeader>
          <OO.ListContainer $shorten={selectedQuizIds.length > 0}>
            {quizsToRender.length === 0 && (
              <OO.QuestionPaperLine>
                <OO.CellBox $width={133.5}>조회된 1:1 질문이 없습니다.</OO.CellBox>
              </OO.QuestionPaperLine>
            )}
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
                <OO.CellBox $width={widths[3]}>{quiz.makerName}</OO.CellBox>
                <OO.CellBox $width={widths[4]}>
                  <OO.InnerBtn
                    $width={4}
                    onClick={() => {
                      openPreview(quiz);
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
                      <OO.MoreBtn onClick={async () => {}}>미정</OO.MoreBtn>
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
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  ManageSection: styled.div`
    width: 135rem;
    min-width: 135rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
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
  RowContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 50rem;
    height: 6rem;
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
  `,
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    height: 4rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,
  BtnContainer: styled.div`
    width: 18.5rem;
    margin-left: 1rem;
    display: flex;
    align-items: center;
    flex-direction: row;
  `,
  SemsterOptionContainer: styled.div`
    width: 45.6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 1.5rem;
  `,
  SemesterContainer: styled.div`
    margin-left: auto;
    border-left: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    padding-left: 1.5rem;
  `,
  RoundBtn: styled.button`
    width: 5rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    margin-right: 1rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray50)};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem ${theme.colors.unselected}`};
  `,
};
