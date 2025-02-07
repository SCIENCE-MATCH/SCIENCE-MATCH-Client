import { useEffect, useState } from "react";
import styled from "styled-components";
import ManageStudent from "../components/Teacher/Management/ManageStudent";
import ManageQuestionPaper from "../components/Teacher/PrepareClass/QuestionPaper/ManageQuestionPaper.jsx";
import TeacherHeader from "../components/Teacher/TeacherHeader";
import MyPage from "../components/Teacher/More/MyPage";
import PrepareOneOnOneQuiz from "../components/Teacher/PrepareClass/OneOnOneQuiz/OneOnOneQuiz.jsx";
import LearningDetail from "../components/Teacher/Class/LearningDetail.jsx";
import OneOnOneQuiz from "../components/Teacher/Class/1-1Quiz/OneOnOneQuiz.jsx";
import ReportPage from "../components/Teacher/Class/ReportPage.jsx";
import ManageTeam from "../components/Teacher/Management/ManageTeam.jsx";
import StudentsAndTeams from "../components/Teacher/Class/StudentsAndTeams.jsx";
import ClassQuestionPaper from "../components/Teacher/Class/QuesPaper/QuestionPaper.jsx";
import { useNavigate } from "react-router";

const Teacher = () => {
  const navigate = useNavigate();
  const [activeTab, setTab] = useState("수업");
  const [activeSubTab, setSubTab] = useState("학습내역");
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [studentInfo, setStudentInfo] = useState({ name: "", grade: "" });
  const isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    alert("이 페이지는 모바일에서 접근할 수 없습니다.");
    navigate("/"); // 리다이렉트할 페이지 경로
  }
  useEffect(() => {
    setCurrentStudentId(null);
  }, []);

  const handleReturnCom = () => {
    switch (activeTab) {
      case "수업 준비":
        switch (activeSubTab) {
          case "학습지":
            return <ManageQuestionPaper />;
          case "1:1 질문지":
            return <PrepareOneOnOneQuiz />;
          default:
            return <div>새로고침 해주세요.</div>;
        }
      case "수업":
        switch (activeSubTab) {
          case "학습내역":
            return (
              <Te.RenderSection>
                <StudentsAndTeams setStudentInfo={setStudentInfo} setCurrentStudentId={setCurrentStudentId} />
                <LearningDetail studentId={currentStudentId} />
              </Te.RenderSection>
            );
          case "학습지":
            return (
              <Te.RenderSection>
                <StudentsAndTeams setStudentInfo={setStudentInfo} setCurrentStudentId={setCurrentStudentId} />
                <ClassQuestionPaper studentId={currentStudentId} studentInfo={studentInfo} />
              </Te.RenderSection>
            );
          case "1:1 질문지":
            return (
              <Te.RenderSection>
                <StudentsAndTeams setStudentInfo={setStudentInfo} setCurrentStudentId={setCurrentStudentId} />
                <OneOnOneQuiz studentId={currentStudentId} />
              </Te.RenderSection>
            );
          case "보고서":
            return (
              <Te.RenderSection>
                <StudentsAndTeams setStudentInfo={setStudentInfo} setCurrentStudentId={setCurrentStudentId} />
                <ReportPage studentId={currentStudentId} />
              </Te.RenderSection>
            );
          default:
            return <div>새로고침 해주세요.</div>;
        }
      case "관리":
        switch (activeSubTab) {
          case "학생관리":
            return <ManageStudent />;
          case "반관리":
            return <ManageTeam />;
          default:
            return <div>새로고침 해주세요.</div>;
        }
      case "MyPage":
        return <MyPage />;
      default:
        return <div>새로고침 해주세요.</div>;
    }
  };
  return (
    <Te.Wrapper>
      <TeacherHeader activeTab={activeTab} setTab={setTab} activeSubTab={activeSubTab} setSubTab={setSubTab} />
      <Te.MainComponent>{handleReturnCom()}</Te.MainComponent>
    </Te.Wrapper>
  );
};

export default Teacher;

const Te = {
  Wrapper: styled.div`
    height: 100vh;
    overflow-y: auto;

    background-color: ${({ theme }) => theme.colors.brightGray};
  `,
  MainComponent: styled.div`
    display: flex;
    flex-direction: column;
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
