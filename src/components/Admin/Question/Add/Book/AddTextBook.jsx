import { useState, useEffect, useRef } from "react";
import { getCookie } from "../../../../../libs/cookie";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import BookLookupModal from "./BookModal";

const AddTextBook = ({
  chapToAdd,
  selectedBook,
  setSelectedBook,
  school,
  setSchool,
  grade,
  setGrade,
  semester,
  setSemester,
}) => {
  const navigate = useNavigate();
  const [questionFile, setQuestionFile] = useState(null);
  const [questionImage, setQuestionImage] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [solutionImage, setSolutionImage] = useState(null);
  const [page, setPage] = useState("");
  const [questionOrder, setQuestionOrder] = useState("");

  const onPageChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setPage(newValue);
    }
  };
  const onOrderChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setQuestionOrder(newValue);
    }
  };

  const [isSelectingBook, setIsSelectingBook] = useState(false);
  const openModal = () => {
    setIsSelectingBook(true);
  };
  const closeModal = () => {
    setIsSelectingBook(false);
  };

  const DeleteQuestionImg = () => {
    setQuestionImage(null);
    setQuestionFile(null);
  };
  const onQuestoinImgChange = (event) => {
    const file = event.target.files[0];

    // Check if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      setQuestionFile(file); // Store the file in state
      const reader = new FileReader();

      reader.onload = () => {
        setQuestionImage(URL.createObjectURL(file)); // Render the image on the screen
      };

      reader.readAsDataURL(file); // Read the file as a data URL (string)
    } else {
      alert("이미지 파일을 선택하세요.");
    }
  };

  const onSolutionImgChange = (event) => {
    const file = event.target.files[0];

    // Check if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      setSolutionFile(file); // Store the file in state
      const reader = new FileReader();

      reader.onload = () => {
        setSolutionImage(URL.createObjectURL(file)); // Render the image on the screen
      };

      reader.readAsDataURL(file); // Read the file as a data URL (string)
    } else {
      alert("이미지 파일을 선택하세요.");
    }
  };

  const DeleteSolutionImg = () => {
    setSolutionImage(null);
    setSolutionFile(null);
  };

  const difficultyOption = ["하", "중하", "중", "중상", "상"];
  const difficultyToSendOption = {
    하: "LOW",
    중하: "MEDIUM_LOW",
    중: "MEDIUM",
    중상: "MEDIUM_HARD",
    상: "HARD",
  };
  const [difficulty, setDifficulty] = useState("중");

  const categoryOption = ["선택형", "단답형", "서술형"];
  const categoryToSendOption = {
    선택형: "MULTIPLE",
    단답형: "SUBJECTIVE",
    서술형: "DESCRIPTIVE",
  };
  const [category, setCategory] = useState(categoryOption[0]);

  const answerOption = [1, 2, 3, 4, 5];
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const scoreOption = [0, 1, 2, 3, 4];

  const uploadQuestion = async () => {
    try {
      const apiUrl = "https://www.science-match.p-e.kr/admin/question/post";

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("level", difficultyToSendOption[difficulty]);
      formData.append("chapterId", chapToAdd.id);
      formData.append("solutionImg", solutionFile);
      formData.append("solution", answer);
      formData.append("image", questionFile);
      formData.append("category", categoryToSendOption[category]);
      formData.append("score", score);
      formData.append("questionTag", "TEXT_BOOK");
      formData.append("bookId", selectedBook.bookId);
      formData.append("page", page);
      formData.append("pageOrder", questionOrder);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      // Axios POST 요청
      const accessToken = getCookie("aToken");
      const response = await Axios.post(apiUrl, formData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data; boundary=",
        },
      });

      console.log(response.data);
      alert("문제를 성공적으로 추가했습니다.");
      setAnswer("");
      setQuestionOrder("");
      DeleteQuestionImg();
      DeleteSolutionImg();
      setScore(0);
      return response.data;
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };

  return (
    <RQ.Wrapper>
      {isSelectingBook && (
        <BookLookupModal
          closeModal={closeModal}
          school={school}
          setSchool={setSchool}
          grade={grade}
          setGrade={setGrade}
          semester={semester}
          setSemester={setSemester}
          setSelectedBook={setSelectedBook}
        />
      )}
      <RQ.TitleLine>
        <RQ.TitleBox>시중 교재 문제 추가</RQ.TitleBox>
      </RQ.TitleLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 교재명</RQ.ChapterLabel>
        {selectedBook.title === null ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 교재가 없습니다.
            교재를 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{selectedBook.title}</RQ.ChapterDescription>
        )}
        <RQ.SearchBtn onClick={openModal}>교재 선택</RQ.SearchBtn>
      </RQ.ChapterLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 단원명</RQ.ChapterLabel>
        {chapToAdd.description === "" ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 단원이 없습니다.
            단원을 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{chapToAdd.description}</RQ.ChapterDescription>
        )}
        <RQ.AddBtn onClick={uploadQuestion} disabled={!chapToAdd.id || !questionFile || !solutionFile || !answer}>
          문제 추가
        </RQ.AddBtn>
      </RQ.ChapterLine>
      <RQ.OptionLine>
        <RQ.OptionLabel>난이도</RQ.OptionLabel>
        <RQ.OptionBtnBox>
          {difficultyOption.map((opt) => (
            <RQ.OptionBtn
              $isSelected={difficulty === opt}
              onClick={() => {
                setDifficulty(opt);
              }}
            >
              {opt}
            </RQ.OptionBtn>
          ))}
        </RQ.OptionBtnBox>
        <RQ.PageLabel>속한 페이지</RQ.PageLabel>
      </RQ.OptionLine>
      <RQ.OptionLine>
        <RQ.OptionLabel>점수</RQ.OptionLabel>
        {true ? (
          <RQ.OptionBtnBox>
            {scoreOption.map((opt) => (
              <RQ.OptionBtn
                $isSelected={score === opt}
                onClick={() => {
                  setScore(opt);
                }}
              >
                {opt}
              </RQ.OptionBtn>
            ))}
          </RQ.OptionBtnBox>
        ) : (
          <RQ.OptionInput />
        )}
        <RQ.PageInput value={page} onChange={onPageChange} placeholder="페이지 입력" />
      </RQ.OptionLine>
      <RQ.OptionLine>
        <RQ.OptionLabel>답안유형</RQ.OptionLabel>
        <RQ.OptionBtnBox>
          {categoryOption.map((opt) => (
            <RQ.OptionBtn
              $isSelected={category === opt}
              onClick={() => {
                setCategory(opt);
                setAnswer("");
              }}
            >
              {opt}
            </RQ.OptionBtn>
          ))}
        </RQ.OptionBtnBox>
        <RQ.PageLabel>문제 번호</RQ.PageLabel>
      </RQ.OptionLine>
      <RQ.AnswerLine>
        <RQ.OptionLabel>정답</RQ.OptionLabel>
        {category === "선택형" ? (
          <RQ.OptionBtnBox>
            {answerOption.map((opt) => (
              <RQ.OptionBtn
                $isSelected={answer === opt}
                onClick={() => {
                  setAnswer(opt);
                }}
              >
                {opt}
              </RQ.OptionBtn>
            ))}
          </RQ.OptionBtnBox>
        ) : (
          <AutoResizeTextArea value={answer} setValue={setAnswer} maxLen={100} />
        )}
        <RQ.PageInput value={questionOrder} onChange={onOrderChange} placeholder="예) 1, 1.1, 1.2, 2" />
      </RQ.AnswerLine>
      <RQ.ImgLine>
        <RQ.ImgContainer>
          <RQ.ImgLabelLine>
            <RQ.ImgLabel>문제 이미지</RQ.ImgLabel>
            <RQ.SelectBtn htmlFor="question_input">
              이미지 선택
              <RQ.FileInput id="question_input" type="file" onChange={onQuestoinImgChange} accept="image/*" />
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
    </RQ.Wrapper>
  );
};

