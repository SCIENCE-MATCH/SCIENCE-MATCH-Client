import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { getCookie } from "../../../libs/cookie";
import WarningModal from "./WarningModal";

const ManageConcept = ({ chapToAdd }) => {
  const navigate = useNavigate();
  const [conceptFile, setConceptFile] = useState(null);
  const [conceptImg, setConceptImg] = useState(null);
  const [conceptId, setConceptId] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  const [noImg, setNoImg] = useState(true);

  useEffect(() => {
    if (imgUrl === null) setNoImg(true);
    else setNoImg(false);
  }, [imgUrl]);

  const [isWarning, setIsWarning] = useState(false);
  const openWarning = () => setIsWarning(true);
  const closeWarning = () => setIsWarning(false);

  const onConceptImgChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setConceptFile(file); // Store the file in state
      const reader = new FileReader();

      reader.onload = () => {
        setConceptImg(URL.createObjectURL(file));
      };

      reader.readAsDataURL(file);
      setImgUrl(null);
    } else {
      alert("이미지 파일을 선택하세요.");
    }
  };

  const getConcept = async () => {
    if (chapToAdd.id)
      try {
        const apiUrl = `https://www.science-match.p-e.kr/admin/concept?chapterId=${chapToAdd.id}`;

        // FormData 객체 생성
        // Axios POST 요청
        const accessToken = getCookie("aToken");
        const response = await Axios.get(apiUrl, {
          headers: {
            accept: "application/json;charset=UTF-8",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const conceptData = response.data.data; //여길 수정
        setConceptId(conceptData.id);
        setImgUrl(conceptData.url);
      } catch (error) {
        console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
        if (error.response.data.message === "만료된 액세스 토큰입니다.") {
          alert("다시 로그인 해주세요");
          navigate("/");
        }
      }
  };

  const putConcept = async () => {
    try {
      const apiUrl = "https://www.science-match.p-e.kr/admin/concept";

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("chapterId", chapToAdd.id);
      formData.append("image", conceptFile);
      // Axios POST 요청
      const accessToken = getCookie("aToken");
      await Axios.post(apiUrl, formData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data; boundary=",
        },
      });

      alert("저장 완료");
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      } else {
        alert("저장 실패");
      }
    }
  };

  const deleteConcept = async () => {
    try {
      const apiUrl = `https://www.science-match.p-e.kr/admin/concept?conceptId=${conceptId}`;

      const accessToken = getCookie("aToken");
      await Axios.delete(apiUrl, {
        headers: {
          accept: "application/json;charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setConceptImg(null);
      setConceptFile(null);
    } catch (error) {
      console.error("API 요청 실패:", error.response, error.response.data.code, error.response.data.message);
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        navigate("/");
      } else {
        alert("삭제 실패");
      }
    }
  };

  useEffect(() => {
    setImgUrl(null);
    setConceptImg(null);
    setConceptFile(null);
    getConcept();
  }, [chapToAdd]);

  return (
    <MC.Wrapper>
      {isWarning && (
        <WarningModal
          deleteFunc={deleteConcept}
          closeModal={closeWarning}
          warningText={"기존 문제지에 출제된 개념 또한 삭제됩니다."}
        />
      )}
      <MC.TitleLine>
        <MC.TitleBox>개념 조회 및 추가</MC.TitleBox>
      </MC.TitleLine>
      <MC.ChapterLine>
        <MC.ChapterLabel>선택 단원명</MC.ChapterLabel>
        {chapToAdd.description === "" ? (
          <MC.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 단원이 없습니다.
            단원을 선택하세요.
          </MC.WarningDes>
        ) : (
          <MC.ChapterDescription>{chapToAdd.description}</MC.ChapterDescription>
        )}
      </MC.ChapterLine>
      <MC.ImgLine>
        <MC.ImgLabel>개념 이미지</MC.ImgLabel>
        <MC.ImgBox>
          {imgUrl ? (
            <MC.ConceptImage src={imgUrl} />
          ) : conceptImg ? (
            <MC.ConceptImage src={conceptImg} alt="Preview" />
          ) : (
            <MC.NoImgMsg>이미지가 없습니다. 이미지를 선택해 저장하세요.</MC.NoImgMsg>
          )}
        </MC.ImgBox>
        <MC.BtnContainer>
          <MC.SelectBtn htmlFor="file-input" $disabled={chapToAdd.id === null}>
            이미지 선택
            <MC.FileInput
              id="file-input"
              type="file"
              onChange={onConceptImgChange}
              accept="image/*"
              disabled={chapToAdd.id === null}
            />
          </MC.SelectBtn>
          <MC.DeleteBtn onClick={openWarning} disabled={chapToAdd.id === null || noImg}>
            이미지 삭제
          </MC.DeleteBtn>
          <MC.AddBtn
            onClick={putConcept}
            disabled={chapToAdd.id === null || conceptFile === null || conceptImg === null}
          >
            저장하기
          </MC.AddBtn>
        </MC.BtnContainer>
      </MC.ImgLine>
    </MC.Wrapper>
  );
};
export default ManageConcept;
const MC = {
  Wrapper: styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    width: 86rem;
    height: 80rem;
    border-radius: 1rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    overflow: hidden;
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
    margin-bottom: 2rem;
  `,
  ChapterLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.6rem;
    font-weight: 600;
    margin-right: 1rem;
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
  ChapterDescription: styled.div`
    height: 4.5rem;
    width: 54rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.6rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray30};
  `,
  ImgLine: styled.div`
    width: 86rem;
    padding-left: 3rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  `,
  ImgLabel: styled.div`
    width: 10rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.6rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  ImgBox: styled.div`
    width: 54rem;
    min-height: 15.5rem;
    max-height: 64rem;
    border-radius: 1rem;
    border: 0.3rem black solid;
    display: flex;
    position: relative;
    padding: 1rem 0 1rem 1rem;
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

    /* 스크롤바 핸들에 마우스 호버시 스타일 */
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor};
    }
  `,
  BtnContainer: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-left: 2.5rem;
  `,
  ConceptImage: styled.img`
    width: 51.4rem;
    height: auto;
  `,
  NoImgMsg: styled.div`
    width: 51.4rem;
    height: 13rem;
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.gray40};
    background-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.gray20 : theme.colors.gray40)};
    pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  `,
  AddBtn: styled.button`
    width: 12rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.mainColor};
    margin-top: auto;
    &:disabled {
      cursor: default;
    }
  `,
  DeleteBtn: styled.button`
    width: 12rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.warning};
    margin-top: 1rem;
    &:disabled {
      cursor: default;
    }
  `,
};
