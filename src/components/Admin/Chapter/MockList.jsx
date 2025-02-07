import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import usePostLookupMock from "../../../libs/apis/Admin/Question/getMockList";
import usePostAddMock from "../../../libs/apis/Admin/Question/postAddMock";
import { faSquare as regularFaSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquare as solidFaSquare } from "@fortawesome/free-solid-svg-icons";

const MockList = ({ currentMock, setCurrentMock, setQuestionCategory }) => {
  const { searchedMockList, postLookupMock } = usePostLookupMock();
  const { postAddMock } = usePostAddMock();

  const [selectedMock, setSelectedMock] = useState(null); //현재 보고 있는 모의고사 저장 변수

  const initialPublishers = [
    { name: "평가원", selected: false },
    { name: "교육청", selected: false },
    { name: "대성", selected: false },
    { name: "종로", selected: false },
    { name: "이투스", selected: false },
  ];
  const [publishers, setPublishers] = useState([...initialPublishers]);
  const today = new Date();
  const thisYear = today.getFullYear(); // 현재 연도를 가져옴
  const standardOfYear = 2015;

  const categorySet = { 0: "단원 유형별", 1: "시중교재", 2: "모의고사" };
  const [simpleChapter, setSimpleChapters] = useState([]);

  const grades = ["고1", "물리", "화학", "생명", "지구"];
  const [grade, setGrade] = useState([...grades][0]);
  const [semester, setSemester] = useState(1);

  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState(3);

  const [showDropDown, setShowDropdown] = useState(false);
  const [showPublisherDD, setShowPublisherDD] = useState(false);
  const gradesUponSchool = () => {
    return (
      <SCHOOLSEM.SemsterOptionContainer>
        {grades.map((opt, index) => (
          <SCHOOLSEM.DetailBtn
            key={index}
            $isSelected={grade === opt}
            value={opt}
            onClick={() => {
              if (index === 0) setSemester(1);
              setGrade(opt);
            }}
          >
            {opt}
          </SCHOOLSEM.DetailBtn>
        ))}
        {grade !== grades[0] && (
          <SCHOOLSEM.SemesterContainer>
            <SCHOOLSEM.DetailBtn $isSelected={semester === 1} onClick={() => setSemester(1)}>
              1
            </SCHOOLSEM.DetailBtn>
            <SCHOOLSEM.DetailBtn $isSelected={semester === 2} onClick={() => setSemester(2)}>
              2
            </SCHOOLSEM.DetailBtn>
          </SCHOOLSEM.SemesterContainer>
        )}
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  const numToEng = ["FIRST1", "SECOND1"];
  const koToEng = { 고1: "SCIENCE", 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
  useEffect(() => {
    setCurrentMock({ csatId: null, publisher: null });
    postLookupMock(koToEng[grade], year, month);
  }, [grade, year, month]);

  /**simplifyChapter*/
  /**
    csatId: 845
    month: 3
    publisher: "테스트1"
    subject: "SCIENCE"
    subjectNum: 0
    year: 2024
*/
  useEffect(() => {
    if (searchedMockList.length > 0) {
      setSimpleChapters(searchedMockList);
      const tempArr = publishers.map((publisher) => ({
        ...publisher,
        selected: searchedMockList.some((item) => item.subjectNum === semester && item.publisher === publisher.name),
      }));
      setPublishers(tempArr);
    } else {
      setSimpleChapters([]);
      setPublishers(initialPublishers);
    }
  }, [searchedMockList, semester]);

  const onChapterClick = (thisMock) => {
    if (currentMock.csatId === thisMock.csatId) {
      setCurrentMock({ csatId: null, publisher: null });
    } else {
      let sem = `${numToEng[semester - 1]}1`;
      let sub = koToEng[grade];

      setCurrentMock({
        csatId: thisMock.csatId,
        publisher: thisMock.publisher,
        school: "HIGH",
        semester: semester,
        grade: grade,
        year: year,
        month: month,
      });
    }
  };

  const [hoveredChapter, setHoveredChapter] = useState(null);
  const ChapterBox = ({ thisMock }) => {
    return (
      <CHAPTERSCOPE.ChapterLine
        key={thisMock.csatId}
        $level={1}
        onMouseEnter={() => setHoveredChapter(thisMock.csatId)}
        onMouseLeave={() => setHoveredChapter(null)}
        onClick={() => {
          onChapterClick(thisMock);
        }}
      >
        <CHAPTERSCOPE.DescriptionBox
          $isHovering={hoveredChapter === thisMock.csatId || currentMock.csatId === thisMock.csatId}
        >
          <FontAwesomeIcon
            icon={currentMock.csatId === thisMock.csatId ? solidFaSquare : regularFaSquare}
            style={{ marginRight: "1rem" }}
          />
          {thisMock.publisher}
        </CHAPTERSCOPE.DescriptionBox>
      </CHAPTERSCOPE.ChapterLine>
    );
  };

  return (
    <SELECTCHAP.Wrapper>
      <SELECTCHAP.ListOptionLine>
        {[0, 1, 2].map((opt) => (
          <SELECTCHAP.ListOptionBtn
            key={`listOption_${opt}`}
            $order={opt}
            $isSelected={opt === 2}
            onClick={() => {
              setQuestionCategory(opt);
            }}
          >
            {categorySet[opt]}
          </SELECTCHAP.ListOptionBtn>
        ))}
      </SELECTCHAP.ListOptionLine>
      <SCHOOLSEM.RowContainer>
        <DROPDOWN.Container $width={15}>
          <DROPDOWN.Label
            $width={15}
            onClick={() => {
              setShowDropdown((prev) => !prev);
            }}
          >
            {year}년
            <DROPDOWN.Btn>
              <FontAwesomeIcon icon={faCaretDown} />
            </DROPDOWN.Btn>
          </DROPDOWN.Label>
          {showDropDown && (
            <DROPDOWN.OptionWrapper $width={15.5}>
              {Array.from({ length: thisYear - standardOfYear + 1 }, (_, index) => (
                <DROPDOWN.Option
                  key={`year${index}`}
                  $width={15.5}
                  onClick={() => {
                    setYear(thisYear - index);
                    setShowDropdown(false);
                  }}
                >
                  {thisYear - index}년
                </DROPDOWN.Option>
              ))}
            </DROPDOWN.OptionWrapper>
          )}
        </DROPDOWN.Container>
      </SCHOOLSEM.RowContainer>
      <SCHOOLSEM.RowContainer>
        <SCHOOLSEM.SemsterOptionContainer>
          {[3, 4, 5, 6, 7, 9, 10, 11].map((opt, index) => (
            <SCHOOLSEM.DetailBtn
              style={{ width: `4.55rem` }}
              key={`month_${index}`}
              $isSelected={month === opt}
              onClick={() => {
                setMonth(opt);
              }}
            >
              {opt}
            </SCHOOLSEM.DetailBtn>
          ))}
        </SCHOOLSEM.SemsterOptionContainer>
      </SCHOOLSEM.RowContainer>

      <SCHOOLSEM.RowContainer>{gradesUponSchool()}</SCHOOLSEM.RowContainer>

      <SCHOOLSEM.GrayContainer>
        <DROPDOWN.Container style={{ marginLeft: "auto", marginRight: "2rem", backgroundColor: "white" }} $width={15}>
          <DROPDOWN.Label
            $width={15}
            onClick={() => {
              setShowPublisherDD((prev) => !prev);
            }}
          >
            출판사 추가
            <DROPDOWN.Btn>
              <FontAwesomeIcon icon={faCaretDown} />
            </DROPDOWN.Btn>
          </DROPDOWN.Label>
          {showPublisherDD && (
            <DROPDOWN.OptionWrapper $width={15.5}>
              {publishers.map((publisher, index) => (
                <DROPDOWN.Option
                  key={`pub${index}`}
                  $width={15.5}
                  onClick={async () => {
                    await postAddMock(year, month, koToEng[grade], semester, publisher.name);
                    await postLookupMock(koToEng[grade], year, month);
                  }}
                  disabled={publisher.selected}
                >
                  {publisher.name}
                </DROPDOWN.Option>
              ))}
            </DROPDOWN.OptionWrapper>
          )}
        </DROPDOWN.Container>
      </SCHOOLSEM.GrayContainer>

      <CHAPTERSCOPE.ScopeSection>
        {simpleChapter.length > 0 &&
          simpleChapter.map(
            (chap) =>
              chap.subjectNum === semester &&
              chap.publisher !== "응애" && (
                <CHAPTERSCOPE.ChapterContainer key={chap.csatId}>
                  <ChapterBox thisMock={chap} />
                </CHAPTERSCOPE.ChapterContainer>
              )
          )}
      </CHAPTERSCOPE.ScopeSection>
    </SELECTCHAP.Wrapper>
  );
};

export default MockList;

const leftSectionWidth = `47.5rem`;
const SELECTCHAP = {
  Wrapper: styled.div`
    background-color: white;
    width: ${leftSectionWidth};
    height: 80rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    margin-right: 1.5rem;
    overflow: hidden;
  `,
  ListOptionLine: styled.div`
    width: ${leftSectionWidth};
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
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
const SCHOOLSEM = {
  RowContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${leftSectionWidth};
    height: 6rem;
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  GrayContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${leftSectionWidth};
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.background};
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
    font-size: 1.75rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: white;
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : `white`)};
    &:hover {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.mainColor};
    }
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
};

const CHAPTERSCOPE = {
  ScopeSection: styled.div`
    //border-top: 5rem solid ${({ theme }) => theme.colors.background};
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
  ChapterContainer: styled.div`
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: "opacity,transform";
    opacity: ${(props) => (props.isMovingUp || props.isMovingDown ? 0.0 : 1)};
    transform: ${(props) =>
      props.isMovingUp ? "translateY(-10px)" : props.isMovingDown ? "translateY(10px);" : "translateY(0)"};
  `,

  ChapterLine: styled.div`
    width: ${({ $level }) => 47 - $level * 2.5}rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    margin-left: ${({ $level }) => $level * 2.5}rem;
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
    width: 35rem;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray40};
          `};
  `,
  AddLine: styled.div`
    width: 43.5rem;
    margin-left: 2rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  AddBtn: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 0.75rem;
    font-size: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
};

const DROPDOWN = {
  Container: styled.div`
    height: 4.5rem;
    width: ${({ $width }) => `${$width + 1.5}rem`};
    border-radius: 0.6rem;
    justify-items: right;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    padding-left: 1.5rem;
    margin-left: 2rem;
  `,
  Label: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    height: 4.5rem;
    font-size: 1.8rem;
    font-weight: 700;
    padding-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.gray70};
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    cursor: pointer;
  `,
  Btn: styled.button`
    height: 4.5rem;
    min-width: 3rem;
    font-size: 1.6rem;
    font-weight: 400;
    margin-left: auto;
    margin-top: 0.5rem;
  `,
  OptionWrapper: styled.div`
    position: relative;
    width: ${({ $width }) => `${$width + 1}rem`};
    z-index: 5; /* Ensure the dropdown is above other elements */
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.6rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.colors.background};
    margin-left: -1.5rem;
    padding-bottom: 0.5rem;
  `,
  Option: styled.button`
    width: ${({ $width }) => `${$width}rem`};
    height: 3.25rem;
    font-weight: 600;
    font-size: 1.6rem;
    background-color: white;
    color: ${({ theme }) => theme.colors.gray70};
    border-radius: 0.4rem;
    margin-top: 0.5rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.brightMain};
      color: ${({ theme }) => theme.colors.mainColor};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray20};
      color: white;
      cursor: default;
    }
  `,
};
