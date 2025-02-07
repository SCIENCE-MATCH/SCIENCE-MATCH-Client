import { useState, useEffect } from "react";
import RegistStudent from "./RegistStudent";
import UpdateStudent from "./UpdateStudent";
import { getCookie } from "../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCaretDown, faCheck, faMagnifyingGlass, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";

const ManageStudent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [thisStd, setThisStd] = useState([]);
  const [searchGrade, setSearchGrade] = useState("전체");
  const [searchDeleted, setSearchDeleted] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedStudPhoneNumber, setSelectedStudPhoneNumbers] = useState([]);

  const schoolOptions = [`전체`, "초", "중", "고"];
  const changeSchool = (e) => {
    setSearchGrade(e.target.value);
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    init();
  };

  const openUpdate = () => {
    setUpdateModalOpen(true);
  };
  const closeUpdate = () => {
    setUpdateModalOpen(false);
    init();
  };

  const init = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/students";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      let sortedStudents = [...response.data.data];
      sortedStudents.sort((a, b) => b.id - a.id);
      sortedStudents = sortedStudents.map((student) => ({
        ...student,
        selected: false,
      }));
      setStudents(sortedStudents);
      setSelectedStudPhoneNumbers([]);
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
    init();
  }, []);

  const selectStud = (phoneNum) => {
    let tempStuds = [...students];
    tempStuds.map((stud) => {
      if (stud.phoneNum === phoneNum) stud.selected = !stud.selected;
    });
    setStudents(tempStuds);

    let tempArr = [...selectedStudPhoneNumber];
    const index = tempArr.indexOf(phoneNum);

    if (index === -1) {
      // 배열에 요소가 없으면 추가
      tempArr.push(phoneNum);
    } else {
      // 배열에 요소가 있으면 제거
      tempArr.splice(index, 1);
    }
    setSelectedStudPhoneNumbers(tempArr);
  };

  const sortOptions = [
    { value: "default", label: "최신 등록순" },
    { value: "old", label: "오래된순" },
    { value: "nameAsc", label: "이름 오름차순" },
    { value: "nameDesc", label: "이름 내림차순" },
    { value: "gradeAsc", label: "학년 오름차순" },
    { value: "gradeDesc", label: "학년 내림차순" },
  ];
  const [sortOption, setSortOption] = useState(`default`);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSecondDD, setShowSDD] = useState(false);
  useEffect(() => {
    let sortedStudents = [...students];
    switch (sortOption) {
      case "default":
        sortedStudents.sort((a, b) => b.id - a.id);
        break;
      case "old":
        sortedStudents.sort((a, b) => a.id - b.id);
        break;
      case "nameAsc":
        sortedStudents.sort((a, b) => (a.name > b.name ? 1 : -1));
        break;
      case "nameDesc":
        sortedStudents.sort((a, b) => (a.name < b.name ? 1 : -1));
        break;
      case "gradeAsc":
        sortedStudents.sort((a, b) => (a.grade < b.grade ? 1 : -1));
        break;
      case "gradeDesc":
        sortedStudents.sort((a, b) => (a.grade > b.grade ? 1 : -1));
        break;
      default:
        sortedStudents.sort((a, b) => b.id - a.id);
        break;
    }
    setStudents(sortedStudents);
  }, [sortOption]);

  const [studentsToRender, setStudentsToRender] = useState([]);

  useEffect(() => {
    const filteredStudents = students.filter((student) => {
      return (
        student.deleted === searchDeleted &&
        (student.grade.slice(0, 1) === searchGrade || searchGrade === "전체") &&
        student.name.includes(searchName)
      );
    });
    setStudentsToRender(filteredStudents);
  }, [students, searchDeleted, searchGrade, searchName]);

  const deleteStd = async (phoneNum) => {
    try {
      const accessTokenForD = await getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/student/delete?phoneNum=${phoneNum}`;

      await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessTokenForD}`,
        },
      });

      closeModal();
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message, "|", error.response);
    }
  };

  const deselectAll = () => {
    let tempStuds = [...students];
    tempStuds.map((stud) => {
      stud.selected = false;
    });
    setStudents(tempStuds);
    setSelectedStudPhoneNumbers([]);
  };
  const deleteAll = () => {
    selectedStudPhoneNumber.map((pNum) => {
      deleteStd(pNum);
    });
    alert(`학생 ${selectedStudPhoneNumber.length}명이 퇴원처리 되었습니다.`);
    deselectAll();
  };

  const toDashNum = (numString) => {
    return `${numString.slice(0, 3)} ‑ ${numString.slice(3, 7)} ‑ ${numString.slice(7, 11)}`;
  };
  const attributes = ["선택", "학년", "상태", "학생이름", "학생 연락처 & ID", "학부모 연락처", "상세"];

  const widths = [9, 9, 9, 30, 30, 30, 15];
  return (
    <MSTUD.Wrapper>
      {updateModalOpen && <UpdateStudent closeModal={closeUpdate} thisStd={thisStd} />}
      {modalOpen && (
        <RegistStudent closeModal={closeModal} setSortOption={setSortOption} setSearchGrade={setSearchGrade} />
      )}
      <MSTUD.ManageSection>
        <MSTUD.FilterLine>
          {/**정렬 기준 */}
          <DROPDOWN.Container $width={14}>
            <DROPDOWN.Label
              $width={14}
              onClick={() => {
                setShowDropdown((prev) => !prev);
              }}
            >
              {sortOptions.find((option) => option.value === sortOption).label}
              <DROPDOWN.Btn>
                <FontAwesomeIcon icon={faCaretDown} />
              </DROPDOWN.Btn>
            </DROPDOWN.Label>
            {showDropdown ? (
              <DROPDOWN.OptionWrapper $width={14}>
                {sortOptions.map((option) => (
                  <DROPDOWN.Option
                    key={option}
                    $width={14}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowDropdown(false);
                    }}
                  >
                    {option.label}
                  </DROPDOWN.Option>
                ))}
              </DROPDOWN.OptionWrapper>
            ) : (
              <></>
            )}
          </DROPDOWN.Container>
          {/**학교 선택 */}
          <SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.BtnContainer>
              {schoolOptions.map((opt) => (
                <SCHOOLSEM.DetailBtn
                  key={opt}
                  $isSelected={searchGrade === opt}
                  $isAll={opt === `전체`}
                  value={opt}
                  onClick={changeSchool}
                >
                  {opt}
                </SCHOOLSEM.DetailBtn>
              ))}
            </SCHOOLSEM.BtnContainer>
          </SCHOOLSEM.SchoolOptionContainer>
          {/**재원생/퇴원생 */}
          <DROPDOWN.Container $width={9}>
            <DROPDOWN.Label
              $width={9}
              onClick={() => {
                setShowSDD((prev) => !prev);
              }}
            >
              {searchDeleted ? "퇴원생" : "재원생"}
              <DROPDOWN.Btn>
                <FontAwesomeIcon icon={faCaretDown} />
              </DROPDOWN.Btn>
            </DROPDOWN.Label>
            {showSecondDD ? (
              <DROPDOWN.OptionWrapper $width={9}>
                {[false, true].map((option) => (
                  <DROPDOWN.Option
                    key={option}
                    $width={9}
                    onClick={() => {
                      setSearchDeleted(option);
                      setShowSDD(false);
                    }}
                  >
                    {option ? "퇴원생" : "재원생"}
                  </DROPDOWN.Option>
                ))}
              </DROPDOWN.OptionWrapper>
            ) : (
              <></>
            )}
          </DROPDOWN.Container>
          <MSTUD.CellBox style={{ padding: `1rem` }}>{`학생 ${studentsToRender.length}명`}</MSTUD.CellBox>
          {/**이름 검색*/}
          <MSTUD.SearchContainer>
            <MSTUD.SearchInput
              placeholder="학생 이름 검색"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            <MSTUD.SearchBtn>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </MSTUD.SearchBtn>
          </MSTUD.SearchContainer>
          <MSTUD.CreateBtn onClick={openModal}>
            <FontAwesomeIcon icon={faUser} />
            {` 학생 개별 등록`}
          </MSTUD.CreateBtn>
        </MSTUD.FilterLine>

        <MSTUD.ListHeader>
          {attributes.map((att, index) => (
            <MSTUD.AttributeBox key={index} $width={widths[index]} $isTitle={att === "학습지명"}>
              {att}
            </MSTUD.AttributeBox>
          ))}
        </MSTUD.ListHeader>
        <MSTUD.ListContainer $shorten={selectedStudPhoneNumber.length > 0}>
          {studentsToRender.map((student, index) => (
            <MSTUD.QuestionPaperLine key={index}>
              <MSTUD.CellBox
                $width={widths[0]}
                onClick={() => {
                  selectStud(student.phoneNum);
                }}
              >
                <MSTUD.CheckBox $isChecked={student.selected}>
                  {1 === 1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                </MSTUD.CheckBox>
              </MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[1]}>{student.grade}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[2]}>{student.deleted ? `퇴원` : `재원`}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[3]}>{student.name}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[4]}>{toDashNum(student.phoneNum)}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[5]}>{toDashNum(student.parentNum)}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[6]}>
                <MSTUD.InnerBtn
                  $width={8}
                  onClick={() => {
                    openUpdate();
                    setThisStd(student);
                  }}
                >
                  상세
                </MSTUD.InnerBtn>
              </MSTUD.CellBox>
            </MSTUD.QuestionPaperLine>
          ))}
        </MSTUD.ListContainer>
        {selectedStudPhoneNumber.length > 0 ? (
          <MSTUD.BottomLine>
            <MSTUD.BottomText>{`학생 ${selectedStudPhoneNumber.length}명 선택됨`}</MSTUD.BottomText>
            <MSTUD.BatchDeleteBtn onClick={deleteAll}>
              <FontAwesomeIcon icon={faBan} style={{ marginBottom: "0.75rem" }} />
              퇴원 처리
            </MSTUD.BatchDeleteBtn>
            <MSTUD.DeselectBtn onClick={deselectAll}>
              <FontAwesomeIcon icon={faXmark} />
            </MSTUD.DeselectBtn>
          </MSTUD.BottomLine>
        ) : null}
      </MSTUD.ManageSection>
    </MSTUD.Wrapper>
  );
};

