import { useState, useEffect } from "react";
import { getCookie } from "../../../../../libs/cookie";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faTrash } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import WarningModal from "../../../Concept/WarningModal";

const SearchNormal = ({ chapToSearch }) => {
  const navigate = useNavigate();

  const [idToDelete, setIdToDelete] = useState(null);
  const [isWarning, setIsWarning] = useState(false);
  const openWarning = () => setIsWarning(true);
  const closeWarning = () => setIsWarning(false);

  const difficultyOption = ["하", "중하", "중", "중상", "상"];
  const difficultyToSendOption = {
    하: "LOW",
    중하: "MEDIUM_LOW",
    중: "MEDIUM",
    중상: "MEDIUM_HARD",
    상: "HARD",
  };
  const [selectedDifficulty, setSelectedDifficulty] = useState({
    하: true,
    중하: true,
    중: true,
    중상: true,
    상: true,
  });

  const [questionSet, setQuestionSet] = useState([]);

  const clickDifficulty = (diff) => {
    setSelectedDifficulty((prevState) => ({
      ...prevState,
      [diff]: !prevState[diff],
    }));
  };

  const categoryOption = ["선택형", "단답형", "서술형"];
  const categoryToSendOption = {
    선택형: "MULTIPLE",
    단답형: "SUBJECTIVE",
    서술형: "DESCRIPTIVE",
  };
  const [category, setCategory] = useState(categoryOption[0]);

  useEffect(() => {
    if (chapToSearch.id !== null) getQuestions();
    else setQuestionSet([]);
  }, [selectedDifficulty, category, chapToSearch]);

  const getQuestions = async () => {
    const accessToken = getCookie("aToken");
    setQuestionSet([]);
    const url = "https://www.science-match.p-e.kr/admin/question";

    const promises = difficultyOption.map((diff) => {
      if (selectedDifficulty[diff]) {
        return Axios.post(
          url,
          {
            chapterId: chapToSearch.id,
            level: difficultyToSendOption[diff],
            category: categoryToSendOption[category],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
          .then((response) => response.data.data)
          .catch((error) => {
            console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
            if (error.response.data.message === "만료된 액세스 토큰입니다.") {
              navigate("/");
            }
            return [];
          });
      } else {
        return Promise.resolve([]); // 조건이 맞지 않으면 빈 배열을 반환
      }
    });

    try {
      const results = await Promise.all(promises);
      const allQuestions = results.flat(); // 모든 질문을 하나의 배열로 합침
      setQuestionSet(allQuestions);
    } catch (error) {
      console.error("질문을 가져오는 중 오류가 발생했습니다:", error);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인하세요");
        navigate("/");
      } else {
        alert("문제 조회 실패");
      }
    }
  };

  const DeleteQuestion = async () => {
    const url = `https://www.science-match.p-e.kr/admin/question?questionId=${idToDelete}`;
    const accessToken = getCookie("aToken");
    try {
      await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const filteredQuestionSet = questionSet.filter((item) => item.questionId !== idToDelete);

      setIdToDelete(null);
      setQuestionSet(filteredQuestionSet);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      alert("삭제 실패");
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        navigate("/");
      }
    }
  };

  return (
    <SQ.Wrapper>
      {isWarning && (
        <WarningModal
          deleteFunc={DeleteQuestion}
          closeModal={closeWarning}
          warningText={"기존 문제지에 출제된 문제 또한 삭제됩니다."}
        />
      )}
      <SQ.TitleLine>
        <SQ.TitleBox>단원 유형별 문제 검색</SQ.TitleBox>
      </SQ.TitleLine>
      <SQ.ChapterLine>
        <SQ.ChapterLabel>선택 단원명</SQ.ChapterLabel>
        {chapToSearch.description === null ? (
          <SQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 단원이 없습니다.
            단원을 선택하세요.
          </SQ.WarningDes>
        ) : (
          <SQ.ChapterDescription>{chapToSearch.description}</SQ.ChapterDescription>
        )}
      </SQ.ChapterLine>
      <SQ.OptionLine>
        <SQ.OptionLabel>난이도</SQ.OptionLabel>
        <SQ.OptionBtnBox>
          {difficultyOption.map((opt) => (
            <SQ.OptionBtn
              $isSelected={selectedDifficulty[opt]}
              onClick={() => {
                clickDifficulty(opt);
              }}
            >
              {opt}
            </SQ.OptionBtn>
          ))}
        </SQ.OptionBtnBox>
      </SQ.OptionLine>

      <SQ.OptionLine>
        <SQ.OptionLabel>답안유형</SQ.OptionLabel>
        <SQ.OptionBtnBox>
          {categoryOption.map((opt) => (
            <SQ.OptionBtn
              $isSelected={category === opt}
              onClick={() => {
                setCategory(opt);
              }}
            >
              {opt}
            </SQ.OptionBtn>
          ))}
        </SQ.OptionBtnBox>
      </SQ.OptionLine>
      <SQ.ImgSection>
        {questionSet.length === 0 ? (
          <SQ.NoImgMsg>조회된 문제가 없습니다.</SQ.NoImgMsg>
        ) : (
          questionSet.map((q) => (
            <SQ.ImgContainer>
              <SQ.ImgBox>
                <SQ.Image src={q.imageURL} />
              </SQ.ImgBox>
              <SQ.DeleteBtn
                onClick={() => {
                  setIdToDelete(q.questionId);
                  openWarning();
                }}
              >
                문제 삭제
              </SQ.DeleteBtn>
            </SQ.ImgContainer>
          ))
        )}
      </SQ.ImgSection>
    </SQ.Wrapper>
  );
};

export default SearchNormal;

const SQ = {
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
  ImgBox: styled.div`
    width: 38.5rem;
    height: 15rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
    display: flex;
    flex-direction: row;
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
    max-height: 1000%;
  `,
  DeleteBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    margin-left: auto;
    margin-bottom: 2rem;
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
