import { useState, useEffect } from "react";
import { getCookie } from "../../../libs/cookie";
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
  faUser,
  faUserGroup,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const StudentsAndTeams = ({ setCurrentStudentId, setStudentInfo }) => {
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

  const [viewSearchBar, setViewSearchBar] = useState(false);

  const openSearchBar = () => {
    setViewSearchBar(true);
    setNameSearchKey("");
  };
  const closeSearchBar = () => {
    setViewSearchBar(false);
    setNameSearchKey("");
  };
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
      allStuds = response.data.data.allStudents;
    } catch (error) {
      // API 요청이 실패한 경우
      alert("학생 정보를 불러오지 못했습니다.");
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
    }
    console.log(allStuds);
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

  const onKeyChange = (e) => {
    setNameSearchKey(e.target.value);
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
  const extendAll = () => {
    if (viewTeams) {
      let tempTeams = [...teams];
      for (let i = 0; i < tempTeams.length; i++) {
        tempTeams[i].extended = true;
      }
      setTeams(tempTeams);
    } else {
      let tempGrades = [...grades];
      for (let i = 0; i < tempGrades.length; i++) {
        tempGrades[i].extended = true;
      }
      setGrades(tempGrades);
    }
  };
  const closeAll = () => {
    let tempTeams = [...teams];
    for (let i = 0; i < tempTeams.length; i++) {
      tempTeams[i].extended = true;
    }
    setTeams(tempTeams);
    let tempGrades = [...grades];
    for (let i = 0; i < tempGrades.length; i++) {
      tempGrades[i].extended = false;
    }
    setGrades(tempGrades);
  };

  useEffect(() => {
    if (nameSearchKey === "") {
      setGTR(grades); //gradesToRender
      setTeamsToRender(teams);
    } else {
      if (viewTeams) {
        const tempTeams = teams.filter(
          (team) => team.name.includes(nameSearchKey) || team.teacherName.includes(nameSearchKey)
        );
        setTeamsToRender(tempTeams);
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

  const [selectedStudent, setSelectedStudent] = useState({ id: null, name: null });
  const selectStud = (stud, grade) => {
    setSelectedStudent(stud);
    setCurrentStudentId(stud.id);
    setStudentInfo({ name: stud.name, grade: grade.grade });
  };

  useEffect(() => {
    if (selectedStudent.id === null) {
      for (let i = 0; i < grades.length; i++) {
        if (grades[i].students.length > 0) {
          extendGrade(grades[i]);
          setSelectedStudent(grades[i].students[0]);
          setCurrentStudentId(grades[i].students[0].id);
          setStudentInfo({ name: grades[i].students[0].name, grade: grades[i].grade });
          break;
        }
      }
    }
  }, [grades, selectedStudent]);

  return (
    <StudTeamList.Wrapper>
      <StudTeamList.CurrentStudBox>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: `0.5rem` }} />
        {selectedStudent.name} 학생 수업
      </StudTeamList.CurrentStudBox>
      <StudTeamList.StudList>
        <StudTeamList.ListOptionLine>
          <StudTeamList.ListOptionBtn
            $isSelected={viewTeams === false}
            onClick={() => {
              setViewTeams(false);
              closeAll();
            }}
          >
            학년
          </StudTeamList.ListOptionBtn>
          <StudTeamList.ListOptionBtn
            $isSelected={viewTeams === true}
            onClick={() => {
              setViewTeams(true);
              closeAll();
            }}
          >
            반
          </StudTeamList.ListOptionBtn>
        </StudTeamList.ListOptionLine>
        {viewSearchBar ? (
          <StudTeamList.BtnLine>
            <StudTeamList.SearchBox>
              <StudTeamList.SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </StudTeamList.SearchIcon>
              <StudTeamList.SearchInput
                value={nameSearchKey}
                onChange={onKeyChange}
                maxLength="10"
                placeholder={viewTeams ? "반 / 선생님 이름" : "학생 이름"}
              />
              <StudTeamList.XBtn onClick={closeSearchBar}>
                <FontAwesomeIcon icon={faXmark} />
              </StudTeamList.XBtn>
            </StudTeamList.SearchBox>
          </StudTeamList.BtnLine>
        ) : (
          <StudTeamList.BtnLine>
            <StudTeamList.SmallBtn onClick={extendAll}>전체 열기</StudTeamList.SmallBtn>
            <StudTeamList.SmallBtn onClick={openSearchBar}>검색</StudTeamList.SmallBtn>
          </StudTeamList.BtnLine>
        )}
        <StudTeamList.WholeList>
          {viewTeams
            ? teamsToRender.map((team, index) => (
                <StudTeamList.GradeContainer key={index}>
                  <StudTeamList.GradeLine
                    onClick={() => {
                      extendTeam(team);
                      console.log(teamsToRender);
                    }}
                  >
                    <StudTeamList.ExtendBtn>
                      <FontAwesomeIcon icon={team.extended ? faCaretDown : faCaretRight} />
                    </StudTeamList.ExtendBtn>
                    <StudTeamList.GradeLabel>{team.name}</StudTeamList.GradeLabel>
                    <StudTeamList.NumberLabel>{team.studentNum}명</StudTeamList.NumberLabel>
                  </StudTeamList.GradeLine>
                  {team.extended && (
                    <div>
                      {team.students.map((stud) => (
                        <StudTeamList.StudentLine
                          key={stud.id}
                          onClick={() => {
                            selectStud(stud, stud.grade);
                          }}
                        >
                          <StudTeamList.StudentLabel $isSelected={selectedStudent.id === stud.id}>
                            {stud.name}
                          </StudTeamList.StudentLabel>
                        </StudTeamList.StudentLine>
                      ))}
                    </div>
                  )}
                </StudTeamList.GradeContainer>
              ))
            : gradesToRender.map(
                (grade, index) =>
                  grade.students.length > 0 && (
                    <StudTeamList.GradeContainer key={index}>
                      <StudTeamList.GradeLine
                        onClick={() => {
                          extendGrade(grade);
                        }}
                      >
                        <StudTeamList.ExtendBtn>
                          <FontAwesomeIcon icon={grade.extended ? faCaretDown : faCaretRight} />
                        </StudTeamList.ExtendBtn>
                        <StudTeamList.GradeLabel>{grade.grade}</StudTeamList.GradeLabel>
                        <StudTeamList.NumberLabel>{grade.students.length}명</StudTeamList.NumberLabel>
                      </StudTeamList.GradeLine>
                      {/* {grade.extended && (
                        <StudTeamList.StudentLine>
                          <StudTeamList.StudentLabel>
                            {`전체  `}
                            <FontAwesomeIcon icon={faUsers} />
                          </StudTeamList.StudentLabel>
                        </StudTeamList.StudentLine>
                      )} */}
                      {grade.extended &&
                        grade.students.map((stud) => (
                          <StudTeamList.StudentLine
                            key={stud.id}
                            onClick={() => {
                              selectStud(stud, grade);
                            }}
                          >
                            <StudTeamList.StudentLabel $isSelected={selectedStudent.id === stud.id}>
                              {stud.name}
                            </StudTeamList.StudentLabel>
                          </StudTeamList.StudentLine>
                        ))}
                    </StudTeamList.GradeContainer>
                  )
              )}
        </StudTeamList.WholeList>
      </StudTeamList.StudList>
    </StudTeamList.Wrapper>
  );
};
export default StudentsAndTeams;
const StudTeamList = {
  Wrapper: styled.div`
    width: 20rem;
    height: 80rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1.5rem;
  `,
  CurrentStudBox: styled.div`
    width: 100%;
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.gray13};
    color: ${({ theme }) => theme.colors.gray80};
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  `,
  SearchBox: styled.div`
    width: 20rem;
    height: 4rem;
    display: flex;
    flex-direction: row;
    font-size: 1.5rem;
    font-weight: 500;
    overflow: hidden;
    background-color: white;
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
    width: 13rem;
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
  StudList: styled.div`
    width: 20rem;
    border-radius: 0.6rem;
    display: flex;
    flex-direction: column;
  `,
  ListOptionLine: styled.div`
    width: 20rem;
    height: 4.5rem;
    display: flex;
    flex-direction: row;
  `,
  ListOptionBtn: styled.button`
    width: 15rem;
    height: 4.5rem;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? `white` : theme.colors.gray00)};
    border: ${({ $isSelected, theme }) => ($isSelected ? `0.1rem solid ${theme.colors.gray30}` : `none`)};
    border-bottom: ${({ $isSelected, theme }) => ($isSelected ? `none` : `0.1rem solid ${theme.colors.gray30}`)};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
  `,
  BtnLine: styled.div`
    width: 100%;
    height: 5rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-inline: ${({ theme }) => `0.1rem solid ${theme.colors.gray30}`};
  `,
  SmallBtn: styled.button`
    width: 8rem;
    height: 3.2rem;
    margin-inline: 0.5rem;
    font-size: 1.3rem;
    font-weight: 400;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.1rem solid ${({ theme }) => theme.colors.gray15};
  `,
  WholeList: styled.div`
    width: 20rem;
    height: 64.5rem;
    overflow-y: hidden;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 0rem 0rem 0.6rem 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    border-top: none;
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
    width: 20rem;
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
    font-size: 1.5rem;
    font-weight: 700;
    margin-left: 0.5rem;
  `,
  NumberLabel: styled.div`
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray60};
    margin-left: auto;
    margin-right: 2rem;
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
    height: 5.5rem;
    width: 20rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-block: 0.05rem solid ${({ theme }) => theme.colors.gray05};
    padding-left: 2.5rem;
    background-color: white;
  `,
  StudentLabel: styled.div`
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 400)};

    margin-left: 0.5rem;
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray80)};
  `,
};
