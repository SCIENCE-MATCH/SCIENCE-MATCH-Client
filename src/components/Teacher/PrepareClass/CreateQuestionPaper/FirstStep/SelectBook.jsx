import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faSearch,
  faXmark,
  faCheck,
  faCircleExclamation,
  faCaretDown,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import useGetBooks from "../../../../../libs/hooks/Teacher/Management/useGetBooks";
import useGetBookChaper from "../../../../../libs/hooks/Teacher/Management/useGetBookChapter";
import useGetBookQuestion from "../../../../../libs/hooks/Teacher/Management/useGetBookQuestion";

const SelectBook = ({
  selectedBook,
  setSelectedBook,
  localBookChapters,
  setLocalBookChapters,
  selectedQuestions,
  setSelectedQuestions,
  setSelectedChapters,
  setPaperGrade,
}) => {
  const { books, getBooks } = useGetBooks();
  const { bookChapters, getBookChapters } = useGetBookChaper();
  const { bookQuestions, getBookQuestion } = useGetBookQuestion();
  const [booksToRender, setBooksToRender] = useState([]);

  const [school, setSchool] = useState("초");
  const [grade, setGrade] = useState(3);
  const [searchName, setSearchName] = useState("");
  const schoolOptions = ["초", "중", "고"];
  const grades = { 초: [3, 4, 5, 6], 중: [1, 2, 3], 고: [1, "물리", "화학", "생명", "지구"] };

  const changeGrade = (opt) => {
    setGrade(opt);
  };
  const changeSchool = (e) => {
    const newValue = e.target.value;
    setSchool(newValue);
    if (newValue === "초") setGrade(3);
    else setGrade(1);
  };
  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const numToEng = {
    1: "FIRST",
    2: "SECOND",
    3: "THIRD",
    4: "FOURTH",
    5: "FIFTH",
    6: "SIXTH",
    물리: "SECOND",
    화학: "THIRD",
    생명: "FOURTH",
    지구: "FIFTH",
  };

  const getKoreanGrade = (school, semester) => {
    // 학교명을 한글로 변환
    const schoolNames = { ELEMENTARY: "초", MIDDLE: "중", HIGH: "고" };

    // 학기명을 서수로 변환
    const semesterNames = {
      FIRST1: "1-1",
      FIRST2: "1-2",
      SECOND1: "2-1",
      SECOND2: "2-2",
      THIRD1: "3-1",
      THIRD2: "3-2",
      FOURTH1: "4-1",
      FOURTH2: "4-2",
      FIFTH1: "5-1",
      FIFTH2: "5-2",
      SIXTH1: "6-1",
      SIXTH2: "6-2",
    };

    const subjectNames = {
      SECOND1: "물1",
      SECOND2: "물2",
      THIRD1: "화1",
      THIRD2: "화2",
      FOURTH1: "생1",
      FOURTH2: "생2",
      FIFTH1: "지1",
      FIFTH2: "지2",
    };

    const schoolNameKorean = schoolNames[school];
    const gradeNameKorean = semesterNames[semester];
    if (school === "HIGH") return subjectNames[semester];

    if (schoolNameKorean && gradeNameKorean) {
      return `${schoolNameKorean}${gradeNameKorean}`;
    }

    return "??";
  };

  useEffect(() => {
    const test2 = async () => {
      if (selectedBook) await getBookChapters(selectedBook.bookId);
      setLocalBookChapters(bookChapters);
    };
    if (localBookChapters.length == 0) test2();
  }, []);

  useEffect(() => {
    const filteredArr = books.filter((book) => {
      return (
        book.school === schoolToSend[school] &&
        String(book.semester).includes(numToEng[grade]) &&
        (book.title.includes(searchName) || book.publisher.includes(searchName))
      );
    });
    setBooksToRender(filteredArr);
  }, [books, school, searchName, grade]);
  useEffect(() => {
    if (selectedBook !== null) setPaperGrade(getKoreanGrade(selectedBook.school, selectedBook.semester));
  }, [selectedBook]);

  const gradesUponSchool = () => {
    return (
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
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  //문제 선택 부분

  useEffect(() => {
    if (localBookChapters.length === 0) {
      const newArr = bookChapters.map((chapter) => ({
        ...chapter,
        pages: chapter.pages.map((page) => ({ page, selected: false })), // 각 페이지에 selected 속성 추가
        expansion: false,
      }));
      setLocalBookChapters(newArr);
    }
  }, [bookChapters]);

  const onExpansion = (item) => {
    const updatedChapterToRender = localBookChapters.map((chapter) => {
      if (chapter.description === item.description) {
        // 현재 챕터의 expansion 속성을 토글합니다.
        return { ...chapter, expansion: !chapter.expansion };
      }
      return chapter; // 조건에 맞지 않는 경우에도 객체를 반환합니다.
    });
    setLocalBookChapters(updatedChapterToRender);
  };

  const [currentPage, setCurrentPage] = useState(null);

  const onPageClick = (page) => {
    if (currentPage === page) {
      setCurrentPage(null);
    } else {
      setCurrentPage(page);
      getBookQuestion(selectedBook.bookId, page);
    }
  };

  useEffect(() => {
    if (currentPage !== null) {
      const isThisPageSelected = bookQuestions.some((ques) =>
        selectedQuestions.some((q) => q.questionId === ques.questionId)
      );
      let tempArr = [];
      if (isThisPageSelected)
        tempArr = localBookChapters.map((chapter) => ({
          ...chapter,
          pages: chapter.pages.map((page) => (page.page === currentPage ? { ...page, selected: true } : page)),
        }));
      else
        tempArr = localBookChapters.map((chapter) => ({
          ...chapter,
          pages: chapter.pages.map((page) => (page.page === currentPage ? { ...page, selected: false } : page)),
        }));

      setLocalBookChapters(tempArr);
      const isThisChapterSelected = tempArr
        .map((chapter) =>
          chapter.pages.some((page) => page.selected)
            ? { id: chapter.chapterId, description: chapter.description }
            : null
        )
        .filter((chapter) => chapter !== null)
        .sort((a, b) => (a.id > b.id ? 1 : -1));
      setSelectedChapters(isThisChapterSelected);
    }
  }, [selectedQuestions]);

  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [hoveredPage, setHoveredPage] = useState(null);

  const onQuestionClick = (question) => {
    const questionId = question.questionId;
    if (selectedQuestions.some((q) => q.questionId === questionId)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q.questionId !== questionId));
    } else {
      setSelectedQuestions([
        ...selectedQuestions,
        { ...question, imageURL: question.questionImg, description: question.chapterDescription },
      ]);
    }
  };
  /** 1.1 => `1.(1)번` */
  function convertNumber(number) {
    const decimalPart = number % 1;
    const integerPart = Math.floor(number);

    if (decimalPart === 0) {
      return `${integerPart}번`;
    } else {
      const decimalStr = decimalPart.toFixed(1).split(".")[1];
      return `${integerPart}.(${decimalStr})번`;
    }
  }

  const attributes = ["학년", "교재명", "판수", "출판사"];
  const widths = [10, 52, 8, 15];

  if (selectedBook === null)
    return (
      <SELECTBOOK.BookSection>
        <SELECTBOOK.FilterLine>
          <SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.BtnContainer>
              {schoolOptions.map((opt) => (
                <SCHOOLSEM.DetailBtn key={opt} $isSelected={school === opt} value={opt} onClick={changeSchool}>
                  {opt}
                </SCHOOLSEM.DetailBtn>
              ))}
            </SCHOOLSEM.BtnContainer>
          </SCHOOLSEM.SchoolOptionContainer>
          {gradesUponSchool()}
          <SELECTBOOK.SearchBox>
            <SELECTBOOK.SearchIcon>
              <FontAwesomeIcon icon={faSearch} />
            </SELECTBOOK.SearchIcon>
            <SELECTBOOK.SearchInput
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
              placeholder="교재 이름, 출판사 검색"
            />
            <SELECTBOOK.XBtn
              onClick={() => {
                setSearchName("");
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </SELECTBOOK.XBtn>
          </SELECTBOOK.SearchBox>
        </SELECTBOOK.FilterLine>
        <SELECTBOOK.ListSection>
          <SELECTBOOK.ListHeader>
            {attributes.map((att, index) => (
              <SELECTBOOK.AttributeBox
                key={index}
                $width={widths[index]}
                $isTitle={att === "교재명" || att === "출판사"}
              >
                {att}
              </SELECTBOOK.AttributeBox>
            ))}
          </SELECTBOOK.ListHeader>
          <SELECTBOOK.ListContainer>
            {booksToRender.map((book, index) => (
              <SELECTBOOK.QuestionPaperLine key={index}>
                <SELECTBOOK.CellBox $width={widths[0]}>{getKoreanGrade(book.school, book.semester)}</SELECTBOOK.CellBox>
                <SELECTBOOK.CellBox
                  $width={widths[1]}
                  onClick={async () => {
                    setSelectedBook(book);
                    await getBookChapters(book.bookId);
                  }}
                  $isTitle={true}
                >
                  {book.title}
                </SELECTBOOK.CellBox>
                <SELECTBOOK.CellBox $width={widths[2]}>{book.editionNum}</SELECTBOOK.CellBox>
                <SELECTBOOK.CellBox $width={widths[3]} $isTitle={true}>
                  {book.publisher}
                </SELECTBOOK.CellBox>
              </SELECTBOOK.QuestionPaperLine>
            ))}
          </SELECTBOOK.ListContainer>
        </SELECTBOOK.ListSection>
      </SELECTBOOK.BookSection>
    );
  else
    return (
      <SELECTPAGE.Wrapper>
        <SELECTPAGE.TitleLine>
          <SELECTPAGE.Title>{selectedBook.title}</SELECTPAGE.Title>
          <SELECTPAGE.CloseBtn
            onClick={() => {
              setSelectedBook(null);
              setCurrentPage(null);
              setSelectedQuestions([]);
              setLocalBookChapters([]);
            }}
          >
            <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ marginRight: `0.5rem` }} />
            다른 교재 선택
          </SELECTPAGE.CloseBtn>
        </SELECTPAGE.TitleLine>
        <CHAPTERSCOPE.ScopeSection>
          <CHAPTERSCOPE.ChapterSection>
            {localBookChapters.map((item, index) => (
              <div key={item.description}>
                <CHAPTERSCOPE.ChapterLine
                  $level={0}
                  $isExpanded={item.expansion}
                  onMouseEnter={() => setHoveredChapter(item.description)}
                  onMouseLeave={() => setHoveredChapter(null)}
                  onClick={() => {
                    onExpansion(item);
                  }}
                >
                  <CHAPTERSCOPE.ExpansionSection
                    $isExpanded={item.expansion}
                    $isHovering={hoveredChapter === item.description}
                  >
                    <FontAwesomeIcon icon={item.expansion ? faCaretDown : faCaretRight} />
                  </CHAPTERSCOPE.ExpansionSection>
                  <CHAPTERSCOPE.DescriptionBox $isHovering={hoveredChapter === item.description}>
                    {item.description}
                  </CHAPTERSCOPE.DescriptionBox>
                </CHAPTERSCOPE.ChapterLine>
                {item.expansion && (
                  <div>
                    {item.pages.map((page, i) => (
                      <CHAPTERSCOPE.ChapterLine
                        key={page.page}
                        $level={1}
                        $isShowing={currentPage === page.page}
                        onMouseEnter={() => setHoveredPage(page.page)}
                        onMouseLeave={() => setHoveredPage(null)}
                        onClick={() => {
                          onPageClick(page.page);
                        }}
                      >
                        <CHAPTERSCOPE.ExpansionSection $isHovering={hoveredPage === page.page}>
                          <CHAPTERSCOPE.CheckBox $isChecked={page.selected} $isHovering={hoveredPage === page.page}>
                            {page.selected ? <FontAwesomeIcon icon={faCheck} /> : ""}
                          </CHAPTERSCOPE.CheckBox>
                        </CHAPTERSCOPE.ExpansionSection>
                        <CHAPTERSCOPE.DescriptionBox
                          $isHovering={hoveredPage === page.page || currentPage === page.page}
                        >
                          {page.page}p
                        </CHAPTERSCOPE.DescriptionBox>
                      </CHAPTERSCOPE.ChapterLine>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CHAPTERSCOPE.ChapterSection>
          {currentPage ? (
            <CHAPTERSCOPE.QuestionSection>
              {bookQuestions.map((ques) => (
                <CHAPTERSCOPE.QuestionNumber
                  onClick={() => {
                    onQuestionClick(ques);
                  }}
                >
                  <CHAPTERSCOPE.CheckBox
                    $isChecked={selectedQuestions.some((q) => q.questionId === ques.questionId)}
                    style={{ marginRight: `0.75rem` }}
                  >
                    {selectedQuestions.some((q) => q.questionId === ques.questionId) ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      ""
                    )}
                  </CHAPTERSCOPE.CheckBox>
                  {convertNumber(ques.pageOrder)}
                </CHAPTERSCOPE.QuestionNumber>
              ))}
            </CHAPTERSCOPE.QuestionSection>
          ) : (
            <CHAPTERSCOPE.QuestionSection>
              <CHAPTERSCOPE.NoPageMsg>
                <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
                선택된 페이지가 없습니다. 페이지를 선택하세요.
              </CHAPTERSCOPE.NoPageMsg>
            </CHAPTERSCOPE.QuestionSection>
          )}
        </CHAPTERSCOPE.ScopeSection>
      </SELECTPAGE.Wrapper>
    );
};

export default SelectBook;

const SELECTBOOK = {
  BookSection: styled.div`
    background: white;
    overflow: hidden;
    width: 86.5rem;
    height: 69rem;
    display: flex;
    flex-direction: column;
  `,

  CloseBtn: styled.button`
    width: 4rem;
    height: 4rem;
    font-size: 2.5rem;
    font-weight: 200;
    color: ${({ theme }) => theme.colors.gray40};
    margin-left: auto;
    margin-right: 2rem;
  `,
  FilterLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
    background-color: white;
    //border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray20};
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
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ListSection: styled.div``,
  ListHeader: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
    border-top: 0.04rem solid ${({ theme }) => theme.colors.gray20};
    background-color: white;
  `,
  AttributeBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    text-align: ${({ $isTitle }) => ($isTitle ? `left` : `center`)};
    padding-left: ${({ $isTitle }) => ($isTitle ? `2rem` : "0rem")};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: 58rem;
    overflow-y: hidden;
    background-color: white;
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
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 0.01rem solid ${({ theme }) => theme.colors.gray10};
    background-color: white;
  `,
  CellBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    height: 3rem;
    padding-left: ${({ $isTitle }) => ($isTitle ? `2rem` : "0rem")};
    cursor: ${({ $isTitle }) => ($isTitle ? `pointer` : `default`)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isTitle, theme }) => ($isTitle ? theme.colors.gray80 : theme.colors.gray60)};
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
    height: 6rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  BtnContainer: styled.div`
    width: 18.5rem;
    display: flex;
    align-items: center;
    flex-direction: row;
  `,
  DetailBtn: styled.button`
    width: 5rem;
    height: 4rem;
    margin-right: 1rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: white;
    border: solid ${({ $isSelected, theme }) => ($isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem black`)};
    &:hover {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  SemsterOptionContainer: styled.div`
    width: 33rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 0.5rem;
  `,
  SemesterContainer: styled.div`
    margin-left: auto;
    border-left: 0.1rem solid ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6rem;
    padding-left: 0.5rem;
  `,
  RoundBtn: styled.button`
    width: 5rem;
    height: 4rem;
    border-radius: 0.6rem;
    margin-left: 1rem;
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray50)};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem ${theme.colors.unselected}`};
    &:hover {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
};

const SELECTPAGE = {
  Wrapper: styled.div`
    background: white;
    overflow: hidden;
    width: 86.5rem;
    height: 69rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    background-color: white;
    height: 6rem;
    width: 100%;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  Title: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray50};
  `,
  CloseBtn: styled.button`
    width: 17rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    color: ${({ theme }) => theme.colors.gray60};
    margin-left: auto;
    margin-right: 2rem;
  `,
  FilterLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
    background-color: white;
    //border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray20};
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
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ListSection: styled.div``,
  ListHeader: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
    border-top: 0.04rem solid ${({ theme }) => theme.colors.gray20};
    background-color: white;
  `,
  AttributeBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    text-align: ${({ $isTitle }) => ($isTitle ? `left` : `center`)};
    padding-left: ${({ $isTitle }) => ($isTitle ? `2rem` : "0rem")};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: 52rem;
    overflow-y: hidden;
    background-color: white;
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
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 0.01rem solid ${({ theme }) => theme.colors.gray10};
    background-color: white;
  `,
  CellBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    height: 3rem;
    padding-left: ${({ $isTitle }) => ($isTitle ? `2rem` : "0rem")};
    cursor: ${({ $isTitle }) => ($isTitle ? `pointer` : `default`)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isTitle, theme }) => ($isTitle ? theme.colors.gray80 : theme.colors.gray60)};
  `,
};

const CHAPTERSCOPE = {
  ScopeSection: styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
  `,
  ChapterSection: styled.div`
    background-color: white;
    width: 30rem;
    height: 63rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ChapterLine: styled.div`
    width: 30rem;
    background-color: ${({ $level, $isShowing, theme }) =>
      $level === 0 ? theme.colors.gray05 : $isShowing ? theme.colors.lightMain : `white`};
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    //border: 0.1rem black solid;
    padding-left: ${({ $level }) => $level * 2}rem;
    padding-right: 1rem;
    cursor: ${({ $level }) => ($level ? `pointer` : `default`)};
  `,
  ExpansionSection: styled.div`
    height: 4rem;
    width: 5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: ${({ $isExpanded, theme }) => ($isExpanded ? theme.colors.deepDark : theme.colors.unselected)};
    cursor: pointer;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray40};
          `};
  `,
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem
      ${({ $isChecked, $isHovering, theme }) =>
        $isChecked || $isHovering ? theme.colors.mainColor : theme.colors.unselected}
      solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    overflow: hidden;
  `,
  DescriptionBox: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.5rem;
    margin-left: 1rem;
    font-size: 1.6rem;
    font-weight: 600;
    width: 25rem;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray50};
          `};
  `,
  QuestionSection: styled.div`
    width: 56.4rem;
    margin-bottom: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈을 허용 */
    justify-content: flex-start;
    align-items: center;
    padding-left: 3rem;
    padding-top: 5rem;
  `,
  QuestionNumber: styled.div`
    width: 9.5rem;
    height: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 3rem;
    margin-right: 0.5rem;
    cursor: pointer;
  `,
  NoPageMsg: styled.div`
    font-size: 1.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.warning};
  `,
};
