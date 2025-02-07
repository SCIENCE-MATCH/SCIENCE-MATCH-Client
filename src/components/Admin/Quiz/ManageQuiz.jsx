import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faSearch } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import WarningModal from "../Concept/WarningModal";
import usePostGetQuizs from "../../../libs/apis/Admin/Quiz/postGetQuiz";
import AdminPreviewQuiz from "./PreviewQuiz";
import useDeleteQuiz from "../../../libs/apis/Admin/Quiz/deleteQuiz";

const SearchQuiz = ({ chapToSearch, school, grade, semester }) => {
  const { originalQuizs, getQuizs } = usePostGetQuizs();
  const { deleteQuiz } = useDeleteQuiz();
  const [idToDelete, setIdToDelete] = useState(null);
  const [isWarning, setIsWarning] = useState(false);
  const openWarning = (id) => {
    setIdToDelete(id);
    setIsWarning(true);
  };
  const closeWarning = () => setIsWarning(false);

  useEffect(() => {
    getQuizs(school);
  }, [school]);

  const deleteQuizFunc = async () => {
    await deleteQuiz(idToDelete);
    getQuizs(school);
  };

  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const [quizsToRender, setQuizsToRender] = useState([]);

  const [previewQuiz, setPreviewQuiz] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const openPreview = (quiz) => {
    setPreviewQuiz(quiz);
    setIsPreviewing(true);
  };
  const closePreview = () => {
    setIsPreviewing(false);
    setPreviewQuiz("");
  };
  const cutLongText = (text, cutLength) => {
    if (text.length > cutLength) return text.slice(0, cutLength) + "...";
    else return text;
  };

  useEffect(() => {
    const numToEng = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH"];
    const koToEng = { 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };
    const semToEng = ["FIRST1", "SECOND1"];
    let sem = "FIRST1";
    let sub = "SCIENCE";
    if (isNaN(grade)) {
      sub = koToEng[grade];
      sem = `${semToEng[semester - 1]}`;
    } else {
      sub = "SCIENCE";
      sem = `${numToEng[grade - 1]}${semester}`;
    }
    const filteredArr = originalQuizs.filter((quiz) => {
      return (
        (quiz.chapterDescription === chapToSearch.description || chapToSearch.description === null) &&
        quiz.school === schoolToSend[school] &&
        quiz.semester === sem &&
        quiz.subject === sub
      );
    });
    setQuizsToRender(filteredArr);
  }, [originalQuizs, school, chapToSearch]);

  const attributes = ["질문 내용", "제작자", "상세보기", "더보기"];
  const widths = [54, 12, 8, 10];
  return (
    <SQ.Wrapper>
      {isPreviewing && <AdminPreviewQuiz closeModal={closePreview} previewQuiz={previewQuiz} />}
      {isWarning && (
        <WarningModal
          deleteFunc={deleteQuizFunc}
          closeModal={closeWarning}
          warningText={"출제된 1:1 질문 역시 함께 삭제됩니다."}
        />
      )}
      <SQ.TitleLine>
        <SQ.TitleBox>단원 유형별 문제 검색</SQ.TitleBox>
      </SQ.TitleLine>
      <SQ.ChapterLine>
        <SQ.ChapterLabel>선택 단원명</SQ.ChapterLabel>
        {chapToSearch.description === null ? (
          <SQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} />
            선택된 단원이 없습니다. 학기 범위로 조회합니다.
          </SQ.WarningDes>
        ) : (
          <SQ.ChapterDescription>{chapToSearch.description}</SQ.ChapterDescription>
        )}
      </SQ.ChapterLine>

      <LI.ListWrapper>
        <LI.ListHeader>
          {attributes.map((att, index) => (
            <LI.AttributeBox key={index} $width={widths[index]} $isTitle={att === "질문 내용"}>
              {att}
            </LI.AttributeBox>
          ))}
        </LI.ListHeader>
        <LI.ListContainer>
          {quizsToRender.length === 0 && (
            <LI.QuestionPaperLine>
              <LI.CellBox $width={84}>조회된 1:1 질문이 없습니다.</LI.CellBox>
            </LI.QuestionPaperLine>
          )}
          {quizsToRender.map((quiz, index) => (
            <LI.QuestionPaperLine key={index}>
              <LI.CellBox $width={widths[0]} $isTitle={true}>
                {cutLongText(quiz.question, 35)}
                <LI.DescriptionText>{`${quiz.chapterDescription}`}</LI.DescriptionText>
              </LI.CellBox>
              <LI.CellBox $width={widths[1]}>{quiz.makerName ?? "관리자"}</LI.CellBox>
              <LI.CellBox $width={widths[2]}>
                <LI.InnerBtn
                  $width={4}
                  onClick={() => {
                    openPreview(quiz);
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </LI.InnerBtn>
              </LI.CellBox>
              <LI.CellBox $width={widths[3]}>
                <LI.InnerBtn
                  $width={6}
                  onClick={() => {
                    openWarning(quiz.id);
                  }}
                >
                  삭제
                </LI.InnerBtn>
              </LI.CellBox>
            </LI.QuestionPaperLine>
          ))}
        </LI.ListContainer>
      </LI.ListWrapper>
    </SQ.Wrapper>
  );
};

export default SearchQuiz;

const SQ = {
  Wrapper: styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    width: 86rem;
    height: 80rem;
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  `,
  TitleLine: styled.div`
    height: 6rem;
    width: 86rem;
    padding-block: 2rem;
    padding-left: 3rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.background};
  `,
  TitleBox: styled.div`
    font-size: 2rem;
    font-weight: 600;
  `,
  ChapterLine: styled.div`
    height: 7.5rem;
    width: 86rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-block: 1rem;
  `,
  ChapterLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
  `,

  ChapterDescription: styled.div`
    height: 4.5rem;
    width: 50rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.6rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
  `,
  WarningDes: styled.div`
    height: 4.5rem;
    width: 50rem;
    border-radius: 0.6rem;
    padding-left: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  `,

  OptionLine: styled.div`
    width: 86rem;
    height: 5rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  OptionLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  OptionBtnBox: styled.div`
    width: 50rem;
    display: flex;
    justify-content: space-between;
  `,
  OptionBtn: styled.button`
    flex: 1;
    margin: 0 1rem;
    height: 4rem;
    border-radius: 0.6rem;
    border: 0.2rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : `white`)};

    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray30)};
    font-size: ${({ $isSelected }) => ($isSelected ? `1.8rem` : `1.6rem`)};
    font-weight: 600;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      color: ${({ theme }) => theme.colors.mainColor};
      font-size: 1.8rem;
    }
  `,
  ImgSection: styled.div`
    width: 82rem;
    height: 54.5rem;
    margin-top: 0.5rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray20};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈을 허용 */
    justify-content: flex-start;
    margin-left: 2rem;
    padding: 1rem;
    padding-right: 0rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ImgContainer: styled.div`
    width: 38.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 2rem;
    &:nth-child(2n) {
      margin-right: 0rem;
    }
  `,
  ImgOptionLine: styled.div`
    width: 38.5rem;
    height: 4rem;
    padding-left: 1rem;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5rem;
  `,
  ImgBox: styled.div`
    width: 38.5rem;
    height: 15rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 3rem;
    padding: 1rem;
    padding-right: 0rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  Image: styled.img`
    width: 35.8rem;
    height: auto;
    max-height: 1000%;
  `,
  DeleteBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    cursor: pointer;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray30};
  `,
  NoImgMsg: styled.div`
    width: 79.5rem;
    height: 52rem;
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray60};
  `,
};

const LI = {
  ListWrapper: styled.div``,
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `4rem` : "1rem")};
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `4rem` : "2rem")};
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
    cursor: pointer;
    overflow: hidden;
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
  MoreInfoBtn: styled.button`
    width: 4rem;
    height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $isTitle }) => ($isTitle ? `flex-start` : "center")};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  MoreInfo: styled.div`
    position: sticky;
    padding: 0.5rem;
    background-color: white;
    border: 0.02rem ${({ theme }) => theme.colors.gray20} solid;
    border-radius: 0.6rem;
    z-index: 5; /* Ensure the dropdown is above other elements */
    box-shadow: 0rem 0rem 1rem rgba(0, 0, 0, 0.3);
    margin-right: 12rem;
    margin-top: -4.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  MoreBtn: styled.button`
    width: 9rem;
    height: 3rem;
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
    margin-right: auto;
  `,
  BatchActionBtn: styled.div`
    margin-left: 1rem;
    width: 8rem;
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
