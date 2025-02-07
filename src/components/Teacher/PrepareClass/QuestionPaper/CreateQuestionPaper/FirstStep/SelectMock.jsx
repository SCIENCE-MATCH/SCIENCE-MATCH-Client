import {
  faCaretDown,
  faCaretUp,
  faCheck,
  faO,
  faPlusCircle,
  faRefresh,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import usePostGetMockIds from "../../../../../../libs/apis/Teacher/Prepare/Mock/postGetMockIds";
const SelectMock = ({ mockList, setMockList, mockChapters, setMockChapters }) => {
  const { mockIds, getMockIds } = usePostGetMockIds();
  const [selectMode, setSelectMode] = useState(mockList.length === 0);
  const [publishers, setPublishers] = useState([
    { name: "평가원", selected: true },
    { name: "교육청", selected: false },
    { name: "대성", selected: false },
    { name: "시대인재", selected: false },
    { name: "종로", selected: false },
    { name: "이투스", selected: false },
    { name: "메가스터디", selected: false },
  ]);
  const subjectToKr = { SCIENCE: "고", PHYSICS: "물", BIOLOGY: "생", CHEMISTRY: "화", EARTH_SCIENCE: "지" };
  const subjectToEng = { 고: "SCIENCE", 물: "PHYSICS", 생: "BIOLOGY", 화: "CHEMISTRY", 지: "EARTH_SCIENCE" };

  const [currentMockIndex, setCurrentMockIndex] = useState(null);
  const [hoveredMock, setHoveredMock] = useState(null);
  const [subjectList, setSubjectList] = useState(["고1"]);
  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  const monthArr = [3, 4, 5, 6, 7, 9, 10, 11];
  const [addByChap, setAddByChap] = useState(false);
  const today = new Date();
  const thisYear = today.getFullYear();
  const initSettings = () => {
    setSubjectList(["고1"]);
    setYearList([]);
    setMonthList([]);
    setAddByChap(false);
    setPublishers([
      { name: "평가원", selected: true },
      { name: "교육청", selected: false },
      { name: "대성", selected: false },
      { name: "시대인재", selected: false },
      { name: "종로", selected: false },
      { name: "이투스", selected: false },
      { name: "메가스터디", selected: false },
    ]);
  };
  const onSubjectClick = (subject) => {
    if (subjectList.some((i) => i === subject)) setSubjectList(subjectList.filter((i) => i !== subject));
    else if (subjectList.length > 0 && subjectList[0][0] === subject[0]) setSubjectList([...subjectList, subject]);
    else setSubjectList([subject]);
  };
  const onYearClick = (year) => {
    if (yearList.some((i) => i === year)) {
      setYearList(yearList.filter((i) => i !== year));
    } else {
      setYearList([...yearList, year]);
    }
  };
  const onMonthClick = (month) => {
    if (monthList.some((i) => i === month)) {
      setMonthList(monthList.filter((i) => i !== month));
    } else {
      setMonthList([...monthList, month]);
    }
  };
  const onSubmit = () => {
    setCurrentMockIndex(null);
    setMockList([]);
    getMockIds(
      subjectToEng[subjectList[0][0]],
      yearList.length === 0 ? [2024, 2023, 2022, 2021, 2020] : yearList,
      monthList.length === 0 ? monthArr : monthList,
      publishers.filter((publisher) => publisher.selected).map((publisher) => publisher.name)
    );
    setSelectMode(false);
  };

  const twentyBoolArr = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const twentyTrueArr = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  const [numList, setNumList] = useState([...twentyBoolArr]);

  const sortFilteredList = (list) => {
    // Publisher 우선순위를 매핑
    const publisherPriority = Object.fromEntries(publishers.map((publisher, index) => [publisher.name, index]));
    // 정렬 실행
    return list.sort((a, b) => {
      // 1. subjectNum 오름차순
      if (a.subjectNum !== b.subjectNum) {
        return a.subjectNum - b.subjectNum;
      }
      // 2. year 오름차순
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      // 3. month 오름차순
      if (a.month !== b.month) {
        return a.month - b.month;
      }
      // 4. publisher 우선순위
      const aPublisherPriority = publisherPriority[a.publisher] ?? Infinity;
      const bPublisherPriority = publisherPriority[b.publisher] ?? Infinity;
      return aPublisherPriority - bPublisherPriority;
    });
  };
  useEffect(() => {
    if (mockIds.length > 0) {
      //subjectList = ["물1","물2"]
      const tempList = mockIds.map((mock) => ({ ...mock, selected: false, mockQuestions: [...twentyBoolArr] }));

      const validSubjectNums = subjectList.map((subject) => subject.slice(-1));

      const filteredList = tempList.filter((mock) => validSubjectNums.includes(mock.subjectNum?.toString()));
      setMockList(sortFilteredList(filteredList));
    }
  }, [mockIds]);

  const onSelectAll = () => {
    if (mockList.length > 0) {
      const prevSelectedAll = !numList.some((v) => !v);
      const tempMockList = mockList.map((mock) => {
        return {
          ...mock,
          selected: !prevSelectedAll,
          mockQuestions: mock.mockQuestions.map((ques) => !prevSelectedAll),
        };
      });
      setNumList(prevSelectedAll ? twentyBoolArr : twentyTrueArr);
      setMockList(tempMockList);
    }
  };
  const onBatchSelect = (num) => {
    if (mockList.length > 0) {
      const prevSelected = numList[num];
      const tempMockList = mockList.map((mock) => {
        return {
          ...mock,
          mockQuestions: mock.mockQuestions.map((ques, index) => (index === num ? !prevSelected : ques)),
        };
      });
      for (let i = 0; i < tempMockList.length; i++)
        tempMockList[i].selected = tempMockList[i].mockQuestions.some((ques) => ques);

      const tempNumList = [...numList];
      tempNumList[num] = !prevSelected;
      setNumList(tempNumList);
      setMockList(tempMockList);
    }
  };
  const onMockClick = (mock, index) => {
    setCurrentMockIndex(index);
    setHoveredMock(mock.csatId);
  };
  const onQuesClick = (index) => {
    const tempMockList = [...mockList];
    tempMockList[currentMockIndex].mockQuestions[index] = !tempMockList[currentMockIndex].mockQuestions[index];
    tempMockList[currentMockIndex].selected = tempMockList[currentMockIndex].mockQuestions.some((ques) => ques);

    const tempNumList = [...numList];
    for (let target = 0; target < 20; target++)
      tempNumList[target] = !tempMockList.some((mock) => !mock.mockQuestions[target]);

    setNumList(tempNumList);
    setMockList(tempMockList);
  };

  const scrollContainerRef = useRef(null);
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      const onWheel = (event) => {
        event.preventDefault();
        scrollContainer.scrollLeft += event.deltaY;
      };

      scrollContainer.addEventListener("wheel", onWheel);

      return () => {
        scrollContainer.removeEventListener("wheel", onWheel);
      };
    }
  }, []);

  return (
    <SM.Wrapper>
      <SM.TitleLine>
        <SM.SelectModeBtn $isOn={selectMode} onClick={() => setSelectMode((prev) => !prev)}>
          수능/모의고사 선택
          <FontAwesomeIcon icon={selectMode ? faCaretUp : faCaretDown} style={{ marginLeft: `1rem` }} />
        </SM.SelectModeBtn>
        <SM.DeleteAllBtn
          onClick={() => {
            if (mockList.length > 0) {
              setMockList(mockIds.map((mock) => ({ ...mock, selected: false, mockQuestions: [...twentyBoolArr] })));
              setNumList(twentyBoolArr);
            }
          }}
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: `1rem` }} />
          전체 삭제
        </SM.DeleteAllBtn>
      </SM.TitleLine>
      <MOCKDETAIL.NumberLine $isHidden={selectMode}>
        <MOCKDETAIL.NumberLabel onClick={onSelectAll}>일괄 선택</MOCKDETAIL.NumberLabel>
        <MOCKDETAIL.RowScrollBar ref={scrollContainerRef}>
          <MOCKDETAIL.NumberBtnContainer>
            {numList.map((opt, index) => (
              <MOCKDETAIL.NumberBtn key={`Num_${index}`} $isChecked={opt} onClick={() => onBatchSelect(index)}>
                {index + 1}
              </MOCKDETAIL.NumberBtn>
            ))}
          </MOCKDETAIL.NumberBtnContainer>
        </MOCKDETAIL.RowScrollBar>
      </MOCKDETAIL.NumberLine>
      {selectMode ? (
        <React.Fragment>
          <SM.SelectWrapper>
            <SM.SubjectSection>
              <SM.LabelLine>
                <SM.OptionLabel>과목 선택</SM.OptionLabel>
                <SM.DetailLabel>
                  과목 교차 <FontAwesomeIcon icon={faX} />
                </SM.DetailLabel>
              </SM.LabelLine>
              <SM.TwoLineContainer>
                {["고1", "물리1", "물리2", "화학1", "화학2", "생명1", "생명2", "지구1", "지구2"].map((opt, index) => (
                  <SM.ListedOption
                    $isSelected={subjectList.includes(opt)}
                    $isTwoFrame={index == 0}
                    key={`Subj_${index}`}
                    onClick={() => onSubjectClick(opt)}
                  >
                    {opt}
                  </SM.ListedOption>
                ))}
              </SM.TwoLineContainer>
            </SM.SubjectSection>
            <SM.YearSection>
              <SM.LabelLine>
                <SM.OptionLabel>년도 선택</SM.OptionLabel>
                <SM.DetailLabel>
                  복수 선택 <FontAwesomeIcon icon={faO} />
                </SM.DetailLabel>
              </SM.LabelLine>
              <SM.TwoLineContainer>
                <SM.ListedOption onClick={() => setYearList([])} $isSelected={yearList.length === 0} $isTwoFrame={true}>
                  전체
                </SM.ListedOption>
                {Array.from({ length: 7 }, (_, index) => (
                  <SM.ListedOption
                    $isSelected={yearList.includes(thisYear - index)}
                    onClick={() => onYearClick(thisYear - index)}
                  >
                    {thisYear - index}
                  </SM.ListedOption>
                ))}
                <SM.MoreOption>
                  <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: `0.5rem`, width: `1.7rem` }} />
                  더보기
                </SM.MoreOption>
              </SM.TwoLineContainer>
            </SM.YearSection>
            <SM.MonthSection>
              <SM.LabelLine>
                <SM.OptionLabel>월 선택</SM.OptionLabel>
                <SM.DetailLabel>
                  복수 선택 <FontAwesomeIcon icon={faO} />
                </SM.DetailLabel>
              </SM.LabelLine>
              <SM.TwoLineContainer>
                <SM.ListedOption
                  onClick={() => setMonthList([])}
                  $isSelected={monthList.length === 0}
                  $isTwoFrame={true}
                >
                  전체
                </SM.ListedOption>
                {[3, 4, 5, 6, 7, 9, 10, 11].map((opt, index) => (
                  <SM.ListedOption
                    onClick={() => onMonthClick(opt)}
                    $isSelected={monthList.includes(opt)}
                    key={`Mont_${index}`}
                  >
                    {opt}월
                  </SM.ListedOption>
                ))}
              </SM.TwoLineContainer>
            </SM.MonthSection>
            <SM.QuesAttSection>
              <SM.OptionLabel>문제 선택 기준</SM.OptionLabel>
              <SM.OneLineContainer>
                {[false, true].map((opt) => (
                  <SM.ListedOption $isSelected={addByChap === opt} onClick={() => setAddByChap(opt)}>
                    {opt ? "단원으로" : "문제 번호로"}
                  </SM.ListedOption>
                ))}
              </SM.OneLineContainer>
            </SM.QuesAttSection>
          </SM.SelectWrapper>
          <SM.PublisherLine>
            <SM.LabelLine>
              <SM.OptionLabel style={{ marginBottom: `2.5rem` }}>출제 기관</SM.OptionLabel>
              <SM.DetailLabel>
                복수 선택 <FontAwesomeIcon icon={faO} />
              </SM.DetailLabel>
              <SM.InitBtn
                style={{ margin: `0rem`, marginTop: `-0.75rem`, marginLeft: `auto`, height: `3.5rem` }}
                onClick={() => {
                  if (publishers.some((pub) => !pub.selected))
                    setPublishers((prevPublishers) =>
                      prevPublishers.map((prevPub) => ({ ...prevPub, selected: true }))
                    );
                  else
                    setPublishers((prevPublishers) =>
                      prevPublishers.map((prevPub) => ({ ...prevPub, selected: false }))
                    );
                }}
              >
                {publishers.some((pub) => !pub.selected) ? `일괄 선택` : `일괄 해제`}
              </SM.InitBtn>
            </SM.LabelLine>
            <SM.HorizentalContainer>
              {publishers.map((publisher) => (
                <SM.ListedOption
                  $isSelected={publisher.selected}
                  onClick={() =>
                    setPublishers((prevPublishers) =>
                      prevPublishers.map((prevPub) =>
                        prevPub.name === publisher.name ? { ...prevPub, selected: !prevPub.selected } : prevPub
                      )
                    )
                  }
                >
                  {publisher.name}
                </SM.ListedOption>
              ))}
            </SM.HorizentalContainer>
          </SM.PublisherLine>
          <SM.ButtonLine>
            <SM.InitBtn onClick={initSettings}>
              <FontAwesomeIcon icon={faRefresh} style={{ marginRight: `1rem` }} />
              초기화
            </SM.InitBtn>
            <SM.WarningText>
              {subjectList.length === 0 && !publishers.some((pub) => pub.selected)
                ? "과목과 출제 기관을 선택하세요"
                : subjectList.length === 0
                ? "과목을 선택하세요"
                : !publishers.some((pub) => pub.selected)
                ? "출제 기관을 선택하세요"
                : ""}
            </SM.WarningText>
            <SM.ConfirmBtn
              onClick={onSubmit}
              disabled={subjectList.length === 0 || !publishers.some((pub) => pub.selected)}
            >
              선택 완료
            </SM.ConfirmBtn>
          </SM.ButtonLine>
        </React.Fragment>
      ) : (
        <SM.SelectWrapper>
          <MOCKDETAIL.Wrapper>
            <MOCKDETAIL.MockAndQuestion>
              <CHAPTERSCOPE.MockListSection>
                {mockList.map((mock, index) => (
                  <React.Fragment key={`month_${index}`}>
                    <CHAPTERSCOPE.ChapterLine $level={0} $isExpanded={true}>
                      <CHAPTERSCOPE.DescriptionBox>
                        {subjectToKr[mock.subject]}
                        {mock.subjectNum} | {mock.year}년 {mock.month}월
                      </CHAPTERSCOPE.DescriptionBox>
                    </CHAPTERSCOPE.ChapterLine>
                    <CHAPTERSCOPE.ChapterLine
                      key={`mock${index}`}
                      $level={1}
                      $isShowing={currentMockIndex === index}
                      onMouseEnter={() => setHoveredMock(mock)}
                      onMouseLeave={() => setHoveredMock(null)}
                      onClick={() => {
                        onMockClick(mock, index);
                      }}
                    >
                      <CHAPTERSCOPE.CheckBox $isChecked={mock.selected} $isHovering={hoveredMock === mock.csatId}>
                        {mock.selected ? <FontAwesomeIcon icon={faCheck} /> : ""}
                      </CHAPTERSCOPE.CheckBox>
                      <CHAPTERSCOPE.DescriptionBox
                        $isHovering={hoveredMock === mock.csatId || currentMockIndex === index}
                      >
                        {mock.publisher}
                      </CHAPTERSCOPE.DescriptionBox>
                    </CHAPTERSCOPE.ChapterLine>
                  </React.Fragment>
                ))}
              </CHAPTERSCOPE.MockListSection>
              <CHAPTERSCOPE.QuestionListSection>
                <CHAPTERSCOPE.QuesSectionTitle>문제 선택</CHAPTERSCOPE.QuesSectionTitle>
                {currentMockIndex !== null ? (
                  <CHAPTERSCOPE.QuestionList>
                    {mockList[currentMockIndex].mockQuestions.map((opt, index) => (
                      <CHAPTERSCOPE.QuestionNumber onClick={() => onQuesClick(index)}>
                        <CHAPTERSCOPE.CheckBox $isChecked={opt} style={{ marginRight: `0.75rem` }}>
                          {opt ? <FontAwesomeIcon icon={faCheck} /> : ""}
                        </CHAPTERSCOPE.CheckBox>
                        {index + 1}번
                      </CHAPTERSCOPE.QuestionNumber>
                    ))}
                  </CHAPTERSCOPE.QuestionList>
                ) : (
                  <CHAPTERSCOPE.NoMockMsg>
                    {mockList.length === 0
                      ? `모의고사를 불러올 범위를 선택해주세요.`
                      : `선택된 모의고사가 없습니다. 왼쪽에서 선택해주세요.`}
                  </CHAPTERSCOPE.NoMockMsg>
                )}
              </CHAPTERSCOPE.QuestionListSection>
            </MOCKDETAIL.MockAndQuestion>
          </MOCKDETAIL.Wrapper>
        </SM.SelectWrapper>
      )}
    </SM.Wrapper>
  );
};