export default AddTextBook;

const AutoResizeTextArea = ({ value, setValue, maxLen }) => {
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    if (event.target.value.length <= maxLen) {
      setValue(event.target.value);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <ARTA.TextAreaWrapper>
      <ARTA.MyTextArea ref={textareaRef} placeholder={"정답을 입력하세요"} value={value} onChange={handleChange} />
      <ARTA.CharCount>{`${value.length} / ${maxLen}`}</ARTA.CharCount>
    </ARTA.TextAreaWrapper>
  );
};

const ARTA = {
  TextAreaWrapper: styled.div`
    position: relative;
    width: 50rem;
  `,
  MyTextArea: styled.textarea`
    width: 50rem;
    min-height: 4rem;
    border-radius: 0.8rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
    padding-left: 1rem;
    padding-block: 0.75rem;
    line-height: 3rem;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.7rem;
    font-weight: 600;
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    &:focus {
      outline: none;
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    }
  `,
  CharCount: styled.div`
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.1rem;
    font-weight: 400;
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
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
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
  SearchBtn: styled.button`
    width: 15rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.warning};
    margin-left: auto;
    margin-right: 4rem;
  `,
  AddBtn: styled.button`
    width: 15rem;
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
    min-height: 9rem;
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
  PageLabel: styled.div`
    width: 10rem;
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-left: 3rem;
  `,
  PageInput: styled.input`
    width: 15rem;
    height: 4rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.6rem;
    font-weight: 600;
    margin-left: 3rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray40};
    &:focus {
      outline: none;
      border: 0.2rem solid ${({ theme }) => theme.colors.mainColor};
    }
  `,
  ImgLine: styled.div`
    width: 86rem;
    padding-left: 3rem;
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
    max-height: 28.5rem;
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
