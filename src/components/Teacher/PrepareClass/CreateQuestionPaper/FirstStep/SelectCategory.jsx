import { useState, useEffect } from "react";
import { getCookie } from "../../../../../libs/cookie";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Axios from "axios";

const SelectCategory = ({ school, setSchool, semester, setSemester, subject, setSubject, setSimpleChapters }) => {
  const navigate = useNavigate();

  const [justRendered, setJustRendered] = useState(true);
  const [chapters, setChapters] = useState([]);
  const dataPost = {
    school: school,
    semester: semester,
    subject: subject,
  };
  const changeSchool = (e) => {
    setSchool(e.target.value);
    switch (e.target.value) {
      case "초":
        setSemester("THIRD1");
        break;
      default:
        setSemester("FIRST1");
        break;
    }
  };

  const schoolOptions = ["초", "중", "고"];
  const semesterOptions_Ele = ["THIRD1", "THIRD2", "FOURTH1", "FOURTH2", "FIFTH1", "FIFTH2", "SIXTH1", "SIXTH2"];
  const semesterTexts_Ele = ["3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2"];
  const semesterOptions_Mid = ["FIRST1", "FIRST2", "SECOND1", "SECOND2", "THIRD1", "THIRD2"];
  const semesterTexts_Mid = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"];
  const semesterOptions_H = ["FIRST1", "FIRST2", "P1", "P2", "C1", "C2", "B1", "B2", "E1", "E2"];
  const semesterOptions_High_for_send = [
    "FIRST1",
    "FIRST2",
    "FIRST1",
    "SECOND1",
    "FIRST1",
    "SECOND1",
    "FIRST1",
    "SECOND1",
    "FIRST1",
    "SECOND1",
  ];
  const subjectOptions_for_send = [
    "SCIENCE",
    "SCIENCE",
    "PHYSICS",
    "PHYSICS",
    "CHEMISTRY",
    "CHEMISTRY",
    "BIOLOGY",
    "BIOLOGY",
    "EARTH_SCIENCE",
    "EARTH_SCIENCE",
  ];
  const semesterTexts_H = ["1-1", "1-2", "물-1", "물-2", "화-1", "화-2", "생-1", "생-2", "지-1", "지-2"];
  const changeGrade = (opt, index) => {
    setSemester(opt);
    switch (school) {
      case "초":
        setSemester(semesterOptions_Ele[index]);
        break;
      case "중":
        setSemester(semesterOptions_Mid[index]);
        break;
      case "고":
        setSemester(semesterOptions_High_for_send[index]);
        setSubject(subjectOptions_for_send[index]);
        break;
    }
  };
  const gradesUponSchool = () => {
    let tempOpts = [];
    let tempText = [];
    switch (school) {
      case "초":
        tempOpts = semesterOptions_Ele;
        tempText = semesterTexts_Ele;
        break;
      case "중":
        tempOpts = semesterOptions_Mid;
        tempText = semesterTexts_Mid;
        break;
      case "고":
        tempOpts = semesterOptions_H;
        tempText = semesterTexts_H;
        break;
    }
    return (
      <CQP.SemsterOptionContainer>
        {tempOpts.map((opt, index) => (
          <CQP.SemesterBtn
            key={index}
            $isSelected={semester == opt}
            value={opt}
            onClick={() => {
              changeGrade(opt, index);
            }}
          >
            {tempText[index]}
          </CQP.SemesterBtn>
        ))}
      </CQP.SemsterOptionContainer>
    );
  };

  const simplifyChapter = () => {
    const newChapters = [];
    for (let i = 0; i < chapters.length; i++) {
      const { id, description } = chapters[i];
      newChapters.push({ id, description, selected: false, expansion: false, children: [] });
      for (let j = 0; j < chapters[i].children.length; j++) {
        const { id, description } = chapters[i].children[j];
        newChapters[i].children.push({ id, description, selected: false, expansion: false, children: [] });
        for (let k = 0; k < chapters[i].children[j].children.length; k++) {
          const { id, description } = chapters[i].children[j].children[k];
          newChapters[i].children[j].children.push({ id, description, selected: false, children: [] });
        }
      }
    }
    setSimpleChapters(newChapters);
  };
  const getChapters = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/chapter/get";

      const response = await Axios.post(url, dataPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      setChapters(response.data.data);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };
  const setDataPost = () => {
    switch (school) {
      case "초":
        dataPost.school = "ELEMENTARY";
        break;
      case "중":
        dataPost.school = "MIDDLE";
        break;
      case "고":
        dataPost.school = "HIGH";
        break;
    }
    dataPost.semester = semester;
    dataPost.subject = subject;
  };

  useEffect(() => {
    setChapters([]);
    setDataPost();
    getChapters();
  }, [school, semester, subject]);

  useEffect(() => {
    if (justRendered) {
      setJustRendered(false);
    } else {
      simplifyChapter();
    }
  }, [chapters]);
  return (
    <CQP.RowContainer>
      <CQP.SchoolOptionContainer>
        <CQP.BtnContainer>
          {schoolOptions.map((opt) => (
            <CQP.DetailBtn key={opt} $isSelected={school == opt} value={opt} onClick={changeSchool}>
              {opt}
            </CQP.DetailBtn>
          ))}
        </CQP.BtnContainer>
      </CQP.SchoolOptionContainer>
      {gradesUponSchool()}
    </CQP.RowContainer>
  );
};

export default SelectCategory;

const CQP = {
  RowContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 90rem;
    height: 6rem;
    border-top: 0.05rem solid ${({ theme }) => theme.colors.background};
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.background};
  `,
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    width: 18rem;
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
    width: 4rem;
    height: 4rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    font-size: 1.6rem;
    font-weight: 400;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    border: 0.05rem solid
      ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
  `,
  SemsterOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 1rem;
  `,
  SemesterBtn: styled.button`
    flex: 1;
    width: 5.5rem;
    height: 4rem;
    border-radius: 2rem;
    margin-left: 1rem;
    font-size: 1.5rem;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.deepDark)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    border: 0.05rem solid
      ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
  `,
};
