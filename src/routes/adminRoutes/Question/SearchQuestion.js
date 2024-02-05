import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Styles from "./AddQuestion.module.css";
import IconBtn from "../../../components/_Elements/IconBtn";

const SearchQuestion = ({ chapToSearch }) => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [childs, setChilds] = useState([]);

  const difficultyOption = ["하", "중하", "중", "중상", "상"];
  const difficultyToSendOption = {
    하: "LOW",
    중하: "MEDIUM_LOW",
    중: "MEDIUM",
    중상: "MEDIUM_HARD",
    상: "HARD"
  };
  const [selectedDifficulty, setSelectedDifficulty] = useState({
    하: true,
    중하: true,
    중: true,
    중상: true,
    상: true
  });

  const [questionSet, setQuestionSet] = useState([]);

  const clickDifficulty = (diff) => {
    setSelectedDifficulty((prevState) => ({
      ...prevState,
      [diff]: !prevState[diff]
    }));
  };

  const categoryOption = ["선택형", "단답형", "서술형"];
  const categoryToSendOption = {
    선택형: "MULTIPLE",
    단답형: "SUBJECTIVE",
    서술형: "DESCRIPTIVE"
  };
  const [category, setCategory] = useState(categoryOption[0]);

  useEffect(() => {
    console.log(selectedDifficulty);
    console.log("카테고리:", category);
    if (chapToSearch != null) getQuestions();
  }, [selectedDifficulty, category]);

  const getQuestions = async () => {
    const accessToken = getCookie("aToken");
    setQuestionSet([]);
    const url = "https://www.science-match.p-e.kr/admin/question";
    difficultyOption.map(async (diff) => {
      if (selectedDifficulty[diff]) {
        try {
          const response = await Axios.post(
            url,
            {
              chapterId: chapToSearch,
              level: difficultyToSendOption[diff],
              category: categoryToSendOption[category]
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          response.data.data.map((q) => {
            setQuestionSet((prev) => [...prev, q]);
          });
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
      }
    });
  };

  const DeleteQuestion = async (questionId) => {
    const url = `https://www.science-match.p-e.kr/admin/question?questionId=${questionId}`;
    const accessToken = getCookie("aToken");
    try {
      const response = await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data.data);

      const filteredQuestionSet = questionSet.filter(
        (item) => item.questionId !== questionId
      );

      // filteredQuestionSet을 새로운 배열로 업데이트
      setQuestionSet(filteredQuestionSet);
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
      <div className={Styles.selectionBox}>
        <div className={`${Styles.selectionLabel}`}>난이도</div>
        {difficultyOption.map((diff) => (
          <div
            className={`${Styles.selectionOpt} ${
              selectedDifficulty[diff]
                ? Styles.selectedOpt
                : Styles.nonSelectedOpt
            }`}
            onClick={() => {
              clickDifficulty(diff);
            }}
            key={diff}
          >
            {diff}
          </div>
        ))}
      </div>

      <div className={Styles.selectionBox}>
        <div className={`${Styles.selectionLabel}`}>문제 유형</div>
        {categoryOption.map((opt) => (
          <div
            className={`${Styles.selectionOpt} ${
              category === opt ? Styles.selectedOpt : Styles.nonSelectedOpt
            }`}
            onClick={() => {
              setCategory(opt);
            }}
            key={opt}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className={Styles.imglist}>
        {questionSet == "" ? (
          <div>
            <span>조회된 문제가 없습니다.</span>
            <br />
            <span>단원이나 문제 유형을 확인해주세요.</span>
          </div>
        ) : (
          questionSet.map((q) => (
            <div className={Styles.questionPreview}>
              <img
                className={Styles.previewImg}
                src={q.imageURL}
                id={q.questionId}
              />

              <IconBtn
                icon="trash"
                onClick={() => {
                  DeleteQuestion(q.questionId);
                }}
                style={{
                  fontSize: 50,
                  position: "absolute",
                  right: 0,
                  margin: 10
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchQuestion;
