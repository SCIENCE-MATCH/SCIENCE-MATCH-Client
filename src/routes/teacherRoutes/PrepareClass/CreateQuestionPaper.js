import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Styles from "./CreateQuestionPaper.module.css";
import ChapterBox from "../../../components/Admin/ChapterBox";
import IconBtn from "../../../components/_Elements/IconBtn";

const CreateQuestionPaper = ({ closeModal }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("unitType");
  const [procedure, setProsedure] = useState(1);

  const [quesNum, setQuesNum] = useState(25);
  const [paperDifficulty, setPaperDifficulty] = useState("중");
  const [quesTypes, setQuesTypes] = useState("전체");
  const [mockIncluded, setMockIncluded] = useState("모의고사 포함");

  const [school, setSchool] = useState("초");
  const [selectedSem, setSelectedSem] = useState("THIRD1");
  const [semester, setSemester] = useState("THIRD1");
  const [subject, setSubject] = useState("SCIENCE");
  const [chapters, setChapters] = useState([]);
  const dataPost = {
    school: school,
    semester: semester,
    subject: subject,
  };

  //출제 범위 설정
  const changeSchool = (e) => {
    setSchool(e.target.value);
    switch (e.target.value) {
      case "초":
        setSelectedSem("THIRD1");
        break;
      default:
        setSelectedSem("FIRST1");
        break;
    }
  };
  const createPaperSequence = () => {
    switch (procedure) {
      case 1:
        return <div>학습지 종류 및 범위 선택</div>;
      case 2:
        return <div>학습지 상세 편집</div>;
      case 3:
        return <div>학습지 설정</div>;
    }
  };

  const schoolOptions = ["초", "중", "고"];
  const semesterOptions_Ele = ["THIRD1", "THIRD2", "FOURTH1", "FOURTH2", "FIFTH1", "FIFTH2", "SIXTH1", "SIXTH2"];
  const semesterTexts_Ele = ["3-1", "3-2", "4-1", "4-2", "5-1", "5-2", "6-1", "6-2"];
  const semesterOptions_Mid = ["FIRST1", "FIRST2", "SECOND1", "SECOND2", "THIRD1", "THIRD2"];
  const semesterTexts_Mid = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"];
  const semesterOptions_H = ["FIRST1", "FIRST2", "P1", "P2", "C1", "C2", "B1", "B2", "E1", "E2"];
  const semesterTexts_H = ["1-1", "1-2", "물-1", "물-2", "화-1", "화-2", "생-1", "생-2", "지-1", "지-2"];
  const changeGrade = (e) => {
    setSelectedSem(e.target.value);
  };
  const gradesUponSchool = () => {
    switch (school) {
      case "초":
        return (
          <div>
            {semesterOptions_Ele.map((opt, index) => (
              <button
                className={selectedSem == opt ? Styles.selectedSemesterBtn : Styles.semesterBtn}
                value={opt}
                onClick={changeGrade}
              >
                {semesterTexts_Ele[index]}
              </button>
            ))}
          </div>
        );
      case "중":
        console.log("중등 선택");
        return (
          <div>
            {semesterOptions_Mid.map((opt, index) => (
              <button
                className={selectedSem == opt ? Styles.selectedSemesterBtn : Styles.semesterBtn}
                value={opt}
                onClick={changeGrade}
              >
                {semesterTexts_Mid[index]}
              </button>
            ))}
          </div>
        );
      case "고":
        return (
          <div>
            {semesterOptions_H.map((opt, index) => (
              <button
                className={selectedSem == opt ? Styles.selectedSemesterBtn : Styles.semesterBtn}
                value={opt}
                onClick={changeGrade}
              >
                {semesterTexts_H[index]}
              </button>
            ))}
          </div>
        );
    }
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
      setChapters(response.data.data);
      console.log(response);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };
  const setDataPost = () => {
    dataPost.school = "ELEMENTARY";
    dataPost.semester = semester;
    dataPost.subject = subject;
  };

  const [selectedChapters, setSelectedChapters] = useState([]);

  const onChapterClick = (index) => {
    if (index == 3) {
    }
  };

  const chapterBox = ({ thisChap, index }) => {
    const isChapterSelected = selectedChapters.includes(thisChap);
    return <div>{isChapterSelected ? <IconBtn icon="check" checked={true} /> : <button></button>}</div>;
  };
  const RenderChapter = () => {
    return (
      <div>
        {chapters.map((childChap, index) => (
          <div>{chapterBox()}</div>
        ))}
      </div>
    );
  };
  const TypeAndScope = () => {
    switch (activeMenu) {
      case "unitType":
        return (
          <div className={Styles.rowContainer}>
            <div style={{ width: 150 }}>
              <div className={Styles.btnContainer}>
                {schoolOptions.map((opt) => (
                  <button
                    className={school == opt ? Styles.selectedDetailBtn : Styles.detailBtn}
                    value={opt}
                    onClick={changeSchool}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {gradesUponSchool()}
          </div>
        );
      case "textbook":
        return <div>시중교재 컨텐츠...</div>;
      case "exam":
        return <div>수능/모의고사 컨텐츠...</div>;
      default:
        return <div>기본 컨텐츠...</div>;
    }
  };

  //문제지 설정
  const quesNumOptions = [25, 50, 75, 100];
  const difficultyOptions = ["하", "중하", "중", "중상", "상"];
  const quesTypeOptions = ["전체", "객관식", "주관식/서술형"];
  const mockOptions = ["모의고사 포함", "모의고사 제외", "모의고사만"];
  const changeQuesNum = (e) => {
    const value = Math.max(0, Math.min(150, Number(e.target.value)));
    setQuesNum(value);
  };
  const changeDifficulty = (e) => {
    setPaperDifficulty(e.target.value);
  };
  const changeQuesTypes = (e) => {
    setQuesTypes(e.target.value);
  };
  const changeIncludeM = (e) => {
    setMockIncluded(e.target.value);
  };

  useEffect(() => {
    setDataPost();
    getChapters();
  }, [semester, subject]);

  return (
    <div className={Styles["modal-overlay"]}>
      <div className={Styles.modal}>
        <div className={Styles["navigationBar"]}>
          {createPaperSequence()}
          <button className={Styles.closebutton} onClick={closeModal}>
            닫기
          </button>
        </div>
        <div className={Styles.main}>
          <div className={Styles["categorySection"]}>
            {/* 왼쪽 메뉴 버튼들 */}
            <button onClick={() => setActiveMenu("unitType")}>단원 유형별</button>
            <button onClick={() => setActiveMenu("textbook")}>시중교재</button>
            <button onClick={() => setActiveMenu("exam")}>수능/모의고사</button>
            {/* 추가 버튼들이 여기에 포함될 수 있습니다. */}
            {TypeAndScope()}

            {RenderChapter()}
          </div>
          <div className={Styles["questionSettings"]}>
            <div>문제수 설정</div>
            <div className={Styles.btnContainer}>
              {quesNumOptions.map((opt) => (
                <button
                  className={quesNum == opt ? Styles.selectedDetailBtn : Styles.detailBtn}
                  value={opt}
                  onClick={changeQuesNum}
                >
                  {opt}
                </button>
              ))}
              <input className={Styles.inputNumber} type="number" value={quesNum} onChange={changeQuesNum} />
              문제
            </div>
            <input type="range" min="0" max="150" value={quesNum} onChange={changeQuesNum} />
            <div>난이도</div>
            <div className={Styles.btnContainer}>
              {difficultyOptions.map((opt) => (
                <button
                  className={paperDifficulty == opt ? Styles.selectedDetailBtn : Styles.detailBtn}
                  value={opt}
                  onClick={changeDifficulty}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div>
              문제 타입<a>자동 채점</a>
            </div>
            <div className={Styles.btnContainer}>
              {quesTypeOptions.map((opt) => (
                <button
                  className={quesTypes == opt ? Styles.selectedDetailBtn : Styles.detailBtn}
                  value={opt}
                  onClick={changeQuesTypes}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div>모의고사 포함 여부</div>
            <div className={Styles.btnContainer}>
              {mockOptions.map((opt) => (
                <button
                  className={mockIncluded == opt ? Styles.selectedDetailBtn : Styles.detailBtn}
                  value={opt}
                  onClick={changeIncludeM}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {/*end of questionSettings */}
        </div>
        <button>다음 단계</button>
      </div>
    </div>
  );
};

export default CreateQuestionPaper;
