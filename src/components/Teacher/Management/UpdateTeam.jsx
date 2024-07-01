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
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const UpdateTeam = ({ closeModal, thisTeam }) => {
  const [teamName, setTeamName] = useState(thisTeam.name);
  const [teacherName, setTeacherName] = useState(thisTeam.teacherName);
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

  const getDetail = async () => {
    let allStuds = [];
    try {
      const accessToken = getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/team/detail?groupId=${thisTeam.teamId}`;

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
    return allStuds;
  };

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

  const initialSelect = async () => {
    const students = await getDetail();
    let ids = [];
    let num = 0;
    students.forEach((student) => {
      addStudent(student.grade, { id: student.id, name: student.name });
      ids.push(student.id);
      num = num + 1;
    });
    setSelectedStudIds(ids);
    setSelectedNum(num);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getStudents();
      await initialSelect();
    };

    fetchData();
  }, []);
  const patchTeam = async () => {
    try {
      const accessToken = await getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/team/update?groupId=${thisTeam.teamId}`;
      const data = {
        teamName: teamName,
        studentIds: selectedStudIds,
      };

      await Axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("저장 완료");
      closeModal();
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message);
    }
  };

  const onNameChange = (event) => {
    const newValue = event.target.value;
    setTeamName(newValue);
  };
  const onTNameChange = (e) => {
    setTeacherName(e.target.value);
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
    setSelectedNum(tempNum);
    setSelectedStudIds(tempStudIds);
    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  const addStudent = (grade, student) => {
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    for (let i = 0; i < tempGrades.length; i++) {
      if (tempGrades[i].grade === grade) {
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
    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  const abstractGrade = (grade) => {
    const tempGrades = [...grades];
    const tempSelectedGrades = [...selectedGrades];
    let updatedArray = selectedStudIds;
    let tempNum = selectedNumber;

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
    setGrades(tempGrades);
    setSelectedGrades(tempSelectedGrades);
  };

  useEffect(() => {
    if (nameSearchKey === "") {
      setGTR(grades);
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
  }, [grades, nameSearchKey]);

  return (
    <CTEAM.ModalOverlay>
      <CTEAM.Modal>
        <CTEAM.TitleLine>
          <CTEAM.Title>반 상세 정보</CTEAM.Title>
        </CTEAM.TitleLine>
        <CTEAM.ContentLine>
          <CTEAM.InputLabel>반 이름</CTEAM.InputLabel>
          <CTEAM.InputBox
            value={teamName}
            onChange={onNameChange}
            placeholder="반 이름을 입력하세요"
            $isEmpty={teamName === ""}
          />
          {teamName === "" && (
            <CTEAM.InputWarning>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `0.5rem` }} />
              필수 항목입니다.
            </CTEAM.InputWarning>
          )}
        </CTEAM.ContentLine>
        <CTEAM.ContentLine>
          <CTEAM.InputLabel>선생님 이름</CTEAM.InputLabel>
          <CTEAM.InputBox
            value={teacherName}
            onChange={onTNameChange}
            maxLength="15"
            placeholder="선생님 이름을 입력하세요"
            $isEmpty={teacherName === ""}
          />
          {teamName === "" && (
            <CTEAM.InputWarning>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `0.5rem` }} />
              필수 항목입니다.
            </CTEAM.InputWarning>
          )}
        </CTEAM.ContentLine>
        <CTEAM.InputLabel>반 학생</CTEAM.InputLabel>
        <STUDENTSELECT.Wrapper>
          <STUDENTSELECT.WholeListSection>
            <STUDENTSELECT.SearchBox>
              <STUDENTSELECT.SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </STUDENTSELECT.SearchIcon>
              <STUDENTSELECT.SearchInput
                value={nameSearchKey}
                onChange={onKeyChange}
                maxLength="10"
                placeholder="학생 이름 검색"
              />
              <STUDENTSELECT.XBtn onClick={deleteKey}>
                <FontAwesomeIcon icon={faXmark} />
              </STUDENTSELECT.XBtn>
            </STUDENTSELECT.SearchBox>
            <STUDENTSELECT.WholeList>
              {gradesToRender.map(
                (grade, index) =>
                  grade.students.length > 0 && (
                    <STUDENTSELECT.GradeContainer key={index}>
                      <STUDENTSELECT.GradeLine
                        onClick={() => {
                          extendGrade(grade);
                        }}
                      >
                        <STUDENTSELECT.ExtendBtn>
                          <FontAwesomeIcon icon={grade.extended ? faCaretDown : faCaretRight} />
                        </STUDENTSELECT.ExtendBtn>
                        <STUDENTSELECT.GradeLabel>{grade.grade}</STUDENTSELECT.GradeLabel>
                        <STUDENTSELECT.NumberLabel>{grade.students.length}명</STUDENTSELECT.NumberLabel>
                        <STUDENTSELECT.PlusBtn
                          onClick={() => {
                            addGrade(grade);
                          }}
                        >
                          <FontAwesomeIcon icon={faCirclePlus} />
                        </STUDENTSELECT.PlusBtn>
                      </STUDENTSELECT.GradeLine>
                      {grade.extended &&
                        grade.students.map((stud) => (
                          <STUDENTSELECT.StudentLine key={stud.id}>
                            <STUDENTSELECT.GradeLabel>{stud.name}</STUDENTSELECT.GradeLabel>
                            <STUDENTSELECT.PlusBtn
                              onClick={() => {
                                addStudent(grade.grade, stud);
                              }}
                            >
                              <FontAwesomeIcon icon={faCirclePlus} />
                            </STUDENTSELECT.PlusBtn>
                          </STUDENTSELECT.StudentLine>
                        ))}
                    </STUDENTSELECT.GradeContainer>
                  )
              )}
            </STUDENTSELECT.WholeList>
          </STUDENTSELECT.WholeListSection>
          <STUDENTSELECT.SelectedListSection>
            <STUDENTSELECT.LabelLine>
              <STUDENTSELECT.GradeLabel>선택된 학생</STUDENTSELECT.GradeLabel>
              <STUDENTSELECT.NumberLabel>{`${selectedNumber}명`}</STUDENTSELECT.NumberLabel>
            </STUDENTSELECT.LabelLine>
            <STUDENTSELECT.SelectedList>
              {selectedNumber === 0 ? (
                <STUDENTSELECT.EmptyNotice>
                  <STUDENTSELECT.NumberLabel>왼쪽 목록에서</STUDENTSELECT.NumberLabel>
                  <div style={{ height: `0.5rem` }} />
                  <STUDENTSELECT.NumberLabel>
                    <FontAwesomeIcon icon={faCirclePlus} />를 눌러 선택하세요.
                  </STUDENTSELECT.NumberLabel>
                </STUDENTSELECT.EmptyNotice>
              ) : (
                selectedGrades.map(
                  (grade, index) =>
                    grade.students.length > 0 && (
                      <STUDENTSELECT.GradeContainer key={index}>
                        <STUDENTSELECT.GradeLine
                          onClick={() => {
                            extendRightGrade(grade);
                          }}
                        >
                          <STUDENTSELECT.ExtendBtn>
                            <FontAwesomeIcon icon={grade.extended ? faCaretDown : faCaretRight} />
                          </STUDENTSELECT.ExtendBtn>
                          <STUDENTSELECT.GradeLabel>{grade.grade}</STUDENTSELECT.GradeLabel>
                          <STUDENTSELECT.NumberLabel>{grade.students.length}명</STUDENTSELECT.NumberLabel>
                          <STUDENTSELECT.MinusBtn
                            onClick={() => {
                              abstractGrade(grade);
                            }}
                          >
                            <FontAwesomeIcon icon={faCircleMinus} />
                          </STUDENTSELECT.MinusBtn>
                        </STUDENTSELECT.GradeLine>
                        {grade.extended &&
                          grade.students.map((stud) => (
                            <STUDENTSELECT.StudentLine key={stud.id}>
                              <STUDENTSELECT.GradeLabel>{stud.name}</STUDENTSELECT.GradeLabel>
                              <STUDENTSELECT.MinusBtn
                                onClick={() => {
                                  abstractStudent(grade, stud);
                                }}
                              >
                                <FontAwesomeIcon icon={faCircleMinus} />
                              </STUDENTSELECT.MinusBtn>
                            </STUDENTSELECT.StudentLine>
                          ))}
                      </STUDENTSELECT.GradeContainer>
                    )
                )
              )}
            </STUDENTSELECT.SelectedList>
          </STUDENTSELECT.SelectedListSection>
        </STUDENTSELECT.Wrapper>
        <CTEAM.BtnLine>
          <CTEAM.CloseBtn onClick={closeModal}>닫기</CTEAM.CloseBtn>

          <CTEAM.SubmitBtn onClick={patchTeam} disabled={teamName === ""}>
            저장하기
          </CTEAM.SubmitBtn>
        </CTEAM.BtnLine>
      </CTEAM.Modal>
    </CTEAM.ModalOverlay>
  );
};

export default UpdateTeam;

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
    height: 78.5rem;
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
  InputBox: styled.input`
    width: 22.5rem;
    height: 4rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: 0.1rem solid ${({ $isEmpty, theme }) => ($isEmpty ? theme.colors.warning : theme.colors.unselected)};
  `,
  InputWarning: styled.div`
    color: ${({ theme }) => theme.colors.warning};
    font-size: 1.3rem;
    font-weight: 500;
    margin-left: 1rem;
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

const STUDENTSELECT = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: row;
    padding-inline: 3rem;
    width: 69rem;
    height: 50rem;
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

  WholeList: styled.div`
    width: 30rem;
    height: 40rem;
    overflow-y: hidden;
    overflow-x: hidden;
    border-radius: 0.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray40};
    display: flex;
    flex-direction: column;
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
