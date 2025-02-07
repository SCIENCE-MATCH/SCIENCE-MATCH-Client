import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import usePostAddQuestion from "../../../../../libs/apis/Admin/Question/postAddQuestion";
import usePostGetMockQuestions from "../../../../../libs/apis/Admin/Question/getMockQuestions";
import NormalChapterForMock from "./NomalChapForMock";

const AddMock = ({ currentMock }) => {
  const { postAddQuestion } = usePostAddQuestion();
  const { mockQuestions, postGetMockQuestions } = usePostGetMockQuestions();

  const [questions, setQuestions] = useState([]);

  const [chapToAdd, setChapToAdd] = useState({ id: null, description: null });
  const [questionFile, setQuestionFile] = useState(null);
  const [questionImage, setQuestionImage] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [solutionImage, setSolutionImage] = useState(null);

  const [selectingChapter, setSelectingChapter] = useState(false);

  const koToEng = { 고1: "SCIENCE", 물리: "PHYSICS", 화학: "CHEMISTRY", 생명: "BIOLOGY", 지구: "EARTH_SCIENCE" };

  useEffect(() => {
    setQuestions([]);
    if (currentMock.csatId)
      postGetMockQuestions(koToEng[currentMock.grade], currentMock.year, currentMock.month, currentMock.publisher);
    else setNumToAdd(null);
  }, [currentMock]);
  const DeleteQuestionImg = () => {
    setQuestionImage(null);
    setQuestionFile(null);
  };
  const onQuestionImgChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setQuestionFile(file);
      const reader = new FileReader();
      reader.onload = () => setQuestionImage(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일을 선택하세요.");
    }
    event.target.value = null;
  };

  const onSolutionImgChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSolutionFile(file);
      const reader = new FileReader();
      reader.onload = () => setSolutionImage(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일을 선택하세요.");
    }
    event.target.value = null;
  };

  const DeleteSolutionImg = () => {
    setSolutionImage(null);
    setSolutionFile(null);
  };

  const difficultyOption = ["하", "중하", "중", "중상", "상"];
  const [difficulty, setDifficulty] = useState("중");

  const answerOption = [1, 2, 3, 4, 5];
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(2);

  const uploadQuestion = async () => {
    await postAddQuestion(
      difficulty,
      chapToAdd,
      solutionFile,
      answer,
      questionFile,
      "선택형",
      score,
      "NORMAL",
      null,
      null,
      numToAdd,
      currentMock.csatId
    );

    await postGetMockQuestions(koToEng[currentMock.grade], currentMock.year, currentMock.month, currentMock.publisher);
    setNumToAdd(null);
    setAnswer("");
    DeleteQuestionImg();
    DeleteSolutionImg();
    setScore(2);
  };

  const BackToList = () => {
    setNumToAdd(null);

    setAnswer("");
    DeleteQuestionImg();
    DeleteSolutionImg();
    setScore(2);
  };
  const [numToAdd, setNumToAdd] = useState(null);

  useEffect(() => {
    const targetArray = Array.from({ length: 20 }, (_, index) => ({
      quesOrder: index + 1,
      questionId: null,
      imageURL: null,
    }));

    mockQuestions.forEach((data, index) => {
      if (index < targetArray.length) {
        targetArray[index].questionId = data.questionId;
        targetArray[index].imageURL = data.imageURL;
      }
    });
    setQuestions(targetArray);
  }, [mockQuestions]);
  return numToAdd !== null ? (
    <RQ.Wrapper>
      {selectingChapter && (
        <NormalChapterForMock
          chapToAdd={chapToAdd}
          setChapToAdd={setChapToAdd}
          mockGrade={currentMock.grade}
          mockSemester={currentMock.semester}
          setSelectingChapter={setSelectingChapter}
        />
      )}
      <RQ.TitleLine>
        <RQ.TitleBox>문제 추가</RQ.TitleBox>
        <RQ.ChapterDescription style={{ width: "30rem", marginLeft: `-0.75rem`, marginRight: `2rem` }}>
          {currentMock.publisher} {currentMock.grade} {currentMock.year}년 {currentMock.month}월
        </RQ.ChapterDescription>
        <RQ.ChapterLabel style={{ fontSize: `2.5rem` }}>{numToAdd}번</RQ.ChapterLabel>
      </RQ.TitleLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 단원명</RQ.ChapterLabel>
        {chapToAdd.description === null ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 단원이 없습니다.
            단원을 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription style={{ width: "50rem" }}>{chapToAdd.description}</RQ.ChapterDescription>
        )}
        <RQ.SelectChapterBtn onClick={() => setSelectingChapter((prev) => !prev)}>단원 선택</RQ.SelectChapterBtn>
      </RQ.ChapterLine>
      <RQ.OptionLine>
        <RQ.OptionLabel>난이도</RQ.OptionLabel>
        <RQ.OptionBtnBox>
          {difficultyOption.map((opt) => (
            <RQ.OptionBtn key={`diff_${opt}`} $isSelected={difficulty === opt} onClick={() => setDifficulty(opt)}>
              {opt}
            </RQ.OptionBtn>
          ))}
        </RQ.OptionBtnBox>
      </RQ.OptionLine>
      <RQ.OptionLine>
        <RQ.OptionLabel>점수</RQ.OptionLabel>
        {true ? (
          <RQ.OptionBtnBox>
            {[2, 3].map((opt) => (
              <RQ.OptionBtn key={`score_${opt}`} $isSelected={score === opt} onClick={() => setScore(opt)}>
                {opt}점
              </RQ.OptionBtn>
            ))}
          </RQ.OptionBtnBox>
        ) : (
          <RQ.OptionInput />
        )}
      </RQ.OptionLine>
      <RQ.OptionLine>
        <RQ.OptionLabel>정답</RQ.OptionLabel>
        <RQ.OptionBtnBox>
          {answerOption.map((opt) => (
            <RQ.OptionBtn key={`answer_${opt}`} $isSelected={answer === opt} onClick={() => setAnswer(opt)}>
              {opt}
            </RQ.OptionBtn>
          ))}
        </RQ.OptionBtnBox>
      </RQ.OptionLine>
      <RQ.ImgLine>
        <RQ.ImgContainer>
          <RQ.ImgLabelLine>
            <RQ.ImgLabel>문제 이미지</RQ.ImgLabel>
            <RQ.SelectBtn htmlFor="question_input">
              이미지 선택
              <RQ.FileInput id="question_input" type="file" onChange={onQuestionImgChange} accept="image/*" />
            </RQ.SelectBtn>
          </RQ.ImgLabelLine>
          <RQ.ImgBox>
            {questionImage ? <RQ.Image src={questionImage} /> : <RQ.NoImgMsg>선택된 이미지가 없습니다.</RQ.NoImgMsg>}
          </RQ.ImgBox>
        </RQ.ImgContainer>
        <RQ.ImgContainer>
          <RQ.ImgLabelLine>
            <RQ.ImgLabel>해설 이미지</RQ.ImgLabel>
            <RQ.SelectBtn htmlFor="solution_input">
              이미지 선택
              <RQ.FileInput id="solution_input" type="file" onChange={onSolutionImgChange} accept="image/*" />
            </RQ.SelectBtn>
          </RQ.ImgLabelLine>
          <RQ.ImgBox>
            {solutionImage ? <RQ.Image src={solutionImage} /> : <RQ.NoImgMsg>선택된 이미지가 없습니다.</RQ.NoImgMsg>}
          </RQ.ImgBox>
        </RQ.ImgContainer>
      </RQ.ImgLine>
      <RQ.SubmitLine>
        <RQ.GoBackBtn onClick={BackToList}>돌아가기</RQ.GoBackBtn>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: "1rem" }} />
        저장되지 않습니다
        <RQ.AddBtn onClick={uploadQuestion} disabled={!currentMock.csatId || !questionFile || !solutionFile || !answer}>
          문제 저장
        </RQ.AddBtn>
      </RQ.SubmitLine>
    </RQ.Wrapper>
  ) : (
    <QUESLIST.Wrapper>
      <QUESLIST.TitleLine>
        <QUESLIST.TitleBox>모의고사 문제 목록</QUESLIST.TitleBox>
      </QUESLIST.TitleLine>
      <QUESLIST.ChapterLine>
        <QUESLIST.ChapterLabel>선택 회차</QUESLIST.ChapterLabel>
        {currentMock.publisher === null ? (
          <QUESLIST.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 모의고사가 없습니다.
            모의고사를 선택하세요.
          </QUESLIST.WarningDes>
        ) : (
          <QUESLIST.ChapterDescription>
            {currentMock.publisher} {currentMock.grade} {currentMock.year}년 {currentMock.month}월
          </QUESLIST.ChapterDescription>
        )}
      </QUESLIST.ChapterLine>
      <QUESLIST.ImgSection>
        {currentMock.csatId &&
          Array.from({ length: 20 }, (_, index) => (
            <QUESLIST.ImgContainer key={`img_${index}`}>
              <QUESLIST.ImgOptionLine>
                <QUESLIST.ImgNumber $isExist={true}>{index + 1}번</QUESLIST.ImgNumber>
                <QUESLIST.AddOrModifyBtn
                  onClick={() => {
                    currentMock.csatId && setNumToAdd(index + 1);
                  }}
                  $isEmpty={questions.length === 0 || questions[index].imageURL === null}
                >
                  {questions.length === 0 || questions[index].imageURL === null ? `문제 추가` : `문제 수정`}
                </QUESLIST.AddOrModifyBtn>
              </QUESLIST.ImgOptionLine>
              {questions.length === 0 || questions[index].imageURL === null ? (
                <QUESLIST.ImgBox>
                  <QUESLIST.NoImgMsg>문제가 없습니다.</QUESLIST.NoImgMsg>
                </QUESLIST.ImgBox>
              ) : (
                <QUESLIST.ImgBox>
                  <QUESLIST.Image src={questions[index].imageURL} />
                </QUESLIST.ImgBox>
              )}
            </QUESLIST.ImgContainer>
          ))}
      </QUESLIST.ImgSection>
    </QUESLIST.Wrapper>
  );
};

