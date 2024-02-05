import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Styles from "./AddQuestion.module.css";
import IconBtn from "../../../components/_Elements/IconBtn";
import { type } from "@testing-library/user-event/dist/type";

const RegisterQuestion = ({ chapToAdd }) => {
  const navigate = useNavigate();
  const [questionFile, setQuestionFile] = useState(null);
  const [questionImage, setQuestionImage] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [solutionImage, setSolutionImage] = useState(null);

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
    상: "HARD"
  };
  const [difficulty, setDifficulty] = useState("중");

  const categoryOption = ["선택형", "단답형", "서술형"];
  const categoryToSendOption = {
    선택형: "MULTIPLE",
    단답형: "SUBJECTIVE",
    서술형: "DESCRIPTIVE"
  };
  const [category, setCategory] = useState(categoryOption[0]);
  const [categoryToSend, setCategoryToSend] = useState(
    categoryToSendOption[category]
  );

  const answerOption = ["1", "2", "3", "4", "5"];
  const [answer, setAnswer] = useState("");

  const bookOptions = ["일반", "교재", "모의고사"];
  const bookToSend = {
    일반: "NORMAL",
    교재: "TEXT_BOOK",
    모의고사: "MOCK_EXAM"
  };
  const [selectedBook, setSelectedBook] = useState(bookOptions[0]);
  const [questionTag, setQuestionTag] = useState(bookToSend[selectedBook]);
  const [bookName, setBookName] = useState("");
  const [page, setPage] = useState(0);

  const inputAnswer = (e) => {
    setAnswer(e.target.value);
  };

  const uploadQuestion = async () => {
    try {
      const apiUrl = "https://www.science-match.p-e.kr/admin/question/post";

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("level", difficultyToSendOption[difficulty]);
      formData.append("chapterId", chapToAdd);
      formData.append("solutionImg", solutionFile);
      formData.append("page", page == 0 || questionTag == "NORMAL" ? "" : page);
      formData.append("bookName", bookName);
      formData.append("questionTag", questionTag);
      formData.append("solution", answer);
      formData.append("image", questionFile);
      formData.append("category", categoryToSend);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      // Axios POST 요청
      const accessToken = getCookie("aToken");
      const response = await Axios.post(apiUrl, formData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data; boundary="
        }
      });

      console.log(response.data);
      alert("문제를 성공적으로 추가했습니다.");
      setAnswer("");
      DeleteQuestionImg();
      DeleteSolutionImg();
      return response.data;
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response,
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      }
    }
  };

  return (
    <div className={Styles.questionSection}>
      <div className={Styles.chapterName}>{chapToAdd}</div>
      <div className={Styles.questionAndBook}>
        <div className={Styles.questionContainer}>
          <div>
            <div className={`${Styles.selectionLabel}`}>문제 이미지</div>
            {questionImage ? (
              <div className={Styles.imageBox}>
                <img
                  src={questionImage}
                  alt="Preview"
                  width="auto"
                  height="100%"
                />
                <IconBtn
                  icon="trash"
                  onClick={DeleteQuestionImg}
                  style={{
                    fontSize: 50,
                    position: "absolute",
                    right: 0,
                    margin: 10
                  }}
                />
              </div>
            ) : (
              <div className={Styles.imageBox}>
                <label htmlFor="fileInput" className={Styles.fileLabel}>
                  <span className="custom-button">문제 이미지 첨부</span>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={onQuestoinImgChange}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </div>

          <div className={Styles.selectionBox}>
            <div className={`${Styles.selectionLabel}`}>난이도</div>
            {difficultyOption.map((diff) => (
              <div
                key={diff}
                className={`${Styles.selectionOpt} ${
                  difficulty === diff
                    ? Styles.selectedOpt
                    : Styles.nonSelectedOpt
                }`}
                onClick={() => {
                  setDifficulty(diff);
                }}
              >
                {diff}
              </div>
            ))}
          </div>
          <div className={Styles.selectionBox}>
            <div className={`${Styles.selectionLabel}`}>답안 유형</div>
            {categoryOption.map((opt) => (
              <div
                key={opt}
                className={`${Styles.selectionOpt} ${
                  category === opt ? Styles.selectedOpt : Styles.nonSelectedOpt
                }`}
                onClick={() => {
                  setCategory(opt);
                  opt === "선택형" ? setAnswer("1") : setAnswer("");
                }}
              >
                {opt}
              </div>
            ))}
          </div>
          {category === "선택형" ? (
            <div className={Styles.selectionBox}>
              <div className={`${Styles.selectionLabel}`}>정답</div>
              {answerOption.map((opt) => (
                <div
                  key={opt}
                  className={`${Styles.selectionOpt} ${
                    answer === opt ? Styles.selectedOpt : Styles.nonSelectedOpt
                  }`}
                  onClick={() => {
                    setAnswer(opt);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          ) : (
            <div className={Styles.selectionBox}>
              <div className={`${Styles.selectionLabel}`}>정답</div>
              <input
                type="text"
                className={Styles.answerBox}
                value={answer}
                onChange={inputAnswer}
              />
            </div>
          )}

          <div>
            <div className={`${Styles.selectionLabel}`}>해설 이미지</div>
            {solutionImage ? (
              <div className={Styles.imageBox}>
                <img
                  src={solutionImage}
                  alt="Preview"
                  width="auto"
                  height="100%"
                />
                <IconBtn
                  icon="trash"
                  onClick={DeleteSolutionImg}
                  style={{
                    fontSize: 50,
                    position: "absolute",
                    right: 0,
                    margin: 10
                  }}
                />
              </div>
            ) : (
              <div className={Styles.imageBox}>
                <label htmlFor="fileInput" className={Styles.fileLabel}>
                  <span className="custom-button">해설 이미지 첨부</span>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={onSolutionImgChange}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className={Styles.bookContainer}>
          <div className={Styles.bookBox}>
            <div className={Styles.selectionLabel}>문제 유형</div>
            <div>
              {bookOptions.map((opt) => (
                <div
                  key={opt}
                  className={`${Styles.selectionOpt} ${
                    selectedBook === opt
                      ? Styles.selectedOpt
                      : Styles.nonSelectedOpt
                  }`}
                  onClick={() => {
                    setSelectedBook(opt);
                    setQuestionTag(bookToSend[opt]);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div className={Styles.bookBox}>
            <div
              className={`${Styles.selectionLabel} ${
                selectedBook === bookOptions[0] ? Styles.nonSelectedOpt : ""
              }`}
              style={{ width: 130 }}
            >
              {selectedBook === bookOptions[2] ? "모의고사" : "교재"} 이름
            </div>
            <input
              disabled={selectedBook === bookOptions[0]}
              value={bookName}
              onChange={(e) => {
                setBookName(e.target.value);
              }}
            ></input>
          </div>

          <div className={Styles.bookBox}>
            <div
              className={`${Styles.selectionLabel} ${
                selectedBook !== bookOptions[1] ? Styles.nonSelectedOpt : ""
              }`}
              style={{ width: 130 }}
            >
              첫 페이지
            </div>
            <input
              disabled={selectedBook !== bookOptions[1]}
              value={page}
              onChange={(e) => {
                Number.isInteger(e.target.value) | (e.target.value == "")
                  ? setPage(Number(e.target.value))
                  : setPage(Number(e.target.value));
                Number(e.target.value) < 10000
                  ? setPage(Number(e.target.value))
                  : setPage(0);
              }}
            ></input>
          </div>
        </div>
      </div>
      <div>
        <button onClick={uploadQuestion}>만들기</button>
      </div>
    </div>
  );
};

export default RegisterQuestion;
