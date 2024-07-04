import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import SearchBookModal from "./SearchBookModal";
import { useEffect, useState } from "react";
import useGetBookChaper from "../../../../../libs/hooks/Teacher/Management/useGetBookChapter";
import useGetBookQuestion from "../../../../../libs/hooks/Teacher/Management/useGetBookQuestion";
import useDeleteQuestion from "../../../../../libs/apis/Admin/deleteQuestion";
import WarningModal from "../../../Concept/WarningModal";

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
      {isWarning && (
        <WarningModal
          deleteFunc={async () => {
            await deleteQuestion(idToDelete);
            setIdToDelete(null);
            getBookQuestion(selectedBook.bookId, currentPage);
          }}
          closeModal={closeWarning}
          warningText={"기존 문제지에 출제된 문제 또한 삭제됩니다."}
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
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
            선택하세요
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{currentPage}p</RQ.ChapterDescription>
        )}
      </RQ.ChapterLine>
      <RQ.ImgSection>
        {bookQuestions.length === 0 ? (
          <RQ.NoImgMsg>조회된 문제가 없습니다.</RQ.NoImgMsg>
        ) : (
          bookQuestions.map((q) => (
            <RQ.ImgContainer>
              <RQ.ImgOptionLine>
                {convertNumber(q.pageOrder)}
                <RQ.DeleteBtn
                  onClick={() => {
                    setIdToDelete(q.questionId);
                    openWarning();
                  }}
                >
                  문제 삭제
                </RQ.DeleteBtn>
              </RQ.ImgOptionLine>
              <RQ.ImgBox>
                <RQ.Image src={q.questionImg} />
              </RQ.ImgBox>
            </RQ.ImgContainer>
          ))
        )}
      </RQ.ImgSection>
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
    font-weight: 600;
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
  OptionLine: styled.div`
    width: 86rem;
    height: 5rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  OptionLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  OptionBtnBox: styled.div`
    width: 50rem;
    display: flex;
    justify-content: space-between;
    margin-right: 3rem;
  `,
  OptionBtn: styled.button`
    flex: 1;
    margin: 0 1rem;
    height: 4rem;
    border-radius: 0.6rem;
    border: 0.2rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : `white`)};

    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray30)};
    font-size: ${({ $isSelected }) => ($isSelected ? `1.8rem` : `1.6rem`)};
    font-weight: 600;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
      font-size: 1.8rem;
    }
  `,
  ImgSection: styled.div`
    width: 82rem;
    height: 57.5rem;
    margin-top: 0.5rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray20};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈을 허용 */
    justify-content: flex-start;
    margin-left: 2rem;
    padding: 1rem;
    padding-right: 0rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ImgContainer: styled.div`
    width: 38.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 2rem;
    &:nth-child(2n) {
      margin-right: 0rem;
    }
  `,
  ImgOptionLine: styled.div`
    width: 38.5rem;
    height: 4rem;
    padding-left: 1rem;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5rem;
  `,
  ImgBox: styled.div`
    width: 38.5rem;
    height: 15rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 3rem;
    padding: 1rem;
    padding-right: 0rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  Image: styled.img`
    width: 35.8rem;
    height: auto;
    max-height: 1000%;
  `,
  DeleteBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    cursor: pointer;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray30};
  `,
  NoImgMsg: styled.div`
    width: 79.5rem;
    height: 52rem;
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray60};
  `,
};