export default AddMock;

const QUESLIST = {
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
    margin-bottom: 1.5rem;
  `,
  TitleBox: styled.div`
    font-size: 2rem;
    font-weight: 600;
  `,
  ChapterLine: styled.div`
    width: 86rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
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
    width: 54rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
  `,
  WarningDes: styled.div`
    height: 4.5rem;
    width: 54rem;
    border-radius: 0.6rem;
    padding-left: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  `,

  ImgSection: styled.div`
    width: 82rem;
    height: 64.5rem;
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
  ImgNumber: styled.div`
    font-size: 2.5rem;
    color: ${({ theme, $isExist }) => ($isExist ? theme.colors.black : theme.colors.gray40)};
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
  AddOrModifyBtn: styled.button`
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
    background-color: ${({ $isEmpty, theme }) => ($isEmpty ? theme.colors.mainColor : theme.colors.gray30)};
  `,
  NoImgMsg: styled.div`
    width: 35.8rem;
    height: 12.5rem;
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

const RQ = {
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
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  TitleBox: styled.div`
    font-size: 2rem;
    font-weight: 600;
    margin-right: 3rem;
  `,
  ChapterLine: styled.div`
    height: 7.5rem;
    width: 86rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: -0.5rem;
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
  SubmitLine: styled.div`
    height: 7.5rem;
    width: 86rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: auto;
    font-size: 1.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.warning};
  `,

  ChapterDescription: styled.div`
    height: 4.5rem;
    width: 67rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.8rem;
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
  SelectChapterBtn: styled.button`
    width: 16rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.mainColor};
    margin-left: auto;
    margin-right: 4rem;
  `,
  GoBackBtn: styled.button`
    width: 20rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.warning};
    margin-right: 1rem;
  `,
  AddBtn: styled.button`
    width: 20rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.mainColor};
    margin-left: auto;
    margin-right: 4rem;
    &:disabled {
      cursor: default;
      background-color: ${({ theme }) => theme.colors.gray30};
    }
  `,
  OptionLine: styled.div`
    width: 86rem;
    height: 5rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  AnswerLine: styled.div`
    width: 86rem;
    height: 5rem;
    padding-left: 3rem;
    padding-top: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
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
  OptionInput: styled.input`
    width: 50rem;
    height: 4rem;
    padding-left: 1rem;
    font-size: 1.8rem;
    font-weight: 400;
    border-radius: 0.6rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
    &:focus {
      outline: none;
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ImgLine: styled.div`
    width: 86rem;
    padding-left: 3rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  `,
  ImgContainer: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,
  ImgLabelLine: styled.div`
    width: 38.5rem;
    display: flex;
    flex-direction: row;
  `,
  ImgLabel: styled.div`
    width: 15rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  ImgBox: styled.div`
    width: 38.5rem;
    max-height: 38.5rem;
    margin-top: 0.5rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
    display: flex;
    align-items: flex-start;
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
  `,
  NoImgMsg: styled.div`
    width: 35.8rem;
    height: 16rem;
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray60};
  `,
  FileInput: styled.input`
    display: none;
  `,
  SelectBtn: styled.label`
    width: 12rem;
    height: 4rem;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray30};
    &:disabled {
      cursor: default;
    }
  `,
};
