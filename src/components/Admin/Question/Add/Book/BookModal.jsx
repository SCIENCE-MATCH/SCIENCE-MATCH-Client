import { faCirclePlus, faPen, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useEffect, useState } from "react";
import usePatchUpdateBook from "../../../../../libs/apis/Admin/patchUpdateBook";
import useGetBooks from "../../../../../libs/hooks/Teacher/Management/useGetBooks";
import usePostAddBook from "../../../../../libs/apis/Admin/postAddBook";

const BookLookupModal = ({
  closeModal,
  school,
  setSchool,
  grade,
  setGrade,
  semester,
  setSemester,
  setSelectedBook,
}) => {
  const { patchUpdateBook } = usePatchUpdateBook(); // 훅을 호출하여 patchUpdateBook 함수를 가져옵니다.
  const { books, getBooks } = useGetBooks();
  const { postAddBook } = usePostAddBook();
  const [booksToRender, setBooksToRender] = useState([]);

  const [searchName, setSearchName] = useState("");
  const schoolOptions = ["초", "중", "고"];
  const grades = { 초: [3, 4, 5, 6], 중: [1, 2, 3], 고: [1, "물리", "화학", "생명", "지구"] };

  const changeGrade = (opt) => {
    setGrade(opt);
  };
  const changeSemester = (opt) => {
    setSemester(opt);
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

  const [semesterToSend, setSemesterTS] = useState("");
  useEffect(() => {
    setSemesterTS(`${numToEng[grade]}${semester}`);
  }, [grade, semester]);

  const schoolGradeSemesterToKorean = (school, grade, semester) => {
    let result = school + grade + "-" + semester;
    if (isNaN(grade)) {
      result = grade.slice(0, 1) + semester;
    }
    return result;
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

    return "Invalid input";
  };

  const addBook = async () => {
    await postAddBook(schoolToSend[school], semesterToSend, newBook);
    await getBooks();
    setIsAdding(false);
    setNewBook({ title: "", editionNum: 1, publisher: "" });
  };

  useEffect(() => {
    const filteredArr = books.filter((book) => {
      return (
        book.school === schoolToSend[school] &&
        String(book.semester).includes(numToEng[grade]) &&
        book.semester.includes(semester) &&
        (book.title.includes(searchName) || book.publisher.includes(searchName))
      );
    });
    setBooksToRender(filteredArr);
  }, [books, school, searchName, grade, semester]);

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
            disabled={isEditing}
          >
            {opt}
          </SCHOOLSEM.RoundBtn>
        ))}
        <SCHOOLSEM.SemesterContainer>
          <SCHOOLSEM.RoundBtn $isSelected={semester === 1} onClick={() => changeSemester(1)} disabled={isEditing}>
            1
          </SCHOOLSEM.RoundBtn>
          <SCHOOLSEM.RoundBtn $isSelected={semester === 2} onClick={() => changeSemester(2)} disabled={isEditing}>
            2
          </SCHOOLSEM.RoundBtn>
        </SCHOOLSEM.SemesterContainer>
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  const [newBook, setNewBook] = useState({ title: "", editionNum: 1, publisher: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleTitleInput = (e) => {
    setNewBook({ ...newBook, title: e.target.value });
  };
  const handlePublisherInput = (e) => {
    setNewBook({ ...newBook, publisher: e.target.value });
  };
  const handleEditionInput = (e) => {
    setNewBook({ ...newBook, editionNum: e.target.value });
  };
  const renderBookAddComponent = () => {
    return (
      <ADDPART.Container>
        <ADDPART.FilterLine>
          <ADDPART.CancleBtn
            onClick={() => {
              setIsAdding(false);
              setNewBook({ title: "", editionNum: 1, publisher: "" });
            }}
          >
            돌아가기
          </ADDPART.CancleBtn>
          <ADDPART.SubmitBtn onClick={addBook} disabled={newBook.title === "" || newBook.publisher === ""}>
            추가하기
          </ADDPART.SubmitBtn>
        </ADDPART.FilterLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>선택 학년</ADDPART.InputLabel>
          <ADDPART.InputBox $width={8} value={schoolGradeSemesterToKorean(school, grade, semester)} disabled />
          학년은 상단 버튼을 통해 선택됩니다.
        </ADDPART.InputLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>교재 이름</ADDPART.InputLabel>
          <ADDPART.InputBox $width={45} value={newBook.title} onChange={handleTitleInput} />
        </ADDPART.InputLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>출판사</ADDPART.InputLabel>
          <ADDPART.InputBox $width={27} value={newBook.publisher} onChange={handlePublisherInput} />
        </ADDPART.InputLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>판수</ADDPART.InputLabel>
          <ADDPART.InputBox $width={8} value={newBook.editionNum} onChange={handleEditionInput} />
        </ADDPART.InputLine>
      </ADDPART.Container>
    );
  };

  const [editingBook, setEditingBook] = useState({ id: null, title: "", editionNum: 1, publisher: "" });
  const [isEditing, setIsEditing] = useState(false);
  const setIdToEdit = (book) => {
    setEditingBook({ id: book.bookId, title: book.title, editionNum: book.editionNum, publisher: book.publisher });
  };
  const editTitleInput = (e) => {
    setEditingBook({ ...editingBook, title: e.target.value });
  };
  const editPublisherInput = (e) => {
    setEditingBook({ ...editingBook, publisher: e.target.value });
  };
  const editEditionInput = (e) => {
    setEditingBook({ ...editingBook, editionNum: e.target.value });
  };
  const updateBook = async () => {
    console.log(editingBook);
    await patchUpdateBook(editingBook);
    await getBooks();
    setIsEditing(false);
    setEditingBook({ id: null, title: "", editionNum: 1, publisher: "" });
  };
  const renderBookEditingComponent = () => {
    return (
      <ADDPART.Container>
        <ADDPART.FilterLine>
          <ADDPART.CancleBtn
            onClick={() => {
              setIsEditing(false);
              setEditingBook({ id: null, title: "", editionNum: 1, publisher: "" });
            }}
          >
            돌아가기
          </ADDPART.CancleBtn>
          <ADDPART.SubmitBtn onClick={updateBook} disabled={editingBook.title === "" || editingBook.publisher === ""}>
            저장하기
          </ADDPART.SubmitBtn>
        </ADDPART.FilterLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>교재 학년</ADDPART.InputLabel>
          <ADDPART.InputBox $width={8} value={schoolGradeSemesterToKorean(school, grade, semester)} disabled />
          수정 시 학년 변경은 불가능합니다.
        </ADDPART.InputLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>교재 이름</ADDPART.InputLabel>
          <ADDPART.InputBox $width={45} value={editingBook.title} onChange={editTitleInput} />
        </ADDPART.InputLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>출판사</ADDPART.InputLabel>
          <ADDPART.InputBox $width={27} value={editingBook.publisher} onChange={editPublisherInput} />
        </ADDPART.InputLine>
        <ADDPART.InputLine>
          <ADDPART.InputLabel>판수</ADDPART.InputLabel>
          <ADDPART.InputBox $width={8} value={editingBook.editionNum} onChange={editEditionInput} />
        </ADDPART.InputLine>
      </ADDPART.Container>
    );
  };

  const attributes = ["학년", "교재명", "판수", "출판사", "수정"];
  const widths = [8, 42, 6, 13, 4];
  return (
    <EQ.ModalOverlay>
      <EQ.Modal>
        <EQ.TitleLine>
          <EQ.Title>{isAdding ? `교재 추가` : isEditing ? `교재 수정` : `교재 검색`}</EQ.Title>
          <EQ.CloseBtn
            onClick={() => {
              setSelectedBook({ bookId: null, title: null });
              closeModal();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </EQ.CloseBtn>
        </EQ.TitleLine>
        <EQ.FilterLine>
          <SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.BtnContainer>
              {schoolOptions.map((opt) => (
                <SCHOOLSEM.DetailBtn
                  key={opt}
                  $isSelected={school === opt}
                  value={opt}
                  onClick={changeSchool}
                  disabled={isEditing}
                >
                  {opt}
                </SCHOOLSEM.DetailBtn>
              ))}
            </SCHOOLSEM.BtnContainer>
          </SCHOOLSEM.SchoolOptionContainer>
          {gradesUponSchool()}
        </EQ.FilterLine>
        {isAdding ? (
          renderBookAddComponent()
        ) : isEditing ? (
          renderBookEditingComponent()
        ) : (
          <EQ.ListSection>
            <EQ.FilterLine>
              <EQ.CreateBtn
                onClick={() => {
                  setIsAdding(true);
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                {` 신규 교재 추가`}
              </EQ.CreateBtn>
              <EQ.SearchBox>
                <EQ.SearchIcon>
                  <FontAwesomeIcon icon={faSearch} />
                </EQ.SearchIcon>
                <EQ.SearchInput
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                  }}
                  placeholder="교재 이름, 출판사 검색"
                />
                <EQ.XBtn
                  onClick={() => {
                    setSearchName("");
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </EQ.XBtn>
              </EQ.SearchBox>
            </EQ.FilterLine>
            <EQ.ListHeader>
              {attributes.map((att, index) => (
                <EQ.AttributeBox key={index} $width={widths[index]} $isTitle={att === "교재명"}>
                  {att}
                </EQ.AttributeBox>
              ))}
            </EQ.ListHeader>
            <EQ.ListContainer>
              {booksToRender.map((book, index) => (
                <EQ.QuestionPaperLine key={index}>
                  <EQ.CellBox $width={widths[0]}>{getKoreanGrade(book.school, book.semester)}</EQ.CellBox>
                  <EQ.CellBox
                    $width={widths[1]}
                    onClick={() => {
                      setSelectedBook(book);
                      closeModal();
                    }}
                    $isTitle={true}
                  >
                    {book.title}
                  </EQ.CellBox>
                  <EQ.CellBox $width={widths[2]}>{book.editionNum}</EQ.CellBox>
                  <EQ.CellBox $width={widths[3]}>{book.publisher}</EQ.CellBox>
                  <EQ.CellBox
                    $width={widths[4]}
                    style={{ cursor: `pointer` }}
                    onClick={() => {
                      setIdToEdit(book);
                      setIsEditing(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </EQ.CellBox>
                </EQ.QuestionPaperLine>
              ))}
            </EQ.ListContainer>
          </EQ.ListSection>
        )}
      </EQ.Modal>
    </EQ.ModalOverlay>
  );
};

export default BookLookupModal;

const EQ = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 75rem;
    height: 50rem;
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
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,
  Title: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
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
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
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
    background-color: white;
  `,
  AttributeBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    text-align: ${({ $isTitle }) => ($isTitle ? `left` : `center`)};
    padding-inline: ${({ $isTitle }) => ($isTitle ? `2rem` : "0rem")};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: 27rem;
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `2rem` : "0rem")};
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
  `,
  SemsterOptionContainer: styled.div`
    width: 100%;
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
  `,
};

const ADDPART = {
  Container: styled.div`
    background-color: white;
    height: 30rem;
  `,
  FilterLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
    background-color: white;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    margin-bottom: 3.5rem;
  `,
  CancleBtn: styled.button`
    width: 17.5rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
    font-size: 1.8rem;
    font-weight: 700;
  `,
  SubmitBtn: styled.button`
    width: 17.5rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.8rem;
    font-weight: 700;
    margin-left: auto;
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray30};
    }
  `,
  InputLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6rem;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.warning};
  `,
  InputLabel: styled.div`
    width: 15rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 2rem;
    color: black;
  `,
  ShortLabel: styled.div`
    width: 6.5rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 2rem;
    color: black;
  `,
  InputBox: styled.input`
    width: ${({ $width }) => `${$width}rem`};
    height: 4rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.6rem;
    font-weight: 600;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray40};
    margin-right: 1.5rem;
    &:focus {
      outline: none;
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    }
  `,
};
