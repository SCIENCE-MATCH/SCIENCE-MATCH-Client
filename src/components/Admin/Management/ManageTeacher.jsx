import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import useGetWaiting from "../../../libs/hooks/Admin/useGetWaiting";
import useGetTeachers from "../../../libs/hooks/Admin/useGetTeachers";
import usePostApproveTeacher from "../../../libs/apis/Admin/postApproveTeacher";
import useDeleteTeacher from "../../../libs/hooks/Admin/useDeleteTeacher";
const ManageTeacher = ({}) => {
  // 게시판 컴포넌트 구현
  const { waitings, getWaitng } = useGetWaiting();
  const { approved, getTeachers } = useGetTeachers();
  const { postApproveTeacher } = usePostApproveTeacher();
  const { deleteTeacher } = useDeleteTeacher();
  const [teachers, setTeachers] = useState([]);
  const [teachersToRender, setTeachersToRender] = useState([]);

  const [showStandby, setShowStandby] = useState(true);
  const [showDropDown, setShowDropdown] = useState(false);

  const [searchName, setSearchName] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [thisTeacherId, setThisTeacherId] = useState(0);

  const refreshTeachers = async () => {
    await getWaitng();
    await getTeachers();
  };

  const approveTeacher = async (id) => {
    await postApproveTeacher(id);
    await refreshTeachers();
  };
  const openDeleteModal = () => {
    setConfirmModalOpen(true);
  };
  const closeDeleteModal = () => {
    setConfirmModalOpen(false);
  };
  const handleDelete = async () => {
    await deleteTeacher(thisTeacherId);
    await refreshTeachers();
    setConfirmModalOpen(false);
  };
  useEffect(() => {
    if (showStandby) {
      setTeachers(waitings);
    } else {
      setTeachers(approved);
    }
  }, [showStandby, confirmModalOpen, waitings, approved]);

  /**이름 검색 */
  useEffect(() => {
    const filteredTeachers = teachers.filter((student) => {
      return student.name.includes(searchName);
    });
    setTeachersToRender(filteredTeachers);
  }, [teachers, searchName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getFullYear()).slice(-2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  const toDashNum = (numString) => {
    return `${numString.slice(0, 3)} ‑ ${numString.slice(3, 7)} ‑ ${numString.slice(7, 11)}`;
  };
  const attributes = ["번호", "선생님 이름", "이메일 & ID", "전화번호", "가입 날짜", "", "회원 삭제"];
  const standbyAtt = ["번호", "선생님 이름", "이메일 & ID", "전화번호", "신청 날짜", "가입 승인", "가입 거절"];

  const widths = [9, 20, 25, 25, 25, 14, 14];
  return (
    <MSTUD.Wrapper>
      {confirmModalOpen && (
        <CONFIRMMODAL.ModalOverlay>
          <CONFIRMMODAL.Modal>
            <CONFIRMMODAL.ContentLine>정말 삭제하시겠습니까?</CONFIRMMODAL.ContentLine>
            <CONFIRMMODAL.BtnLine>
              <CONFIRMMODAL.CloseBtn onClick={closeDeleteModal}>취소</CONFIRMMODAL.CloseBtn>
              <CONFIRMMODAL.DeleteBtn onClick={handleDelete}>삭제</CONFIRMMODAL.DeleteBtn>
            </CONFIRMMODAL.BtnLine>
          </CONFIRMMODAL.Modal>
        </CONFIRMMODAL.ModalOverlay>
      )}
      <MSTUD.FilterLine>
        {/**회원 / 가입 대기 */}
        <DROPDOWN.Container $width={15}>
          <DROPDOWN.Label
            $width={15}
            onClick={() => {
              setShowDropdown((prev) => !prev);
            }}
          >
            {showStandby ? "가입 대기" : "회원"}
            <DROPDOWN.Btn>
              <FontAwesomeIcon icon={faCaretDown} />
            </DROPDOWN.Btn>
          </DROPDOWN.Label>
          {showDropDown && (
            <DROPDOWN.OptionWrapper $width={15.5}>
              {[false, true].map((option) => (
                <DROPDOWN.Option
                  key={option}
                  $width={15.5}
                  onClick={() => {
                    setShowStandby(option);
                    setShowDropdown(false);
                  }}
                >
                  {option ? "가입 대기" : "회원"}
                </DROPDOWN.Option>
              ))}
            </DROPDOWN.OptionWrapper>
          )}
        </DROPDOWN.Container>
        <MSTUD.CellBox style={{ padding: `1rem` }}>{`선생님 ${teachersToRender.length}명`}</MSTUD.CellBox>
        {/**이름 검색*/}
        <MSTUD.SearchBox>
          <MSTUD.SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </MSTUD.SearchIcon>
          <MSTUD.SearchInput
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
            placeholder="선생님 이름 검색"
          />
          <MSTUD.XBtn
            onClick={() => {
              setSearchName("");
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </MSTUD.XBtn>
        </MSTUD.SearchBox>
      </MSTUD.FilterLine>

      <MSTUD.ListHeader>
        {attributes.map((att, index) => (
          <MSTUD.AttributeBox key={index} $width={widths[index]}>
            {showStandby ? standbyAtt[index] : att}
          </MSTUD.AttributeBox>
        ))}
      </MSTUD.ListHeader>
      <MSTUD.ListContainer>
        {teachersToRender.map((teacher, index) => (
          <MSTUD.QuestionPaperLine key={index}>
            <MSTUD.CellBox $width={widths[0]}>{index + 1}</MSTUD.CellBox>
            <MSTUD.CellBox $width={widths[1]}>{teacher.name}</MSTUD.CellBox>
            <MSTUD.CellBox $width={widths[2]}>{teacher.email}</MSTUD.CellBox>
            <MSTUD.CellBox $width={widths[3]}>{toDashNum(teacher.phoneNum)}</MSTUD.CellBox>
            <MSTUD.CellBox $width={widths[4]}>{formatDate(teacher.createdAt)}</MSTUD.CellBox>
            <MSTUD.CellBox $width={widths[5]}>
              {showStandby && (
                <MSTUD.MainColorBtn
                  $width={10}
                  onClick={() => {
                    approveTeacher(teacher.teacherId);
                  }}
                >
                  승인
                </MSTUD.MainColorBtn>
              )}
            </MSTUD.CellBox>
            <MSTUD.CellBox $width={widths[6]}>
              <MSTUD.RedBtn
                $width={10}
                onClick={() => {
                  openDeleteModal(true);
                  setThisTeacherId(teacher.teacherId);
                }}
              >
                {showStandby ? `거절` : `삭제`}
              </MSTUD.RedBtn>
            </MSTUD.CellBox>
          </MSTUD.QuestionPaperLine>
        ))}
      </MSTUD.ListContainer>
    </MSTUD.Wrapper>
  );
};

export default ManageTeacher;

const MSTUD = {
  Wrapper: styled.div`
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
    padding-inline: 2.5rem;
  `,
  SearchBox: styled.div`
    width: 30rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    display: flex;
    flex-direction: row;
    font-size: 1.5rem;
    font-weight: 500;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    overflow: hidden;
    margin-left: auto;
  `,
  SearchIcon: styled.div`
    width: 4.5rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-top: -0.1rem;
    color: ${({ theme }) => theme.colors.gray50};
  `,
  SearchInput: styled.input`
    width: 23rem;
    height: 4.5rem;
    margin-top: -0.1rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    outline: none;
  `,
  XBtn: styled.button`
    width: 4.5rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-top: -0.1rem;
    color: ${({ theme }) => theme.colors.gray50};
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
    height: 68.5rem;
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
  MainColorBtn: styled.button`
    width: ${({ $width }) => `${$width}rem`};
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
    &:hover {
      background-color: ${({ theme }) => theme.colors.mainColor};
      border: none;
      color: white;
    }
  `,
  RedBtn: styled.button`
    width: ${({ $width }) => `${$width}rem`};
    height: 4rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.5rem;
    font-weight: 600;
    &:hover {
      background-color: ${({ theme }) => theme.colors.warning};
      border: none;
      color: white;
    }
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

const CONFIRMMODAL = {
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
    padding-block: 2rem;
    padding-inline: 3rem;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 30rem;
    height: 15rem;
    display: flex;
    flex-direction: column;
  `,
  ContentLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 2rem;
    font-weight: 700;
    width: 100%;
    height: 5rem;
  `,
  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    margin-top: auto;
  `,
  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  DeleteBtn: styled.button`
    margin-left: auto;
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
  `,
};
