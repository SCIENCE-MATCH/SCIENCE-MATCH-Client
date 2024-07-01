import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import SearchBookModal from "./SearchBookModal";
import { useEffect, useState } from "react";
import useGetBookChaper from "../../../../../libs/hooks/Teacher/Management/useGetBookChapter";
import useGetBookQuestion from "../../../../../libs/hooks/Teacher/Management/useGetBookQuestion";
import useDeleteQuestion from "../../../../../libs/apis/Admin/deleteQuestion";

const SearchTextBook = ({
  chapToSearch,
  school,
  setSchool,
  grade,
  setGrade,
  semester,
  setSemester,
  selectedBook,
  setSelectedBook,
  currentPage,
}) => {
  const { bookQuestions, getBookQuestion } = useGetBookQuestion();
  const { deleteQuestion } = useDeleteQuestion();
  const [isSelectingBook, setIsSelectingBook] = useState(false);
  const openModal = () => {
    setIsSelectingBook(true);
  };
  const closeModal = () => {
    setIsSelectingBook(false);
  };

  const [idToDelete, setIdToDelete] = useState(null);
  const [isWarning, setIsWarning] = useState(false);
  const openWarning = () => setIsWarning(true);
  const closeWarning = () => setIsWarning(false);

  const difficultyOption = ["하", "중하", "중", "중상", "상"];
  const difficultyToSendOption = {
    하: "LOW",
    중하: "MEDIUM_LOW",
    중: "MEDIUM",
    중상: "MEDIUM_HARD",
    상: "HARD",
  };
  const [selectedDifficulty, setSelectedDifficulty] = useState({
    하: true,
    중하: true,
    중: true,
    중상: true,
    상: true,
  });

  const [questionSet, setQuestionSet] = useState([]);

  const clickDifficulty = (diff) => {
    setSelectedDifficulty((prevState) => ({
      ...prevState,
      [diff]: !prevState[diff],
    }));
  };

  const categoryOption = ["선택형", "단답형", "서술형"];
  const categoryToSendOption = {
    선택형: "MULTIPLE",
    단답형: "SUBJECTIVE",
    서술형: "DESCRIPTIVE",
  };
  const [category, setCategory] = useState(categoryOption[0]);

  useEffect(() => {
    if (currentPage !== null) getBookQuestion(selectedBook.bookId, currentPage);
  }, [currentPage]);

  return (
    <RQ.Wrapper>
      {isSelectingBook && (
        <SearchBookModal
          closeModal={closeModal}
          school={school}
          setSchool={setSchool}
          grade={grade}
          setGrade={setGrade}
          semester={semester}
          setSemester={setSemester}
          setSelectedBook={setSelectedBook}
        />
      )}
      <RQ.TitleLine>
        <RQ.TitleBox>시중교재 문제 검색</RQ.TitleBox>
      </RQ.TitleLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 교재명</RQ.ChapterLabel>
        {selectedBook.title === null ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 교재가 없습니다.
            교재를 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{selectedBook.title}</RQ.ChapterDescription>
        )}
        <RQ.SearchBtn onClick={openModal}>교재 선택</RQ.SearchBtn>
      </RQ.ChapterLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 페이지</RQ.ChapterLabel>
        {currentPage === null ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 페이지가 없습니다.
            페이지를 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{currentPage}p</RQ.ChapterDescription>
        )}
      </RQ.ChapterLine>
    </RQ.Wrapper>
  );
};

export default SearchTextBook;

const RQ = {
  Wrapper: styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    width: 86rem;
    height: 80rem;
    overflow: hidden;
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
  `,
  TitleLine: styled.div`
    height: 6rem;
    width: 86rem;
    padding-block: 2rem;
    padding-left: 3rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.background};
  `,
  TitleBox: styled.div`
    font-size: 2rem;
    font-weight: 600;
  `,
  ChapterLine: styled.div`
    height: 7.5rem;
    width: 86rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: -0.5rem;
  `,
  ChapterLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
  `,

  ChapterDescription: styled.div`
    height: 4.5rem;
    width: 50rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.6rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
  `,
  WarningDes: styled.div`
    height: 4.5rem;
    width: 50rem;
    border-radius: 0.6rem;
    padding-left: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  `,
  SearchBtn: styled.button`
    width: 15rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.warning};
    margin-right: 4rem;
    margin-left: auto;
  `,
};