export default SelectMock;

const SM = {
  Wrapper: styled.div`
    background: white;
    overflow: hidden;
    width: 86.5rem;
    height: 69rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    background-color: white;
    height: 7rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  SelectModeBtn: styled.button`
    font-size: 1.8rem;
    font-weight: 600;
    color: ${({ theme, $isOn }) => ($isOn ? theme.colors.mainColor : theme.colors.gray60)};
  `,
  DeleteAllBtn: styled.button`
    width: 14rem;
    height: 5rem;
    border-radius: 0.4rem;
    margin-left: auto;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    font-size: 1.8rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.unselected};
  `,

  SelectWrapper: styled.div`
    display: flex;
    flex-direction: row;
  `,
  SubjectSection: styled.div`
    display: flex;
    flex-direction: column;
    padding: 4rem 2rem;
    border-right: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    border-bottom: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    height: 40rem;
  `,
  YearSection: styled.div`
    display: flex;
    flex-direction: column;
    padding: 4rem 2rem;
    border-right: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    border-bottom: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    height: 40rem;
  `,
  MonthSection: styled.div`
    display: flex;
    flex-direction: column;
    padding: 4rem 2rem;
    border-right: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    border-bottom: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    height: 40rem;
  `,
  QuesAttSection: styled.div`
    display: flex;
    flex-direction: column;
    padding: 4rem 2rem;
    border-bottom: 0.025rem solid ${({ theme }) => theme.colors.gray20};
    height: 40rem;
  `,
  PublisherLine: styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    height: 13rem;
    border-bottom: 0.025rem solid ${({ theme }) => theme.colors.gray20};
  `,
  LabelLine: styled.div`
    display: flex;
    flex-direction: row;
  `,
  OptionLabel: styled.div`
    margin-right: 1rem;
    font-size: 1.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray};
  `,
  DetailLabel: styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray40};
  `,
  OneLineContainer: styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 2.5rem;
    :nth-child(n) {
      width: 16rem;
    }
  `,
  TwoLineContainer: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 2.5rem;
    :nth-child(n) {
      width: 8.5rem;
    }
  `,
  HorizentalContainer: styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
  `,
  ListedOption: styled.button`
    flex: 1;
    height: 4.5rem;
    border-radius: 0.4rem;
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    font-size: 1.7rem;
    font-weight: bold;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    ${({ $isTwoFrame }) =>
      $isTwoFrame &&
      css`
        &:nth-child(n) {
          grid-column: span 2;
          width: 18rem;
        }
      `}
  `,
  MoreOption: styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 4.5rem;
    border-radius: 0.4rem;
    border: 0.1rem solid ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    font-size: 1.7rem;
    font-weight: bold;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.brightMain : "white")};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.mainColor : theme.colors.unselected)};
    cursor: pointer;
  `,

  ButtonLine: styled.div`
    background-color: white;
    height: 9rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
  InitBtn: styled.button`
    width: 13rem;
    height: 5rem;
    border-radius: 0.4rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
    font-size: 1.8rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.unselected};
  `,
  WarningText: styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.warning};
    margin-left: auto;
  `,
  ConfirmBtn: styled.button`
    width: 16rem;
    height: 5rem;
    border-radius: 0.4rem;
    margin-left: 2rem;
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    background-color: ${({ theme }) => theme.colors.mainColor};
    :disabled {
      cursor: not-allowed;
    }
  `,
};

const MOCKDETAIL = {
  Wrapper: styled.div``,
  NumberLine: styled.div`
    display: flex;
    flex-direction: row;
    height: ${({ $isHidden }) => ($isHidden ? `0rem` : `6rem`)};
    align-items: center;
    padding-left: 1.5rem;
    border-bottom: solid ${({ $isHidden, theme }) => ($isHidden ? `0rem` : `0.1rem ${theme.colors.gray20}`)};
    overflow: hidden;
  `,
  NumberLabel: styled.button`
    height: 4rem;
    font-size: 1.8rem;
    font-weight: 600;
    width: 12rem;
    margin-right: 1rem;
    border-right: 0.01rem solid black;
    color: ${({ theme }) => theme.colors.deepDark};
  `,
  RowScrollBar: styled.div`
    width: 72rem;
    height: 5rem;
    overflow: hidden;
    align-items: center;

    &:hover {
      overflow-x: scroll;
    }
    &::-webkit-scrollbar {
      height: 0rem; /* 세로 스크롤바의 너비 */
    }
  `,
  NumberBtnContainer: styled.div`
    width: max-content;
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding-right: 1.5rem;
  `,
  NumberBtn: styled.button`
    width: 5.2rem;
    height: 4rem;
    font-size: 1.75rem;
    font-weight: 600;
    border-radius: 3rem;
    border: solid
      ${({ theme, $isChecked }) => ($isChecked ? `0.2rem ${theme.colors.mainColor}` : `0.01rem ${theme.colors.gray20}`)};
    color: ${({ theme, $isChecked }) => ($isChecked ? theme.colors.mainColor : theme.colors.gray40)};
  `,
  ToTheEndBtn: styled.button``,
  MockAndQuestion: styled.div`
    display: flex;
    flex-direction: row;
  `,
};
const CHAPTERSCOPE = {
  ScopeSection: styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
  `,
  MockListSection: styled.div`
    background-color: white;
    width: 30rem;
    height: 55rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem;
      display: block;
    }
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected};
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  QuestionListSection: styled.div`
    width: 56.25rem;
    height: 55rem;
    overflow: hidden;
  `,
  QuesSectionTitle: styled.div`
    font-size: 1.8rem;
    font-weight: 600;
    padding-left: 3rem;
    height: 5rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    margin-bottom: 2rem;
  `,
  QuestionList: styled.div`
    width: 56.25rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding-left: 3rem;
  `,
  ChapterLine: styled.div`
    width: 30rem;
    background-color: ${({ $level, $isShowing, theme }) =>
      $level === 0 ? theme.colors.gray05 : $isShowing ? theme.colors.lightMain : `white`};
    height: 4.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.8rem;
    //border: 0.1rem black solid;
    padding-left: ${({ $level }) => $level * 2.5 + 1.5}rem;
    padding-right: 1rem;
    cursor: ${({ $level }) => ($level ? `pointer` : `default`)};
  `,
  ExpansionSection: styled.div`
    height: 4rem;
    width: 5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: ${({ $isExpanded, theme }) => ($isExpanded ? theme.colors.deepDark : theme.colors.unselected)};
    cursor: pointer;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray40};
          `};
  `,
  CheckBox: styled.div`
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    border: 0.2rem
      ${({ $isChecked, $isHovering, theme }) =>
        $isChecked || $isHovering ? theme.colors.mainColor : theme.colors.unselected}
      solid;
    color: white;
    background-color: ${({ $isChecked, theme }) => ($isChecked ? theme.colors.mainColor : "white")};
    font-size: 2rem;
    text-align: center;
    overflow: hidden;
  `,
  DescriptionBox: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.5rem;
    margin-left: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    width: 25rem;
    ${({ $isHovering, theme }) =>
      $isHovering
        ? css`
            color: ${theme.colors.mainColor};
          `
        : css`
            color: ${theme.colors.gray50};
          `};
  `,
  MockAndQuestion: styled.div`
    width: 56.4rem;
    margin-bottom: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈을 허용 */
    justify-content: flex-start;
    align-items: center;
    padding-left: 3rem;
    padding-top: 5rem;
  `,
  QuestionNumber: styled.div`
    width: 9rem;
    height: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 3rem;
    margin-right: 0.5rem;
    cursor: pointer;
  `,
  NoMockMsg: styled.div`
    font-size: 1.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.warning};
    margin-left: 3rem;
  `,
};
