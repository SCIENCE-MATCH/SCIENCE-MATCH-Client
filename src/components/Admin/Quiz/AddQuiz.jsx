import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import usePostAddQuiz from "../../../libs/apis/Admin/Quiz/postAddQuiz";

const AddQuiz = ({ chapToAdd }) => {
  const { postAddQuiz } = usePostAddQuiz();
  const [questionFile, setQuestionFile] = useState(null);
  const [questionImage, setQuestionImage] = useState(null);

  const onQuestionImgChange = (event) => {
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

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const uploadQuiz = () => {
    postAddQuiz(chapToAdd.school, chapToAdd.semester, chapToAdd.id, questionFile, question, answer, chapToAdd.subject);

    setQuestion("");
    setAnswer("");
    setQuestionImage(null);
    setQuestionFile(null);
  };

  return (
    <RQ.Wrapper>
      <RQ.TitleLine>
        <RQ.TitleBox>1:1 질문 추가</RQ.TitleBox>
      </RQ.TitleLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 단원명</RQ.ChapterLabel>
        {chapToAdd.description === null ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 단원이 없습니다.
            단원을 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{chapToAdd.description}</RQ.ChapterDescription>
        )}
        <RQ.AddBtn onClick={uploadQuiz} disabled={!chapToAdd.id || !question || !answer}>
          문제 추가
        </RQ.AddBtn>
      </RQ.ChapterLine>
      <RQ.AnswerLine>
        <RQ.OptionLabel>문제</RQ.OptionLabel>
        <AutoResizeTextArea
          value={question}
          setValue={setQuestion}
          maxLen={180}
          placeholder={"1:1 질문 문제를 입력하세요"}
        />
      </RQ.AnswerLine>
      <RQ.AnswerLine>
        <RQ.OptionLabel>정답</RQ.OptionLabel>
        <AutoResizeTextArea
          value={answer}
          setValue={setAnswer}
          maxLen={50}
          placeholder={"정답을 입력하세요. Space-Bar로 중복 정답을 구분합니다."}
        />
      </RQ.AnswerLine>
      <RQ.AnswerLine>
        <RQ.ImgLabel>문제 이미지</RQ.ImgLabel>
        <RQ.ImgBox>
          {questionImage ? <RQ.Image src={questionImage} /> : <RQ.NoImgMsg>선택된 이미지가 없습니다.</RQ.NoImgMsg>}
        </RQ.ImgBox>
        <RQ.SelectBtn htmlFor="question_input">
          이미지 선택
          <RQ.FileInput id="question_input" type="file" onChange={onQuestionImgChange} accept="image/*" />
        </RQ.SelectBtn>
      </RQ.AnswerLine>
    </RQ.Wrapper>
  );
};

export default AddQuiz;

const AutoResizeTextArea = ({ value, setValue, maxLen, placeholder }) => {
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
      <ARTA.MyTextArea ref={textareaRef} placeholder={placeholder} value={value} onChange={handleChange} />
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
    font-weight: 400;
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
  ImgLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  ImgBox: styled.div`
    width: 50rem;
    max-height: 33rem;
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
    width: 47.6rem;
    height: auto;
  `,
  NoImgMsg: styled.div`
    width: 47.6rem;
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
    height: 4.5rem;
    margin-left: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.gray20 : theme.colors.gray30)};
    pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  `,
};
