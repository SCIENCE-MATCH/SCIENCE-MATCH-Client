import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AdminHeader from "../components/Admin/AdminHeader";

import ManageTeacher from "../components/Admin/Management/ManageTeacher";

import AddQuiz from "../components/Admin/Quiz/AddQuiz";
import SearchQuiz from "../components/Admin/Quiz/ManageQuiz";

import MainChapter from "../components/Admin/Chapter/MainChapters";
import ChangeParent from "../components/Admin/Chapter/ChangeParent";
import ChapterForNormal from "../components/Admin/Chapter/ChapterForNormal";
import ChapterForSearchBook from "../components/Admin/Chapter/ChapterForSearchBook";
import ChapterForConcept from "../components/Admin/Chapter/ChapterForConcept";

import ManageConcept from "../components/Admin/Concept/ManageConcept";

import AddNormal from "../components/Admin/Question/Add/Normal/AddNormal";
import AddTextBook from "../components/Admin/Question/Add/Book/AddTextBook";
import AddMock from "../components/Admin/Question/Add/Mock/AddMock";

import SearchNormal from "../components/Admin/Question/Search/Normal/SearchNormal";
import SearchTextBook from "../components/Admin/Question/Search/Book/SearchTextBook";
import MockList from "../components/Admin/Chapter/MockList";

const Admin = () => {
  const [activeMainTab, setActiveMainTab] = useState("회원");
  const [activeSubTab, setActiveSubTab] = useState("선생님");

  const [school, setSchool] = useState("초");
  const [grade, setGrade] = useState(3);
  const [semester, setSemester] = useState(1);

  const [currentChapter, setCurrentChapter] = useState({ id: null, description: null, school: school });
  const [selectedBook, setSelectedBook] = useState({ bookId: null, title: null });
  const [currentMock, setCurrentMock] = useState({
    csatId: null,
    publisher: null,
    grade: null,
    year: null,
    month: null,
    publisher: null,
  });
  const [questionCategory, setQuestionCategory] = useState(0);

  const [movingChapter, setMovingChapter] = useState({ id: null, description: null, parentId: null, moved: false });
  const [targetChapter, setTargetChapter] = useState({ id: null, description: null, parentId: null });

  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    setCurrentChapter({ id: null, description: null, school: school });
    //setSelectedBook({ bookId: null, title: null });
    setCurrentPage(null);
  }, [activeMainTab, activeSubTab, questionCategory]);
  const handleReturnCom = () => {
    switch (activeSubTab) {
      case "선생님":
        return (
          <Ad.MainContent>
            <ManageTeacher />
          </Ad.MainContent>
        );
      case "단원":
        return (
          <Ad.MainContent>
            <MainChapter movingChapter={movingChapter} setMovingChapter={setMovingChapter} />
            <ChangeParent
              movingChapter={movingChapter}
              setMovingChapter={setMovingChapter}
              targetChapter={targetChapter}
              setTargetChapter={setTargetChapter}
            />
          </Ad.MainContent>
        );
      case "추가":
        return handleAdd();
      case "검색":
        return handleSearch();
      case "개념":
        return (
          <Ad.MainContent>
            <ChapterForConcept
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />
            <ManageConcept chapToAdd={currentChapter} />
          </Ad.MainContent>
        );
      case "생성":
        return (
          <Ad.MainContent>
            <ChapterForConcept
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />
            <AddQuiz chapToAdd={currentChapter} />
          </Ad.MainContent>
        );
      case "조회":
        return (
          <Ad.MainContent>
            <ChapterForConcept
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />
            <SearchQuiz chapToSearch={currentChapter} school={school} grade={grade} semester={semester} />
          </Ad.MainContent>
        );
      default:
        return <div>새로고침 해주세요.</div>;
    }
  };

  const handleAdd = () => {
    return (
      <Ad.MainContent>
        {questionCategory === 0 ? (
          <React.Fragment>
            <ChapterForNormal
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              questionCategory={questionCategory}
              setQuestionCategory={setQuestionCategory}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />
            <AddNormal chapToAdd={currentChapter} />
          </React.Fragment>
        ) : questionCategory === 1 ? (
          <React.Fragment>
            <ChapterForNormal
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              questionCategory={questionCategory}
              setQuestionCategory={setQuestionCategory}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />

            <AddTextBook
              chapToAdd={currentChapter}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MockList
              currentMock={currentMock}
              setCurrentMock={setCurrentMock}
              setQuestionCategory={setQuestionCategory}
            />
            <AddMock currentMock={currentMock} />
          </React.Fragment>
        )}
      </Ad.MainContent>
    );
  };

  const handleSearch = () => {
    switch (questionCategory) {
      case 0:
        return (
          <Ad.MainContent>
            <ChapterForNormal
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              questionCategory={questionCategory}
              setQuestionCategory={setQuestionCategory}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
            />
            <SearchNormal chapToSearch={currentChapter} />
          </Ad.MainContent>
        );
      case 1:
        return (
          <Ad.MainContent>
            <ChapterForSearchBook
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              questionCategory={questionCategory}
              setQuestionCategory={setQuestionCategory}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <SearchTextBook
              chapToSearch={currentChapter}
              school={school}
              setSchool={setSchool}
              grade={grade}
              setGrade={setGrade}
              semester={semester}
              setSemester={setSemester}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              currentPage={currentPage}
            />
          </Ad.MainContent>
        );
      case 2:
        alert("모의고사 검색은 [추가]탭에서 가능합니다.");
        setActiveSubTab("추가");
      default:
        return <RQ.ErrorDiv>에러 발생</RQ.ErrorDiv>;
    }
  };

  return (
    <Ad.Wrapper>
      <AdminHeader
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      ></AdminHeader>
      {handleReturnCom()}
    </Ad.Wrapper>
  );
};

export default Admin;

const Ad = {
  Wrapper: styled.div`
    height: 100vh;
    overflow-y: auto;

    background-color: ${({ theme }) => theme.colors.brightGray};
  `,
  MainContent: styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,
  RenderSection: styled.div`
    width: 135rem;
    min-width: 135rem;
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
  `,
};

const RQ = {
  Wrapper: styled.div`
    background-color: white;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    width: 86rem;
    height: 80rem;
    overflow: hidden;
  `,
  ErrorDiv: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  `,
};
