import { useState, useEffect } from "react";
import { getCookie } from "../../../libs/cookie";
import Axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCheck, faCirclePlus, faMagnifyingGlass, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import UpdateTeam from "./UpdateTeam";
import CreateTeam from "./CreateTeam";
import WarningModal from "../../Admin/Concept/WarningModal";

const ManageTeam = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [thisTeam, setThisTeam] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);

  const openCreate = () => {
    setCreateModalOpen(true);
  };
  const closeCreate = () => {
    setCreateModalOpen(false);
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
      const url = "https://www.science-match.p-e.kr/teacher/team";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const overallTeams = await Promise.all(
        response.data.data.map(async (team) => {
          return { ...team };
        })
      );
      /*let sortedTeams = [...response.data.data];
      sortedTeams.sort((a, b) => b.id - a.id);
      sortedTeams = sortedTeams.map((student) => ({
        ...student,
        selected: false,
      }));
      setTeams(sortedTeams); 시발 이거 뭐더라*/

      setTeams(overallTeams);
      setTeamsToRender(overallTeams);
      setSelectedTeams([]);
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

  const selectTeam = (teamId) => {
    let tempTeams = [...teams];
    tempTeams.map((team) => {
      if (team.teamId === teamId) team.selected = !team.selected;
    });
    setTeams(tempTeams);

    let tempArr = [...selectedTeams];
    const index = tempArr.indexOf(teamId);

    if (index === -1) {
      // 배열에 요소가 없으면 추가
      tempArr.push(teamId);
    } else {
      // 배열에 요소가 있으면 제거
      tempArr.splice(index, 1);
    }
    setSelectedTeams(tempArr);
  };

  const [teamsToRender, setTeamsToRender] = useState([]);

  const [isWarning, setIsWarning] = useState(false);
  const openWarning = () => setIsWarning(true);
  const closeWarning = () => setIsWarning(false);
  const deleteTeam = async (teamId) => {
    try {
      const accessTokenForD = await getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/teacher/team/${teamId}`;

      await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessTokenForD}`,
        },
      });
    } catch (error) {
      // API 요청이 실패한 경우
      console.error("API 요청 실패:", error.response.data.code, error.response.data.message, "|", error.response);
    }
  };

  const deselectAll = () => {
    let tempTeams = [...teams];
    tempTeams.map((stud) => {
      stud.selected = false;
    });
    setTeams(tempTeams);
    setSelectedTeams([]);
  };
  const deleteAll = () => {
    selectedTeams.map((tId) => {
      deleteTeam(tId);
    });
    alert(`반 ${selectedTeams.length}개가 삭제 되었습니다.`);
    init();
  };

  const attributes = ["선택", "순서", "반 이름", "반 학생", "담당 선생님", "상세"];
  const widths = [9, 9, 55, 20, 20, 20];
  return (
    <MSTUD.Wrapper>
      {isWarning && <WarningModal deleteFunc={deleteAll} closeModal={closeWarning} warningText={"반을 삭제합니다."} />}
      {updateModalOpen && <UpdateTeam closeModal={closeUpdate} thisTeam={thisTeam} />}
      {createModalOpen && <CreateTeam closeModal={closeCreate} />}
      <MSTUD.ManageSection>
        <MSTUD.FilterLine>
          <MSTUD.CellBox style={{ padding: `1.5rem` }}>반 이름 오름차순으로 정렬됩니다.</MSTUD.CellBox>
          {/**이름 검색*/}
          <MSTUD.SearchContainer>
            <MSTUD.SearchInput
              placeholder="반 이름 검색"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            <MSTUD.SearchBtn>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </MSTUD.SearchBtn>
          </MSTUD.SearchContainer>
          <MSTUD.CreateBtn onClick={openCreate}>
            <FontAwesomeIcon icon={faCirclePlus} />
            {` 반 만들기`}
          </MSTUD.CreateBtn>
        </MSTUD.FilterLine>

        <MSTUD.ListHeader>
          {attributes.map((att, index) => (
            <MSTUD.AttributeBox key={index} $width={widths[index]} $isTitle={att === "반 이름"}>
              {att}
            </MSTUD.AttributeBox>
          ))}
        </MSTUD.ListHeader>
        <MSTUD.ListContainer $shorten={selectedTeams.length > 0}>
          {teamsToRender.map((team, index) => (
            <MSTUD.QuestionPaperLine key={index}>
              <MSTUD.CellBox
                $width={widths[0]}
                onClick={() => {
                  selectTeam(team.teamId);
                }}
              >
                <MSTUD.CheckBox $isChecked={team.selected}>
                  {1 === 1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                </MSTUD.CheckBox>
              </MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[1]}>{index + 1}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[2]} $isTitle={true}>
                {team.name}
              </MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[3]}>
                {team.studentNum > 0 ? team.studentNum + "명" : "학생 없음"}
              </MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[4]}>{team.teacherName}</MSTUD.CellBox>
              <MSTUD.CellBox $width={widths[5]}>
                <MSTUD.InnerBtn
                  $width={8}
                  onClick={() => {
                    openUpdate();
                    setThisTeam(team);
                  }}
                >
                  상세
                </MSTUD.InnerBtn>
              </MSTUD.CellBox>
            </MSTUD.QuestionPaperLine>
          ))}
        </MSTUD.ListContainer>
        {selectedTeams.length > 0 ? (
          <MSTUD.BottomLine>
            <MSTUD.BottomText>{`반 ${selectedTeams.length}개 선택됨`}</MSTUD.BottomText>
            <MSTUD.BatchDeleteBtn onClick={openWarning}>
              <FontAwesomeIcon icon={faTrash} style={{ marginBottom: "0.75rem" }} />
              선택 반 삭제
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

export default ManageTeam;

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
    border: 0.05rem solid ${({ theme }) => theme.colors.gray20};
    overflow: hidden;
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `4rem` : `2rem`)};
    color: ${({ theme }) => theme.colors.gray40};
    font-size: 1.4rem;
    font-weight: 600;
  `,
  ListContainer: styled.div`
    height: ${({ $shorten }) => (!$shorten ? `68.5rem` : `60.5rem`)};
    overflow-y: hidden;
    &:hover {
      overflow-y: scroll;
    }
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `4rem` : `2rem`)};
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
    width: 12rem;
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
    margin-left: 1rem;
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
    z-index: 1000; /* Ensure the dropdown is above other elements */
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
