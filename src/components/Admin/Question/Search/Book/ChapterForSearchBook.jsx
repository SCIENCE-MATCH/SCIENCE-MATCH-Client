import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import useGetBookChaper from "../../../../../libs/hooks/Teacher/Management/useGetBookChapter";
import useGetBookQuestion from "../../../../../libs/hooks/Teacher/Management/useGetBookQuestion";

const ChapterForSearchBook = ({
  currentChapter,
  setCurrentChapter,
  selectedBook,
  setSelectedBook,
  questionCategory,
  setQuestionCategory,
  school,
  setSchool,
  grade,
  setGrade,
  semester,
  setSemester,
  currentPage,
  setCurrentPage,
}) => {
  const { bookChapters, getBookChapters } = useGetBookChaper();
  const { bookQuestions, getBookQuestion } = useGetBookQuestion();

  const categorySet = { 0: "단원 유형별", 1: "시중교재", 2: "모의고사" };
  const [chapterToRender, setChapterToRender] = useState([]);

  const schoolOptions = ["초", "중", "고"];
  const grades = { 초: [3, 4, 5, 6], 중: [1, 2, 3], 고: [1, "물리", "화학", "생명", "지구"] };

  const changeSchool = (e) => {
    const newValue = e.target.value;
    setSchool(newValue);
    if (newValue === "초") setGrade(3);
    else setGrade(1);
  };
  const changeGrade = (opt) => {
    setGrade(opt);
  };
  const changeSemester = (opt) => {
    setSemester(opt);
  };
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
        <SCHOOLSEM.SemesterContainer>
          <SCHOOLSEM.RoundBtn $isSelected={semester === 1} onClick={() => changeSemester(1)}>
            1
          </SCHOOLSEM.RoundBtn>
          <SCHOOLSEM.RoundBtn $isSelected={semester === 2} onClick={() => changeSemester(2)}>
            2
          </SCHOOLSEM.RoundBtn>
        </SCHOOLSEM.SemesterContainer>
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  useEffect(() => {
    const getC = async () => {
      if (selectedBook.bookId) {
        await getBookChapters(selectedBook.bookId);
        const transformed = Object.entries(bookChapters).map(([description, pages]) => ({
          description,
          pages,
          expansion: false,
        }));
        setChapterToRender(transformed);
      }
    };
    getC();
  }, [selectedBook]);

  const onExpansion = (item) => {
    const updatedChapterToRender = chapterToRender.map((chapter) => {
      if (chapter.description === item.description) {
        // 현재 챕터의 expansion 속성을 토글합니다.
        return { ...chapter, expansion: !chapter.expansion };
      }
      return chapter; // 조건에 맞지 않는 경우에도 객체를 반환합니다.
    });
    setChapterToRender(updatedChapterToRender);
  };

  const onPageClick = (page) => {
    if (currentPage === page) {
      setCurrentPage(null);
    } else {
      setCurrentPage(page);
    }
  };
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [hoveredPage, setHoveredPage] = useState(null);

  return (
    <SELECTCHAP.Wrapper>
      <SELECTCHAP.ListOptionLine>
        {[0, 1, 2].map((opt) => (
          <SELECTCHAP.ListOptionBtn
            $order={opt}
            $isSelected={questionCategory === opt}
            onClick={() => {
              setQuestionCategory(opt);
            }}
          >
            {categorySet[opt]}
          </SELECTCHAP.ListOptionBtn>
        ))}
      </SELECTCHAP.ListOptionLine>{" "}
      <OO.Wrapper>
        <SCHOOLSEM.RowContainer>
          <SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.BtnContainer>
              {schoolOptions.map((opt) => (
                <SCHOOLSEM.DetailBtn key={opt} $isSelected={school === opt} value={opt} onClick={changeSchool}>
                  {opt}
                </SCHOOLSEM.DetailBtn>
              ))}
            </SCHOOLSEM.BtnContainer>
          </SCHOOLSEM.SchoolOptionContainer>
        </SCHOOLSEM.RowContainer>
        <SCHOOLSEM.RowContainer>{gradesUponSchool()}</SCHOOLSEM.RowContainer>

        <CHAPTERSCOPE.ScopeSection>
          {chapterToRender.map((item, index) => (
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
                      key={page}
                      $level={1}
                      onMouseEnter={() => setHoveredPage(page)}
                      onMouseLeave={() => setHoveredPage(null)}
                      onClick={() => {
                        onPageClick(page);
                      }}
                    >
                      <CHAPTERSCOPE.ExpansionSection $isHovering={hoveredPage === page}>
                        <CHAPTERSCOPE.CheckBox $isChecked={currentPage === page} $isHovering={hoveredPage === page}>
                          {currentPage === page ? <FontAwesomeIcon icon={faCheck} /> : ""}
                        </CHAPTERSCOPE.CheckBox>
                      </CHAPTERSCOPE.ExpansionSection>
                      <CHAPTERSCOPE.DescriptionBox $isHovering={hoveredPage === page}>
                        {page}
                      </CHAPTERSCOPE.DescriptionBox>
                    </CHAPTERSCOPE.ChapterLine>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              console.log(chapterToRender);
            }}
          >
            ㅇ!!
          </button>
        </CHAPTERSCOPE.ScopeSection>
      </OO.Wrapper>
    </SELECTCHAP.Wrapper>
  );
};

export default ChapterForSearchBook;

const leftSectionWidth = `47.5rem`;
const SELECTCHAP = {
  Wrapper: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    height: 80rem;
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    margin-right: 1.5rem;
    overflow: hidden;
  `,
  ListOptionLine: styled.div`
    width: ${leftSectionWidth};
    height: 6rem;
    display: flex;
    flex-direction: row;
  `,
  ListOptionBtn: styled.button`
    width: 15.8rem;
    height: 6rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
    border-radius: ${({ $order }) => ($order === 0 ? `1rem 0 0 0` : $order === 2 ? `0 1rem 0 0` : `0rem`)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray40)};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
    ${({ $isSelected, $order, theme }) =>
      $isSelected
        ? $order === 0
          ? css`
              border-right: 0.1rem solid ${theme.colors.gray20};
            `
          : $order === 1
          ? css`
              border-right: 0.1rem solid ${theme.colors.gray20};
              border-left: 0.1rem solid ${theme.colors.gray20};
            `
          : css`
              border-left: 0.1rem solid ${theme.colors.gray20};
            `
        : css`
            border-bottom: 0.1rem solid ${theme.colors.gray20};
          `}
  `,
};
const OO = {
  Wrapper: styled.div`
    width: ${leftSectionWidth};
    height: 80rem;
    overflow: hidden;
  `,
};
const SCHOOLSEM = {
  RowContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${leftSectionWidth};
    height: 6rem;
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    width: 21rem;
    height: 4rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
  `,
  BtnContainer: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  DetailBtn: styled.button`
    width: 5rem;
    height: 4rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: white;
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
  `,
  SemsterOptionContainer: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 1.5rem;
  `,
  SemesterContainer: styled.div`
    margin-left: auto;
    border-left: 0.1rem solid ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 15rem;
    height: 6rem;
    padding-left: 1rem;
    padding-right: 1.5rem;
  `,
  RoundBtn: styled.button`
    width: 5rem;
    height: 4rem;
    border-radius: 0.6rem;
    margin-inline: 0.5rem;
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray50)};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem ${theme.colors.unselected}`};
  `,
};

const CHAPTERSCOPE = {
  ScopeSection: styled.div`
    border-top: 5rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
    height: 61rem;
    margin-bottom: 1rem;
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
    width: ${({ $level }) => 47 - $level * 2.8}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    //border: 0.1rem black solid;
    margin-left: ${({ $level }) => $level * 2.8}rem;
    padding-right: 1rem;
    cursor: pointer;
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
    margin-left: -0.25rem;
    font-size: 1.75rem;
    font-weight: 600;
    width: 25rem;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
            font-size: 2.2rem;
          `
        : css`
            color: ${theme.colors.gray40};
          `};
  `,
};
