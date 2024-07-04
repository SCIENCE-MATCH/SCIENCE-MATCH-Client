import { useState, useEffect } from "react";
import styled from "styled-components";

import usePostGetChapters from "../../../../../libs/apis/Teacher/Prepare/postGetChapters";

const SelectCategory = ({ school, setSchool, semester, setSemester, subject, setSubject, setSimpleChapters }) => {
  const { chapterData, getChapters } = usePostGetChapters();

  const [justRendered, setJustRendered] = useState(true);
  const [chapters, setChapters] = useState([]);

  const gradeToKr = { FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5, SIXTH: 6 };
  const [grade, setGrade] = useState(gradeToKr[semester.slice(0, -1)]);
  const [tempSemester, setTempSemester] = useState(1);
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
    setTempSemester(opt);
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
          <SCHOOLSEM.RoundBtn $isSelected={tempSemester === 1} onClick={() => changeSemester(1)}>
            1
          </SCHOOLSEM.RoundBtn>
          <SCHOOLSEM.RoundBtn $isSelected={tempSemester === 2} onClick={() => changeSemester(2)}>
            2
          </SCHOOLSEM.RoundBtn>
        </SCHOOLSEM.SemesterContainer>
      </SCHOOLSEM.SemsterOptionContainer>
    );
  };

  const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
  const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
  const semToEng = ["FIRST1", "SECOND1"];
  useEffect(() => {
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${semToEng[tempSemester - 1]}`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${tempSemester}`;
    }
    setSemester(sem);
    setSubject(sub);

    setChapters([]);
    getChapters(school, sem, sub);
  }, [school, grade, tempSemester]);

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

  useEffect(() => {
    setChapters([]);
    getChapters(school, semester, subject);
  }, [school, semester, subject]);

  useEffect(() => {
    setChapters(chapterData);
  }, [chapterData]);

  useEffect(() => {
    if (justRendered) {
      setJustRendered(false);
    } else {
      simplifyChapter();
    }
  }, [chapters]);
  return (
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
      {gradesUponSchool()}
    </SCHOOLSEM.RowContainer>
  );
};

export default SelectCategory;

const SCHOOLSEM = {
  RowContainer: styled.div`
    width: 86.5rem;
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
    background-color: white;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray20};
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
    width: 44.5rem;
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
