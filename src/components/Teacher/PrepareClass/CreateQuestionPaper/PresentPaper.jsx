import { useState, useEffect } from "react";
import { getCookie } from "../../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faCircleExclamation,
  faCircleMinus,
  faCirclePlus,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const PresentPaper = ({ closeModal, paper, paperIds }) => {
  const [nameSearchKey, setNameSearchKey] = useState("");
  const emptyGrades = [
    {
      grade: "초1",
      students: [],
      extended: false,
    },
    {
      grade: "초2",
      students: [],
      extended: false,
    },
    {
      grade: "초3",
      students: [],
      extended: false,
    },
    {
      grade: "초4",
      students: [],
      extended: false,
    },
    {
      grade: "초5",
      students: [],
      extended: false,
    },
    {
      grade: "초6",
      students: [],
      extended: false,
    },
    {
      grade: "중1",
      students: [],
      extended: false,
    },
    {
      grade: "중2",
      students: [],
      extended: false,
    },
    {
      grade: "중3",
      students: [],
      extended: false,
    },
    {
      grade: "고1",
      students: [],
      extended: false,
    },
    {
      grade: "고2",
      students: [],
      extended: false,
    },
    {
      grade: "고3",
      students: [],
      extended: false,
    },
  ];

  const [grades, setGrades] = useState(emptyGrades.slice());
  const [gradesToRender, setGTR] = useState([]);

  const deepCopiedArray = JSON.parse(JSON.stringify(emptyGrades));
  const [selectedGrades, setSelectedGrades] = useState(deepCopiedArray);
  const [selectedStudIds, setSelectedStudIds] = useState([]);
  const [selectedNumber, setSelectedNum] = useState(0);

  const [viewTeams, setViewTeams] = useState(false);

  const getStudents = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/students";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tempStudents = response.data.data.filter((student) => {
        return student.deleted === false;
      });
      tempStudents.sort((a, b) => (a.name > b.name ? 1 : -1));

      const tempGrades = [...emptyGrades];
      tempStudents.map((stud) => {
        for (let i = 0; i < 12; i++) {
          if (stud.grade === tempGrades[i].grade) {
            tempGrades[i].students.push({ id: stud.id, name: stud.name });
            break;
          }
        }
      });
      setGrades(tempGrades);
      setSelectedGrades(deepCopiedArray);
      setSelectedNum(0);
      setSelectedStudIds([]);
    } catch (error) {
      // API 요청이 실패한 경우
      alert("학생 정보를 불러오지 못했습니다.");
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };
  const getDetail = async (id) => {
    let allStuds = [];
    try {
      const accessToken = getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/team/detail?groupId=${id}`;

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      allStuds = response.data.data.allStudents.map((stud) => {
        return { ...stud, selected: false };
      });
    } catch (error) {
      // API 요청이 실패한 경우
      alert("학생 정보를 불러오지 못했습니다.");
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
    return allStuds;
  };
  const [teams, setTeams] = useState([]);

  const [teamsToRender, setTeamsToRender] = useState([]);
  const getTeams = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/team";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const overallTeams = await Promise.all(
        response.data.data.map(async (team) => {
          return { ...team, extended: false, allSelected: false, students: await getDetail(team.teamId) };
        })
      );

      setTeams(overallTeams);
      setTeamsToRender(overallTeams);
    } catch (error) {
      // API 요청이 실패한 경우
      alert("학생 정보를 불러오지 못했습니다.");
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
  };

  useEffect(() => {
    getStudents();
    getTeams();
  }, []);

  const presentPapers = async () => {
    try {
      const accessToken = await getCookie("aToken");
      let payLoad = "?";
      selectedStudIds.map((studId) => (payLoad = payLoad + `studentIds=${studId}&`));

      paperIds.map((paperIds) => (payLoad = payLoad + `questionPaperIds=${paperIds}&`));
      payLoad = payLoad.slice(0, payLoad.length - 1);
      const url = `https://www.science-match.p-e.kr/teacher/question-paper/multiple-submit${payLoad}`;

      await Axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("출제 완료!");
      closeModal();
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
    }
  };

  const onKeyChange = (e) => {
    setNameSearchKey(e.target.value);
  };
  const deleteKey = () => {
    setNameSearchKey("");
  };
  const extendGrade = (grade) => {
    let tempGrades = [...grades];
    for (let i = 0; i < tempGrades.length; i++) {
      if (tempGrades[i].grade === grade.grade) {
        tempGrades[i].extended = !tempGrades[i].extended;
        break;
      }
    }
    setGrades(tempGrades);
  };
  const extendTeam = (team) => {
    let tempTeams = [...teams];
    for (let i = 0; i < tempTeams.length; i++) {
      if (tempTeams[i].teamId === team.teamId) {
        tempTeams[i].extended = !tempTeams[i].extended;
        break;
      }
    }
    setTeams(tempTeams);
  };
  const extendRightGrade = (grade) => {
    let tempSGrades = [...selectedGrades];
    for (let i = 0; i < tempSGrades.length; i++) {
      if (tempSGrades[i].grade === grade.grade) {
        tempSGrades[i].extended = !tempSGrades[i].extended;
        break;
      }
    }
    setSelectedGrades(tempSGrades);
  };

  const addGrade = (grade) => {
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    const tempStudIds = [...selectedStudIds];
    let tempNum = selectedNumber;
    const tempStuds = [];

    for (let i = 0; i < tempGrades.length; i++) {
      if (tempGrades[i].grade === grade.grade) {
        grade.students.forEach((student) => {
          tempSelectedGrades[i].students.push(student);
          tempSelectedGrades[i].extended = true;

          tempStuds.push(student);

          tempStudIds.push(student.id);
          tempNum = tempNum + 1;
        });
        tempSelectedGrades[i].students.sort((a, b) => (a.name > b.name ? 1 : -1));
        tempStuds.forEach((student) => {
          const index = tempGrades[i].students.indexOf(student);
          tempGrades[i].students.splice(index, 1);
        });
        break;
      }
    }
    const tempTeams = teams.map((team) => ({
      ...team,
      students: team.students.map((stud) => (tempStudIds.includes(stud.id) ? { ...stud, selected: true } : stud)),
    }));
    setTeams(tempTeams);
    setSelectedNum(tempNum);
    setSelectedStudIds(tempStudIds);
    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  const addStudent = (grade, student) => {
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    for (let i = 0; i < tempGrades.length; i++) {
      if (tempGrades[i].grade === grade.grade) {
        tempSelectedGrades[i].students.push(student);
        tempSelectedGrades[i].extended = true;
        tempSelectedGrades[i].students.sort((a, b) => (a.name > b.name ? 1 : -1));

        const index = tempGrades[i].students.indexOf(student);
        tempGrades[i].students.splice(index, 1);

        setSelectedNum(selectedNumber + 1);
        setSelectedStudIds([...selectedStudIds, student.id]);
        break;
      }
    }

    const tempTeams = teams.map((team) => ({
      ...team,
      students: team.students.map((stud) => (stud.id === student.id ? { ...stud, selected: true } : stud)),
    }));
    setTeams(tempTeams);

    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  const abstractGrade = (grade) => {
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    let updatedArray = selectedStudIds;
    let tempNum = selectedNumber;

    setTeams((prevTeams) =>
      prevTeams.map((team) => ({
        ...team,
        students: team.students.map((stud) =>
          selectedStudIds.includes(stud.id) ? { ...stud, selected: false } : stud
        ),
      }))
    );
    for (let i = 0; i < tempGrades.length; i++) {
      if (tempGrades[i].grade === grade.grade) {
        grade.students.forEach((student) => {
          tempGrades[i].students.push(student);
          tempGrades[i].extended = true;

          tempNum = tempNum - 1;
          updatedArray = updatedArray.filter((item) => item !== student.id);
        });
        tempGrades[i].students.sort((a, b) => (a.name > b.name ? 1 : -1));
        tempSelectedGrades[i].students = [];
        break;
      }
    }
    setSelectedNum(tempNum);
    setSelectedStudIds(updatedArray);

    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  const abstractStudent = (grade, student) => {
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    let updatedArray = selectedStudIds;

    for (let i = 0; i < tempGrades.length; i++) {
      if (tempGrades[i].grade === grade.grade) {
        tempGrades[i].students.push(student);
        tempGrades[i].extended = true;
        tempGrades[i].students.sort((a, b) => (a.name > b.name ? 1 : -1));

        const index = tempSelectedGrades[i].students.indexOf(student);
        tempSelectedGrades[i].students.splice(index, 1);

        setSelectedNum(selectedNumber - 1);
        setSelectedStudIds(updatedArray.filter((item) => item !== student.id));
        break;
      }
    }

    const tempTeams = teams.map((team) => ({
      ...team,
      students: team.students.map((stud) => (stud.id === student.id ? { ...stud, selected: false } : stud)),
    }));
    setTeams(tempTeams);
    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  const addTeam = async (team) => {
    const studs = team.students;
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    let tempSelectedStudIds = [...selectedStudIds];
    let tempSelectedNum = selectedNumber;

    studs.forEach((student) => {
      if (!student.selected) {
        for (let i = 0; i < tempGrades.length; i++) {
          if (tempGrades[i].grade === student.grade) {
            if (tempSelectedStudIds.includes(student.id)) break;
            else {
              tempSelectedGrades[i].students.push(student);
              tempSelectedGrades[i].extended = true;
              tempSelectedGrades[i].students.sort((a, b) => (a.name > b.name ? 1 : -1));

              const index = tempGrades[i].students.findIndex((s) => s.id === student.id);
              if (index !== -1) {
                tempGrades[i].students.splice(index, 1);
              }

              tempSelectedNum++;
              tempSelectedStudIds.push(student.id);
            }
            break;
          }
        }
      }
    });

    const tempTeams = teams.map((team) => ({
      ...team,
      students: team.students.map((stud) =>
        tempSelectedStudIds.includes(stud.id) ? { ...stud, selected: true } : stud
      ),
    }));
    setTeams(tempTeams);

    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
    setSelectedNum(tempSelectedNum);
    setSelectedStudIds(tempSelectedStudIds);
  };

  useEffect(() => {
    if (nameSearchKey === "") {
      const updatedTeams = teams.map((team) => {
        const allSelected = team.students.every((student) => student.selected);
        console.log("??");
        console.log(allSelected);
        return {
          ...team,
          allSelected: allSelected,
        };
      });
      setTeamsToRender(updatedTeams);
      setGTR(grades); //gradesToRender
    } else {
      if (viewTeams) {
        console.log("!!!");
        const tempTeams = teams.filter(
          (team) => team.name.includes(nameSearchKey) || team.teacherName.includes(nameSearchKey)
        );
        const updatedTeams = tempTeams.map((team) => {
          const allSelected = team.students.every((student) => student.selected);
          console.log("??");
          console.log(allSelected);
          return {
            ...team,
            allSelected: allSelected,
          };
        });
        setTeamsToRender(updatedTeams);
      } else {
        const tempGrades = grades
          .map((grade) => {
            const filteredStudents = grade.students.filter((student) => student.name.includes(nameSearchKey));

            if (filteredStudents.length > 0) {
              return { ...grade, students: filteredStudents, extended: true };
            } else {
              return null;
            }
          })
          .filter((grade) => grade !== null);
        setGTR(tempGrades);
      }
    }
  }, [grades, teams, nameSearchKey]);

  return (
    <CTEAM.ModalOverlay>
      <CTEAM.Modal>
        <CTEAM.TitleLine>
          <CTEAM.Title>학습지 {!paper && `일괄 `}출제하기</CTEAM.Title>
          <STUDandTEAMSELECTER.NumberLabel>학습지 {paperIds.length}개</STUDandTEAMSELECTER.NumberLabel>
        </CTEAM.TitleLine>
        {paper && (
          <CTEAM.ContentLine>
            <CTEAM.TextLabel>학습지 제목</CTEAM.TextLabel>
            <CTEAM.TextBox>{paper.title}</CTEAM.TextBox>
          </CTEAM.ContentLine>
        )}
        <STUDandTEAMSELECTER.Wrapper>
          <STUDandTEAMSELECTER.WholeListSection>
            <STUDandTEAMSELECTER.SearchBox>
              <STUDandTEAMSELECTER.SearchIcon
                onClick={() => {
                  console.log(teamsToRender);
                  console.log(teams);
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </STUDandTEAMSELECTER.SearchIcon>
              <STUDandTEAMSELECTER.SearchInput
                value={nameSearchKey}
                onChange={onKeyChange}
                maxLength="10"
                placeholder={viewTeams ? "반 / 선생님 이름 검색" : "학생 이름 검색"}
              />
              <STUDandTEAMSELECTER.XBtn onClick={deleteKey}>
                <FontAwesomeIcon icon={faXmark} />
              </STUDandTEAMSELECTER.XBtn>
            </STUDandTEAMSELECTER.SearchBox>
            <STUDandTEAMSELECTER.WholeListContainer>
              <STUDandTEAMSELECTER.ListOptionLine>
                <STUDandTEAMSELECTER.ListOptionBtnL
                  $isSelected={viewTeams === false}
                  onClick={() => {
                    setViewTeams(false);
                  }}
                >
                  학생
                </STUDandTEAMSELECTER.ListOptionBtnL>
                <STUDandTEAMSELECTER.ListOptionBtnR
                  $isSelected={viewTeams === true}
                  onClick={() => {
                    setViewTeams(true);
                  }}
                >
                  반
                </STUDandTEAMSELECTER.ListOptionBtnR>
              </STUDandTEAMSELECTER.ListOptionLine>
              <STUDandTEAMSELECTER.WholeList>
                {viewTeams
                  ? teamsToRender.map((team, index) => (
                      <STUDandTEAMSELECTER.GradeContainer key={index}>
                        <STUDandTEAMSELECTER.GradeLine
                          onClick={() => {
                            extendTeam(team);
                          }}
                        >
                          <STUDandTEAMSELECTER.ExtendBtn>
                            <FontAwesomeIcon icon={team.extended ? faCaretDown : faCaretRight} />
                          </STUDandTEAMSELECTER.ExtendBtn>
                          <STUDandTEAMSELECTER.GradeLabel>{team.name}</STUDandTEAMSELECTER.GradeLabel>
                          <STUDandTEAMSELECTER.NumberLabel>
                            {team.teacherName.slice(0, 4)} | {team.studentNum}명
                          </STUDandTEAMSELECTER.NumberLabel>
                          <STUDandTEAMSELECTER.PlusBtn
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              addTeam(team);
                            }}
                          >
                            <FontAwesomeIcon icon={faCirclePlus} />
                          </STUDandTEAMSELECTER.PlusBtn>
                        </STUDandTEAMSELECTER.GradeLine>
                        {team.extended &&
                          team.students.map(
                            (stud) =>
                              stud.selected === false && (
                                <STUDandTEAMSELECTER.StudentLine key={stud.id}>
                                  <STUDandTEAMSELECTER.GradeLabel>{stud.name}</STUDandTEAMSELECTER.GradeLabel>
                                  <STUDandTEAMSELECTER.PlusBtn
                                    onClick={() => {
                                      addStudent({ grade: stud.grade }, stud);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCirclePlus} />
                                  </STUDandTEAMSELECTER.PlusBtn>
                                </STUDandTEAMSELECTER.StudentLine>
                              )
                          )}
                        {team.extended && team.allSelected && (
                          <STUDandTEAMSELECTER.StudentLine>
                            <STUDandTEAMSELECTER.GradeLabel>
                              {team.students.length === 0 ? "학생이 없는 반입니다." : "모두 선택되었습니다."}
                            </STUDandTEAMSELECTER.GradeLabel>
                          </STUDandTEAMSELECTER.StudentLine>
                        )}
                      </STUDandTEAMSELECTER.GradeContainer>
                    ))
                  : gradesToRender.map(
                      (grade, index) =>
                        grade.students.length > 0 && (
                          <STUDandTEAMSELECTER.GradeContainer key={index}>
                            <STUDandTEAMSELECTER.GradeLine
                              onClick={() => {
                                extendGrade(grade);
                              }}
                            >
                              <STUDandTEAMSELECTER.ExtendBtn>
                                <FontAwesomeIcon icon={grade.extended ? faCaretDown : faCaretRight} />
                              </STUDandTEAMSELECTER.ExtendBtn>
                              <STUDandTEAMSELECTER.GradeLabel>{grade.grade}</STUDandTEAMSELECTER.GradeLabel>
                              <STUDandTEAMSELECTER.NumberLabel>
                                {grade.students.length}명
                              </STUDandTEAMSELECTER.NumberLabel>
                              <STUDandTEAMSELECTER.PlusBtn
                                onClick={() => {
                                  addGrade(grade);
                                }}
                              >
                                <FontAwesomeIcon icon={faCirclePlus} />
                              </STUDandTEAMSELECTER.PlusBtn>
                            </STUDandTEAMSELECTER.GradeLine>
                            {grade.extended &&
                              grade.students.map((stud) => (
                                <STUDandTEAMSELECTER.StudentLine key={stud.id}>
                                  <STUDandTEAMSELECTER.GradeLabel>{stud.name}</STUDandTEAMSELECTER.GradeLabel>
                                  <STUDandTEAMSELECTER.PlusBtn
                                    onClick={() => {
                                      addStudent(grade, stud);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCirclePlus} />
                                  </STUDandTEAMSELECTER.PlusBtn>
                                </STUDandTEAMSELECTER.StudentLine>
                              ))}
                          </STUDandTEAMSELECTER.GradeContainer>
                        )
                    )}
              </STUDandTEAMSELECTER.WholeList>
            </STUDandTEAMSELECTER.WholeListContainer>
          </STUDandTEAMSELECTER.WholeListSection>
          <STUDandTEAMSELECTER.SelectedListSection>
            <STUDandTEAMSELECTER.LabelLine>
              <STUDandTEAMSELECTER.GradeLabel>선택된 학생</STUDandTEAMSELECTER.GradeLabel>
              <STUDandTEAMSELECTER.NumberLabel>{`${selectedNumber}명`}</STUDandTEAMSELECTER.NumberLabel>
            </STUDandTEAMSELECTER.LabelLine>
            <STUDandTEAMSELECTER.SelectedList>
              {selectedNumber === 0 ? (
                <STUDandTEAMSELECTER.EmptyNotice>
                  <STUDandTEAMSELECTER.NumberLabel>왼쪽 목록에서</STUDandTEAMSELECTER.NumberLabel>
                  <div style={{ height: `0.5rem` }} />
                  <STUDandTEAMSELECTER.NumberLabel>
                    <FontAwesomeIcon icon={faCirclePlus} />를 눌러 선택하세요.
                  </STUDandTEAMSELECTER.NumberLabel>
                </STUDandTEAMSELECTER.EmptyNotice>
              ) : (
                selectedGrades.map(
                  (grade, index) =>
                    grade.students.length > 0 && (
                      <STUDandTEAMSELECTER.GradeContainer key={index}>
                        <STUDandTEAMSELECTER.GradeLine
                          onClick={() => {
                            extendRightGrade(grade);
                          }}
                        >
                          <STUDandTEAMSELECTER.ExtendBtn>
                            <FontAwesomeIcon icon={grade.extended ? faCaretDown : faCaretRight} />
                          </STUDandTEAMSELECTER.ExtendBtn>
                          <STUDandTEAMSELECTER.GradeLabel>{grade.grade}</STUDandTEAMSELECTER.GradeLabel>
                          <STUDandTEAMSELECTER.NumberLabel>{grade.students.length}명</STUDandTEAMSELECTER.NumberLabel>
                          <STUDandTEAMSELECTER.MinusBtn
                            onClick={() => {
                              abstractGrade(grade);
                            }}
                          >
                            <FontAwesomeIcon icon={faCircleMinus} />
                          </STUDandTEAMSELECTER.MinusBtn>
                        </STUDandTEAMSELECTER.GradeLine>
                        {grade.extended &&
                          grade.students.map((stud) => (
                            <STUDandTEAMSELECTER.StudentLine key={stud.id}>
                              <STUDandTEAMSELECTER.GradeLabel>{stud.name}</STUDandTEAMSELECTER.GradeLabel>
                              <STUDandTEAMSELECTER.MinusBtn
                                onClick={() => {
                                  abstractStudent(grade, stud);
                                }}
                              >
                                <FontAwesomeIcon icon={faCircleMinus} />
                              </STUDandTEAMSELECTER.MinusBtn>
                            </STUDandTEAMSELECTER.StudentLine>
                          ))}
                      </STUDandTEAMSELECTER.GradeContainer>
                    )
                )
              )}
            </STUDandTEAMSELECTER.SelectedList>
          </STUDandTEAMSELECTER.SelectedListSection>
        </STUDandTEAMSELECTER.Wrapper>
        <CTEAM.BtnLine>
          <CTEAM.CloseBtn onClick={closeModal}>닫기</CTEAM.CloseBtn>

          <CTEAM.SubmitBtn onClick={presentPapers} disabled={selectedStudIds.length == 0}>
            출제하기
          </CTEAM.SubmitBtn>
        </CTEAM.BtnLine>
      </CTEAM.Modal>
    </CTEAM.ModalOverlay>
  );
};

export default PresentPaper;

const CTEAM = {
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 69rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    height: 7rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
  `,
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ContentLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6rem;
  `,
  ContentBox: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,
  InputLabel: styled.div`
    height: 6rem;
    width: 10rem;
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 3rem;
    margin-right: 2rem;
    display: flex;
    align-items: center;
  `,
  TextLabel: styled.div`
    height: 4rem;
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 3rem;
    display: flex;
    align-items: center;
  `,
  TextBox: styled.div`
    flex-grow: 1;
    min-height: 5rem;
    border-radius: 0.6rem;
    margin-left: 2rem;
    margin-right: 3rem;
    padding-inline: 1.5rem;
    padding-block: 1rem;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 2.5rem;
    border: 0.1rem solid ${({ $isEmpty, theme }) => ($isEmpty ? theme.colors.warning : theme.colors.unselected)};
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    margin-top: auto;
    padding-inline: 3rem;
    padding-block: 1.5rem;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  SubmitBtn: styled.button`
    margin-left: 1rem;
    width: 13rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    margin-left: auto;
  `,
};

const STUDandTEAMSELECTER = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: row;
    padding-inline: 3rem;
    width: 69rem;
    height: 46.5rem;
    margin-top: 1rem;
  `,
  WholeListSection: styled.div`
    width: 30.1rem;
    height: 45rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  SearchBox: styled.div`
    width: 30rem;
    height: 4rem;
    border-radius: 0.6rem;
    display: flex;
    flex-direction: row;
    font-size: 1.5rem;
    font-weight: 500;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    overflow: hidden;
    margin-bottom: 1rem;
  `,
  SearchIcon: styled.div`
    width: 3.5rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-top: -0.1rem;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  SearchInput: styled.input`
    width: 23rem;
    height: 4rem;
    margin-top: -0.1rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    outline: none;
  `,
  XBtn: styled.button`
    width: 3.5rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-top: -0.1rem;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  WholeListContainer: styled.div`
    width: 30rem;
    height: 40rem;
    border-radius: 0.6rem;
    display: flex;
    flex-direction: column;
  `,
  ListOptionLine: styled.div`
    width: 30rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
  `,
  ListOptionBtnL: styled.button`
    width: 15rem;
    height: 4.5rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.gray40 : theme.colors.gray15)};
    border-bottom: none;
    border-radius: 0.6rem 0rem 0rem 0rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
  `,
  ListOptionBtnR: styled.button`
    width: 15rem;
    height: 4.5rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.gray40 : theme.colors.gray15)};
    border-bottom: none;
    border-radius: 0rem 0.6rem 0rem 0rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
  `,
  WholeList: styled.div`
    width: 30rem;
    height: 35.5rem;
    overflow-y: hidden;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 0rem 0rem 0.6rem 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray40};
    &:hover {
      overflow-y: overlay; /* 마우스를 올릴 때 수직 스크롤바 표시 */
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.gray05}; /* 스크롤 트랙을 투명하게 */
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,

  GradeContainer: styled.div`
    display: flex;
    flex-direction: column;
  `,
  GradeLine: styled.div`
    height: 5rem;
    width: 30rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.gray05};
    border-block: 0.05rem solid ${({ theme }) => theme.colors.gray20};
  `,
  ExtendBtn: styled.button`
    height: 5rem;
    width: 4rem;

    font-size: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  GradeLabel: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 0.5rem;
  `,
  NumberLabel: styled.div`
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray60};
    margin-inline: 1rem;
  `,
  PlusBtn: styled.button`
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 2rem;
    font-weight: 500;
    margin-left: auto;
    margin-right: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  MinusBtn: styled.button`
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 2rem;
    font-weight: 500;
    margin-left: auto;
    margin-right: 2rem;
    &:hover {
      color: ${({ theme }) => theme.colors.warning};
    }
  `,
  StudentLine: styled.div`
    height: 5rem;
    width: 30rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-block: 0.05rem solid ${({ theme }) => theme.colors.gray05};
    padding-left: 2.5rem;
  `,

  SelectedListSection: styled.div`
    margin-left: 3rem;
    width: 30.1rem;
    height: 45rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-radius: 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray40};
  `,
  LabelLine: styled.div`
    width: 100%;
    height: 5rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray40};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 2rem;
  `,

  SelectedList: styled.div`
    width: 30rem;
    height: 40rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &:hover {
      overflow-y: overlay; /* 마우스를 올릴 때 수직 스크롤바 표시 */
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.gray05}; /* 스크롤 트랙을 투명하게 */
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  EmptyNotice: styled.div`
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray60};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 0rem;
  `,
};