export default ManageStudent;

const MSTUD = {
  Wrapper: styled.div`
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: auto; /*standard: 1400*/
    height: 80rem;
    margin-top: 2rem;
  `,
  ManageSection: styled.div`
    width: 135rem;
    min-width: 135rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    padding-top: 1.5rem;
    overflow: hidden;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  FilterLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
  `,
  SearchContainer: styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: 1rem;
    width: 25rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    overflow: hidden;
  `,
  SearchInput: styled.input`
    width: 20.5rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: none;
    outline: none;
    padding-left: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  `,
  SearchBtn: styled.div`
    width: 4.5rem;
    height: 4.5rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
  `,
  CreateBtn: styled.button`
    width: 17.5rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
  `,
  ListHeader: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    border-bottom: 0.04rem solid ${({ theme }) => theme.colors.gray20};
  `,
  AttributeBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    text-align: ${({ $isTitle }) => ($isTitle ? `left` : `center`)};
    padding-inline: 2rem;
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    overflow-y: hidden;
    &:hover {
      overflow-y: scroll;
    }
    height: ${({ $shorten }) => (!$shorten ? `68.5rem` : `60.5rem`)};
    &::-webkit-scrollbar {
      width: 1rem;
    }
    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      //border-radius: 1rem;
    }
    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      //border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  QuestionPaperLine: styled.article`
    height: 7rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-block: 0.005rem solid ${({ theme }) => theme.colors.gray10};
  `,
  CellBox: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    padding-inline: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ $isTitle, theme }) => ($isTitle ? theme.colors.gray80 : theme.colors.gray60)};
  `,
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : theme.colors.unselected)} solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      border: 0.2rem ${({ theme }) => theme.colors.mainColor} solid;
    }
  `,
  DescriptionText: styled.span`
    color: brown;
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0.5rem;
  `,
  InnerBtn: styled.button`
    width: ${({ $width }) => `${$width}rem`};
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  BottomLine: styled.div`
    width: 135rem;
    height: 7rem;
    margin-top: 1rem;
    background-color: ${({ theme }) => theme.colors.gray50};
    display: flex;
    align-items: center;
    flex-direction: row;
    padding-left: 3rem;
    padding-right: 2rem;
  `,
  BottomText: styled.div`
    font-size: 1.6rem;
    font-weight: 700;
    color: white;
  `,
  BatchDeleteBtn: styled.div`
    margin-left: auto;
    width: 9rem;
    height: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: 400;
  `,
  DeselectBtn: styled.button`
    width: 6rem;
    height: 6rem;
    margin-left: 2rem;
    font-size: 2rem;
    color: white;
    cursor: pointer;
  `,
};

const SCHOOLSEM = {
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
    height: 4rem;
    border-right: 0.05rem solid ${({ theme }) => theme.colors.unselected};
    margin-right: 1rem;
  `,
  BtnContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  DetailBtn: styled.button`
    width: ${({ $isAll }) => ($isAll ? `6rem` : `4.5rem`)};
    height: 4.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.2rem ${theme.colors.mainColor}` : `0.05rem ${theme.colors.unselected}`};
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
  `,
  Label: styled.div`
    width: ${({ $width }) => `${$width}rem`};
    height: 4.5rem;
    font-size: 1.6rem;
    font-weight: 700;
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
  `,
};
