import { useEffect, useState } from "react";
import styled from "styled-components";
import CreateQuestionPaper from "./CreateQuestionPaper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCheck,
  faCirclePlus,
  faCloudArrowDown,
  faEllipsisVertical,
  faFilePdf,
  faSearch,
  faSliders,
  faTrash,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
import PresentPaper from "./PresentPaper";
import PDFViewer from "./PreviewPdf";
import WarningModal from "../../../Admin/Concept/WarningModal";
import useDeletePaper from "../../../../libs/apis/Teacher/Prepare/deletePaper";
import usePostGetPapers from "../../../../libs/apis/Teacher/Prepare/postGetPapers";
import DownloadModal from "./DownloadModal";

const ManageQuestionPaper = () => {
  const { deletePaper } = useDeletePaper();
  const { paperData, getPapers } = usePostGetPapers();

  const modifyDateToStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // 시간을 00:00:00:000로 설정
    return newDate;
  };

  const modifyDateToEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999); // 시간을 23:59:59.999로 설정
    return newDate;
  };
  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const [dateFrom, setDateFrom] = useState(modifyDateToStartOfDay(fiveYearsAgo));
  const [dateTo, setDateTo] = useState(modifyDateToEndOfDay(today));

  const [isFilterModalOn, setIsFilterModalOn] = useState(false);

  const [receivedPapers, setReceivedPapers] = useState([]);
  const [lookMoreIndex, setLookMoreIndex] = useState(-1);
  const onLookMore = (index) => {
    if (lookMoreIndex == index) setLookMoreIndex(-1);
    else setLookMoreIndex(index);
  };
  const [searchName, setSearchName] = useState("");
  const [papersToRender, setPapersToRender] = useState([]);

  const [previewPaper, setPreviewPaper] = useState("");

  const [isPreviewing, setIsPreviewing] = useState(false);
  const openPreview = (paper) => {
    setIsPreviewing(true);
    setPreviewPaper(paper);
  };
  const closePreview = () => {
    setIsPreviewing(false);
    setPreviewPaper("");
  };
  const [presentId, setPresentId] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isPresentingMany, setIsPresentingMany] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingMany, setIsDownloadingMany] = useState(false);
  const openPresent = (paper, id) => {
    setIsPresenting(true);
    setPresentId(id);
    setPreviewPaper(paper);
    setLookMoreIndex(-1);
  };
  const closePresent = () => {
    setIsPresenting(false);
    setPresentId(0);
    setPreviewPaper("");
  };
  const openPresentMany = () => {
    setIsPresentingMany(true);
    setLookMoreIndex(-1);
  };
  const closePresentMany = () => {
    setIsPresentingMany(false);
  };
  const closeDownload = () => {
    setIsDownloading(false);
    setLookMoreIndex(-1);
  };
  const openDownloadMany = () => {
    setIsDownloadingMany(true);
    setLookMoreIndex(-1);
  };
  const closeDownloadMany = () => {
    setIsDownloadingMany(false);
  };

  const [school, setSchool] = useState("전체");
  const schoolOptions = ["전체", "초", "중", "고"];
  const schoolToSend = { 초: "ELEMENTARY", 중: "MIDDLE", 고: "HIGH" };
  const levelToKorean = { LOW: "하", MEDIUM_LOW: "중하", MEDIUM: "중", MEDIUM_HARD: "중상", HARD: "상", null: "미정" };

  const changeSchool = (e) => {
    setSchool(e.target.value);
  };

  const [questionTagSet, setQuestionTagSet] = useState(["단원유형별", "시중교재", "모의고사"]);
  const selectTag = (e) => {
    const gotValue = e.target.value;
    let tempSet = [...questionTagSet];

    if (tempSet.includes(gotValue)) {
      tempSet = tempSet.filter((tag) => tag !== gotValue);
    } else {
      tempSet.push(gotValue);
    }
    setQuestionTagSet(tempSet);
  };
  useEffect(() => {
    setSelectedPaperIds([]);
    const sortedData = paperData.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    setReceivedPapers(sortedData);
  }, [paperData]);

  const getKoreanGrade = (school, subject, semester) => {
    // 학교명을 한글로 변환
    const schoolNames = { ELEMENTARY: "초", MIDDLE: "중", HIGH: "고" };

    // 과목명을 한글로 변환
    const subjectNames = { SCIENCE: "과학", PHYSICS: "물", CHEMISTRY: "화", BIOLOGY: "생", EARTH_SCIENCE: "지" };

    // 학기명을 서수로 변환
    const semesterNames = {
      FIRST1: "1-1",
      FIRST2: "1-2",
      SECOND1: "2-1",
      SECOND2: "2-2",
      THIRD1: "3-1",
      THIRD2: "3-2",
      FOURTH1: "4-1",
      FOURTH2: "4-2",
      FIFTH1: "5-1",
      FIFTH2: "5-2",
      SIXTH1: "6-1",
      SIXTH2: "6-2",
    };

    // subject가 SCIENCE인 경우
    if (subject === "SCIENCE") {
      const schoolNameKorean = schoolNames[school];
      const grade = semesterNames[semester];
      if (schoolNameKorean && grade) {
        return `${schoolNameKorean}${grade}`;
      } else {
        return "Invalid input";
      }
    }

    // subject가 SCIENCE가 아닌 경우
    const subjectNameKorean = subjectNames[subject];
    if (subjectNameKorean) {
      const semesterNumber = semester.includes("FIRST") ? "1" : "2";
      return `${subjectNameKorean}${semesterNumber}`;
    }

    return "Invalid input";
  };

  const [paperToDelete, setPaperToDelete] = useState(null);
  const [paperToDownload, setPaperToDownload] = useState(null);

  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const selectPaper = (paper) => {
    let tempPapers = [...receivedPapers];

    tempPapers.forEach((originPaper) => {
      if (originPaper.id === paper.id) {
        originPaper.selected = !originPaper.selected;
      }
    });

    setReceivedPapers(tempPapers);

    let tempArr = [...selectedPaperIds];

    if (paper.selected) {
      tempArr.push({ id: paper.id, pdf: paper.pdf, title: paper.title });
    } else {
      tempArr = tempArr.filter((p) => p.id !== paper.id);
    }

    setSelectedPaperIds(tempArr);
  };

  const deselectAll = () => {
    let tempPapers = [...receivedPapers];
    tempPapers.map((paper) => {
      paper.selected = false;
    });
    setReceivedPapers(tempPapers);
    setSelectedPaperIds([]);
  };
  const deleteAll = async () => {
    try {
      const deletePromises = selectedPaperIds.map((qId) => deletePaper(qId));

      await Promise.all(deletePromises);

      deselectAll();
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  };

  const cutLongText = (text, cutLength) => {
    if (text.length > cutLength) return text.slice(0, cutLength) + "...";
    else return text;
  };

  const setFiveYears = () => {
    const targetDate = new Date();
    targetDate.setFullYear(today.getFullYear() - 5);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneYear = () => {
    const targetDate = new Date();
    targetDate.setFullYear(today.getFullYear() - 1);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneMonth = () => {
    const targetDate = new Date();
    targetDate.setMonth(today.getMonth() - 1);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneWeek = () => {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - 7);
    setDateFrom(modifyDateToStartOfDay(targetDate));
    setDateTo(modifyDateToEndOfDay(today));
  };
  const setOneDay = () => {
    setDateFrom(modifyDateToStartOfDay(today));
    setDateTo(modifyDateToEndOfDay(today));
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  useEffect(() => {
    const filteredArr = receivedPapers.filter((paper) => {
      const paperDate = new Date(paper.createdAt);
      return (
        (paper.school === schoolToSend[school] || school === "전체") &&
        (paper.title.includes(searchName) || paper.makerName.includes(searchName)) &&
        questionTagSet.includes(paper.questionTag) && //학습지 종류 필터링
        dateFrom < paperDate &&
        paperDate < dateTo
      );
    });
    setPapersToRender(filteredArr);
  }, [receivedPapers, school, searchName, questionTagSet, dateFrom, dateTo]);

  const [isWarningBatch, setIsWarningBatch] = useState(false);
  const openWarningBatch = () => setIsWarningBatch(true);
  const closeWarningBatch = () => setIsWarningBatch(false);

  const [isWarning, setIsWarning] = useState(false);
  const closeWarning = () => setIsWarning(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getFullYear()).slice(-2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    getPapers(questionTagSet, school, dateFrom, dateTo);
  }, [createModalOpen]);

  const attributes = ["선택", "학년", "유형", "학습지명", "생성일", "출제자", "미리보기", "출제", "더보기"];
  const widths = [9, 9, 9, 51, 10, 14, 9, 12, 10];
  return (
    <MQP.Wrapper>
      {isWarning && (
        <WarningModal
          deleteFunc={async () => {
            await deletePaper(paperToDelete);
            getPapers(questionTagSet, school, dateFrom, dateTo);
            setLookMoreIndex(-1);
          }}
          closeModal={closeWarning}
          warningText={`선택한 문제지를 삭제합니다.`}
        />
      )}
      {isWarningBatch && (
        <WarningModal
          deleteFunc={async () => {
            await deleteAll();
            getPapers(questionTagSet, school, dateFrom, dateTo);
            setLookMoreIndex(-1);
          }}
          closeModal={closeWarningBatch}
          warningText={`선택한 문제지 ${selectedPaperIds.length}개를 모두 삭제합니다.`}
        />
      )}
      {isPresenting && <PresentPaper closeModal={closePresent} paper={previewPaper} paperIds={[presentId]} />}
      {isPresentingMany && <PresentPaper closeModal={closePresentMany} paperIds={selectedPaperIds} />}
      {isPreviewing && <PDFViewer closeModal={closePreview} paper={previewPaper} />}
      {isDownloading && <DownloadModal closeModal={closeDownload} paper={paperToDownload} paperIds={[]} />}
      {isDownloadingMany && <DownloadModal closeModal={closeDownloadMany} paperIds={selectedPaperIds} paper={null} />}
      {createModalOpen && <CreateQuestionPaper closeModal={closeCreateModal} />}
      <MQP.ManageSection>
        <MQP.FilterLine>
          <SCHOOLSEM.SchoolOptionContainer>
            <SCHOOLSEM.BtnContainer>
              {schoolOptions.map((opt) => (
                <SCHOOLSEM.RoundBtn
                  key={`school_${opt}`}
                  $isSelected={school === opt}
                  $isAll={opt === `전체`}
                  value={opt}
                  onClick={changeSchool}
                >
                  {opt}
                </SCHOOLSEM.RoundBtn>
              ))}
            </SCHOOLSEM.BtnContainer>
          </SCHOOLSEM.SchoolOptionContainer>
          <MQP.FilterBtn
            onClick={() => {
              setIsFilterModalOn((prev) => !prev);
            }}
          >
            <FontAwesomeIcon icon={faSliders} />
            {` 필터`}
          </MQP.FilterBtn>
          <MQP.SearchBox>
            <MQP.SearchIcon>
              <FontAwesomeIcon icon={faSearch} />
            </MQP.SearchIcon>
            <MQP.SearchInput
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
              placeholder="학습지명, 출제자 검색"
            />
            <MQP.XBtn
              onClick={() => {
                setSearchName("");
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </MQP.XBtn>
          </MQP.SearchBox>
          <MQP.CreateBtn onClick={openCreateModal}>
            <FontAwesomeIcon icon={faCirclePlus} />
            {` 학습지 만들기`}
          </MQP.CreateBtn>
        </MQP.FilterLine>
        {isFilterModalOn && (
          <FILTER.Modal>
            <FILTER.Title>검색 필터</FILTER.Title>
            <FILTER.FilterLine>
              <FILTER.Label>학습지 생성 기간</FILTER.Label>
              <FILTER.DateInput
                selected={dateFrom}
                onChange={(date) => {
                  setDateFrom(date);
                  if (date > dateTo) setDateTo(date);
                }}
                dateFormat="yyyy/MM/dd"
                placeholderText="Select a date"
                locale={ko} // locale 설정
              />
              ~
              <FILTER.DateInput
                selected={dateTo}
                onChange={(date) => {
                  setDateTo(date);
                  if (date < dateFrom) setDateFrom(date);
                }}
                dateFormat="yyyy/MM/dd"
                placeholderText="Select a date"
                locale={ko} // locale 설정
              />
            </FILTER.FilterLine>
            <FILTER.FilterLine>
              <FILTER.Label>빠른 선택</FILTER.Label>
              <FILTER.ButtonContainer>
                <FILTER.CategoryBtn onClick={setFiveYears}>5년</FILTER.CategoryBtn>
                <FILTER.CategoryBtn onClick={setOneYear}>1년</FILTER.CategoryBtn>
                <FILTER.CategoryBtn onClick={setOneMonth}>1달</FILTER.CategoryBtn>
                <FILTER.CategoryBtn onClick={setOneWeek}>1주</FILTER.CategoryBtn>
                <FILTER.CategoryBtn onClick={setOneDay}>1일</FILTER.CategoryBtn>
              </FILTER.ButtonContainer>
            </FILTER.FilterLine>
            <FILTER.FilterLine>
              <FILTER.Label>학습지 유형</FILTER.Label>
              <FILTER.ButtonContainer>
                <FILTER.CategoryBtn
                  value={"단원유형별"}
                  onClick={selectTag}
                  $isSelected={questionTagSet.includes("단원유형별")}
                >
                  단원유형별
                </FILTER.CategoryBtn>
                <FILTER.CategoryBtn
                  value={"시중교재"}
                  onClick={selectTag}
                  $isSelected={questionTagSet.includes("시중교재")}
                >
                  시중교재
                </FILTER.CategoryBtn>
                <FILTER.CategoryBtn
                  value={"모의고사"}
                  onClick={selectTag}
                  $isSelected={questionTagSet.includes("모의고사")}
                >
                  모의고사
                </FILTER.CategoryBtn>
              </FILTER.ButtonContainer>
            </FILTER.FilterLine>
            <FILTER.SetContainer>
              <FILTER.CloseBtn
                onClick={() => {
                  setIsFilterModalOn(false);
                }}
              >
                닫기
              </FILTER.CloseBtn>
              <FILTER.ResetBtn
                onClick={() => {
                  setFiveYears();
                  setQuestionTagSet(["단원유형별", "시중교재", "모의고사"]);
                }}
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                {` 전체 초기화`}
              </FILTER.ResetBtn>
            </FILTER.SetContainer>
          </FILTER.Modal>
        )}
        <MQP.ListHeader>
          {attributes.map((att, index) => (
            <MQP.AttributeBox key={`att_${index}`} $width={widths[index]} $isTitle={att === "학습지명"}>
              {att}
            </MQP.AttributeBox>
          ))}
        </MQP.ListHeader>
        <MQP.ListContainer $shorten={selectedPaperIds.length > 0}>
          {papersToRender.map((paper, index) => (
            <MQP.QuestionPaperLine key={`paper_${index}`}>
              <MQP.CellBox
                $width={widths[0]}
                style={{ height: `6rem`, cursor: `pointer` }}
                onClick={() => {
                  selectPaper(paper);
                }}
              >
                <MQP.CheckBox $isChecked={paper.selected}>
                  {1 === 1 ? <FontAwesomeIcon icon={faCheck} /> : ""}
                </MQP.CheckBox>
              </MQP.CellBox>
              <MQP.CellBox $width={widths[1]}>
                {getKoreanGrade(paper.school, paper.subject, paper.semester)}
              </MQP.CellBox>
              <MQP.CellBox $width={widths[2]}>
                <MQP.TagBox $tag={paper.questionTag}>{paper.questionTag.slice(0, 4)}</MQP.TagBox>
              </MQP.CellBox>
              <MQP.CellBox $width={widths[3]} $isTitle={true}>
                <MQP.PaperTitleLine>
                  {cutLongText(paper.title, 30)}
                  {paper.category === "MULTIPLE" && <MQP.AutoEvaluateBox>자동채점</MQP.AutoEvaluateBox>}
                </MQP.PaperTitleLine>
                <MQP.DescriptionText>{`${paper.questionNum}문제 | ${levelToKorean[paper.level]} | ${
                  paper.boundary
                }`}</MQP.DescriptionText>
              </MQP.CellBox>
              <MQP.CellBox $width={widths[4]}>{formatDate(paper.createdAt)}</MQP.CellBox>
              <MQP.CellBox $width={widths[5]}>{paper.makerName}</MQP.CellBox>
              <MQP.CellBox $width={widths[6]}>
                <MQP.InnerBtn
                  $width={4}
                  onClick={() => {
                    openPreview(paper);
                  }}
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                </MQP.InnerBtn>
              </MQP.CellBox>
              <MQP.CellBox $width={widths[7]}>
                <MQP.InnerBtn
                  $width={10}
                  onClick={() => {
                    openPresent(paper, paper.id);
                  }}
                >
                  출제하기
                </MQP.InnerBtn>
              </MQP.CellBox>
              <MQP.CellBox $width={widths[8]}>
                <MQP.MoreInfoBtn
                  onClick={() => {
                    onLookMore(index);
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </MQP.MoreInfoBtn>
                {index == lookMoreIndex && (
                  <MQP.MoreInfo>
                    <MQP.MoreBtn
                      onClick={() => {
                        setPaperToDelete(paper.id);
                        setIsWarning(true);
                      }}
                    >
                      삭제
                    </MQP.MoreBtn>
                    <MQP.MoreBtn
                      onClick={() => {
                        setPaperToDownload(paper);
                        setIsDownloading(true);
                      }}
                    >
                      다운로드
                    </MQP.MoreBtn>
                  </MQP.MoreInfo>
                )}
              </MQP.CellBox>
            </MQP.QuestionPaperLine>
          ))}
        </MQP.ListContainer>

        {selectedPaperIds.length > 0 ? (
          <MQP.BottomLine>
            <MQP.BottomText>{`질문 ${selectedPaperIds.length}개 선택됨`}</MQP.BottomText>
            <MQP.BatchActionBtn onClick={openPresentMany}>
              <FontAwesomeIcon icon={faUsers} style={{ marginBottom: "0.75rem" }} />
              일괄출제
            </MQP.BatchActionBtn>
            <MQP.BatchActionBtn onClick={openDownloadMany}>
              <FontAwesomeIcon icon={faCloudArrowDown} style={{ marginBottom: "0.75rem" }} />
              다운로드
            </MQP.BatchActionBtn>
            <MQP.BatchActionBtn onClick={openWarningBatch}>
              <FontAwesomeIcon icon={faTrash} style={{ marginBottom: "0.75rem" }} />
              전부삭제
            </MQP.BatchActionBtn>
            <MQP.DeselectBtn onClick={deselectAll}>
              <FontAwesomeIcon icon={faXmark} />
            </MQP.DeselectBtn>
          </MQP.BottomLine>
        ) : null}
      </MQP.ManageSection>
    </MQP.Wrapper>
  );
};

export default ManageQuestionPaper;

const MQP = {
  Wrapper: styled.div`
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: auto; /*standard: 1400*/
    height: 80rem;
    margin-top: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
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
  `,
  FilterLine: styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 1.5rem;
  `,
  FilterBtn: styled.button`
    width: 9rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    background-color: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray60};
    margin-left: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
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
    margin-right: 1rem;
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

  /** 속성 */
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `3.25rem` : "0rem")};
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
    padding-inline: ${({ $isTitle }) => ($isTitle ? `3.25rem` : "0rem")};
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
  PaperTitleLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray80};
  `,
  AutoEvaluateBox: styled.div`
    width: 6rem;
    height: 2rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray40};
    color: white;
    font-size: 1.2rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
  `,
  DescriptionText: styled.span`
    color: ${({ theme }) => theme.colors.gray50};
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0.5rem;
  `,
  TagBox: styled.div`
    width: 7rem;
    height: 3rem;
    border-radius: 0.6rem;
    background-color: ${({ $tag, theme }) =>
      $tag === "모의고사" ? theme.colors.warning : $tag === "시중교재" ? theme.colors.mainColor : theme.colors.gray40};
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
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
    margin-right: 22rem;
    margin-top: -4.1rem;
    display: flex;
    flex-direction: row;
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
    margin-right: 0.5rem;
    &:last-child {
      margin-right: 0rem;
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

const SCHOOLSEM = {
  SchoolOptionContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
    height: 4rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-right: 0.5rem;
  `,
  BtnContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-left: 0.5rem;
  `,
  RoundBtn: styled.button`
    width: 5rem;
    height: 4.5rem;
    border-radius: 0.6rem;
    margin-right: 1rem;
    font-size: 1.6rem;
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray50)};
    border: solid
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.1rem ${theme.colors.mainColor}` : `0rem ${theme.colors.unselected}`};
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

const FILTER = {
  Modal: styled.div`
    position: absolute;

    z-index: 5; /* Ensure the dropdown is above other elements */
    margin-left: 28.5rem;
    margin-top: 6rem;
    background: white;
    border: 0.02rem solid ${({ theme }) => theme.colors.brightGray};
    border-radius: 0.5rem;
    box-shadow: 0rem 1rem 2rem rgba(0, 0, 0, 0.3);
    width: 50rem;
    //height: 25rem;
  `,
  Title: styled.div`
    display: flex;
    align-items: center;
    width: 50rem;
    height: 5rem;
    padding-left: 2rem;
    margin-top: 1rem;
    font-size: 1.75rem;
    font-weight: 600;
  `,
  FilterLine: styled.div`
    width: 50rem;
    height: 6rem;
    display: flex;
    align-items: center;
    font-size: 1.75rem;
    font-weight: 600;
  `,
  Label: styled.div`
    margin-left: 2rem;

    width: 15rem;
    font-size: 1.6rem;
    font-weight: 600;
  `,
  DateInput: styled(DatePicker)`
    width: 13rem;
    height: 4.5rem;
    border: 1px solid ${({ theme }) => theme.colors.unselected};
    border-radius: 0.25rem;
    padding: 0.5rem;
    box-sizing: border-box;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    margin-inline: 1rem;
  `,
  ButtonContainer: styled.div`
    padding: 0.25rem;
    width: 34rem;
    display: flex;
    justify-content: space-between;
    padding-left: 1.25rem;
    padding-right: 2.5rem;
  `,
  CategoryBtn: styled.button`
    height: 4rem;
    border-radius: 4rem;

    padding-inline: 1rem;
    box-shadow: 0 0 0
      ${({ $isSelected, theme }) =>
        $isSelected ? `0.2rem${theme.colors.mainColor} inset` : `0.1rem${theme.colors.unselected} inset`};
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : `white`)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.gray60)};
    font-size: 1.5rem;
    font-weight: 600;
  `,
  SetContainer: styled.div`
    height: 6rem;
    width: 50rem;
    display: flex;
    flex-direction: row;
    padding-block: 1rem;
    padding-inline: 1.5rem;
  `,
  CloseBtn: styled.button`
    font-size: 1.6rem;
    font-weight: 600;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    color: ${({ theme }) => theme.colors.gray60};
    width: 10rem;
    height: 4rem;
  `,
  ResetBtn: styled.button`
    margin-left: auto;
    margin-right: 0.5rem;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray40};
  `,
  SaveBtn: styled.button`
    margin-left: auto;
    margin-right: 0.5rem;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.mainColor};
  `,
};
