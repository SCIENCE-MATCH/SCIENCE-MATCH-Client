import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Styles from "../../adminRoutes/Question/AddQuestion.module.css";
import ChapterStyle from "../../../components/Admin/ChapterBox.module.css";
import ChapterBoxOnlyShow from "../../../components/Teacher/ChapterBoxOnlyShow";

const ChapterOnlyShow = ({ selectedChaps, setSelectedChaps }) => {
  const history = useHistory();
  const [chapters, setChapters] = useState([]);
  const [checkAllChildren, setCheckAllChildren] = useState(false);

  //학기 정보 변수
  const [selectedSchool, setSelectedSchool] = useState("초등");
  const [selectedGrade, setSelectedGrade] = useState("3학년");
  const [selectedSemester, setSelectedSemester] = useState("1");

  const schoolForSend = ["ELEMENTARY", "MIDDLE", "HIGH"];
  const schoolOption = ["초등", "중등", "고등"];
  const gradeForSend = {
    "1학년": "FIRST1",
    "2학년": "SECOND1",
    "3학년": "THIRD1",
    "4학년": "FOURTH1",
    "5학년": "FIFTH1",
    "6학년": "SIXTH1"
  };
  const subjectForSend = {
    물리: "PHYSICS",
    화학: "CHEMISTRY",
    생명: "BIOLOGY",
    지구과학: "EARTH_SCIENCE"
  };
  const optionForElementary = ["3학년", "4학년", "5학년", "6학년"];
  const optionForMiddle = ["1학년", "2학년", "3학년"];
  const optionForHigh = ["1학년", "물리", "화학", "생명", "지구과학"];
  const semesterOption = ["1", "2"];

  const [school, setSchool] = useState("ELEMENTARY");
  const [semester, setSemester] = useState("THIRD1");
  const [subject, setSubject] = useState("SCIENCE");
  const dataPost = {
    school: school,
    semester: semester,
    subject: subject
  };

  const schoolClick = (value) => {
    if (value === "초등") {
      setSemester("THIRD1");
      setSelectedGrade("3학년");
      setSelectedSemester("1");
    } else {
      setSemester("FIRST1");
      setSelectedGrade("1학년");
      setSelectedSemester("1");
    }
    setSubject("SCIENCE");

    setSchool(schoolForSend[schoolOption.indexOf(value)]);
  };
  const gradeClick = (value) => {
    setSelectedGrade(value);
    if (gradeForSend[value]) {
      setSemester(gradeForSend[value]);
      setSelectedSemester("1");
      setSubject("SCIENCE");
    } else {
      setSubject(subjectForSend[value]);
      setSelectedSemester("1");
      setSemester("FIRST1");
    }
  };
  const semesterClick = (value) => {
    setSelectedSemester(value);
    if (subject === "SCIENCE") {
      const lastChar = semester.charAt(semester.length - 1);
      if (!isNaN(lastChar)) {
        // 마지막 문자가 숫자인지 확인
        setSemester(semester.slice(0, -1)); // 숫자인 경우 마지막 문자 제거
      }
      setSemester((prev) => prev + value);
    } else {
      setSemester(value === "1" ? "FIRST1" : "SECOND1");
    }
  };

  const getChapters = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/chapter/get";

      const response = await Axios.post(url, dataPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setChapters(response.data.data);
      console.log(response);
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response,
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        history.push("/");
      }
    }
  };

  useEffect(() => {
    setChapters([]);
    setSelectedChaps([]);
    dataPost.school = school;
    dataPost.semester = semester;
    dataPost.subject = subject;
    getChapters();
  }, [school, semester, subject]);

  return (
    <div className={Styles.chapterSection}>
      <div className={Styles.selectionBox}>
        {schoolOption.map((opt) => (
          <div
            className={`${Styles.selectionOpt0} ${
              selectedSchool === opt
                ? Styles.selectedOpt
                : Styles.nonSelectedOpt
            }`}
            onClick={() => {
              setSelectedSchool(opt);
              schoolClick(opt);
            }}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className={Styles.selectionBox}>
        {school === "ELEMENTARY"
          ? optionForElementary.map((detail) => (
              <div
                className={`${Styles.selectionOpt0} ${
                  selectedGrade === detail
                    ? Styles.selectedOpt
                    : Styles.nonSelectedOpt
                }`}
                onClick={() => {
                  gradeClick(detail);
                }}
              >
                {detail}
              </div>
            ))
          : school === "MIDDLE"
          ? optionForMiddle.map((detail) => (
              <div
                className={`${Styles.selectionOpt0} ${
                  selectedGrade === detail
                    ? Styles.selectedOpt
                    : Styles.nonSelectedOpt
                }`}
                onClick={() => {
                  gradeClick(detail);
                }}
              >
                {detail}
              </div>
            ))
          : optionForHigh.map((detail) => (
              <div
                className={`${Styles.selectionOpt0} ${
                  selectedGrade === detail
                    ? Styles.selectedOpt
                    : Styles.nonSelectedOpt
                }`}
                onClick={() => {
                  gradeClick(detail);
                }}
              >
                {detail}
              </div>
            ))}
      </div>
      <div className={Styles.selectionBox}>
        {semesterOption.map((detail) => (
          <div
            className={`${Styles.selectionOpt0} ${
              selectedSemester === detail
                ? Styles.selectedOpt
                : Styles.nonSelectedOpt
            }`}
            onClick={() => {
              semesterClick(detail);
            }}
          >
            {detail}
          </div>
        ))}
      </div>
      {chapters.map((childChap, index) => (
        <ChapterBoxOnlyShow
          level={1}
          highRank=""
          chapterNum={index + 1}
          thisChap={childChap}
          selectedChaps={selectedChaps}
          setSelectedChaps={setSelectedChaps}
          checkFromParent={checkAllChildren}
          setCheckAllChildren={setCheckAllChildren}
        />
      ))}
      [
      {selectedChaps != "" ? (
        selectedChaps.map((chap) => <a>{chap},</a>)
      ) : (
        <></>
      )}
      ]
    </div>
  );
};

export default ChapterOnlyShow;
