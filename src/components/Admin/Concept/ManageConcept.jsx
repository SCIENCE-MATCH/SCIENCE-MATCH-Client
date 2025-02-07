import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import WarningModal from "./WarningModal";
import useGetConcept from "../../../libs/apis/Admin/Concept/useGetConcept";
import useDeleteConcept from "../../../libs/apis/Admin/Concept/useDeleteConcept";
import usePostPutConcept from "../../../libs/apis/Admin/Concept/postPutConcept";

const ManageConcept = ({ chapToAdd }) => {
  const { receivedConcepts, getConcept } = useGetConcept();
  const { deleteConcept } = useDeleteConcept();
  const { newId, postPutConcept } = usePostPutConcept();
  const [conceptId, setConceptId] = useState(null);
  const [conceptFile, setConceptFile] = useState(null);
  const [conceptImg, setConceptImg] = useState(null);
  const [blankFile, setBlankFile] = useState(null);
  const [blankImg, setBlankImg] = useState(null);
  const [filledUrl, setFilledUrl] = useState(null);
  const [blankUrl, setBlankUrl] = useState(null);

  const [isWarning, setIsWarning] = useState(false);
  const openWarning = () => setIsWarning(true);
  const closeWarning = () => setIsWarning(false);

  const onFilledImgChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setConceptFile(file); // Store the file in state
      const reader = new FileReader();

      reader.onload = () => {
        setConceptImg(URL.createObjectURL(file));
      };

      reader.readAsDataURL(file);
      setFilledUrl(null);
    } else {
      alert("이미지 파일을 선택하세요.");
    }
  };
  const onBlankImgChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setBlankFile(file); // Store the file in state
      const reader = new FileReader();

      reader.onload = () => {
        setBlankImg(URL.createObjectURL(file));
      };

      reader.readAsDataURL(file);
      setBlankUrl(null);
    } else {
      alert("이미지 파일을 선택하세요.");
    }
  };

  useEffect(() => {
    setConceptId(receivedConcepts.id);
    setFilledUrl(receivedConcepts.image);
    setBlankUrl(receivedConcepts.blankImage);
    const dmddo = async () => {
      if (receivedConcepts.blankImage !== null)
        try {
          const response = await fetch(`${receivedConcepts.blankImage}?r=` + Math.floor(Math.random() * 100000));
          const blob = await response.blob();
          const file = new File([blob], "bImage-from-url.jpg", { type: blob.type });

          setBlankFile(file); // Store the file in state
        } catch (error) {
          console.error("이미지 로드에 실패했습니다.", error);
        }
      if (receivedConcepts.image !== null)
        try {
          const response = await fetch(`${receivedConcepts.image}?r=` + Math.floor(Math.random() * 100000));
          const blob = await response.blob();
          const file = new File([blob], "image-from-url.jpg", { type: blob.type });

          setConceptFile(file); // Store the file in state
        } catch (error) {
          console.error("이미지 로드에 실패했습니다.", error);
        }
    };
    if (receivedConcepts.id !== null) dmddo();
  }, [receivedConcepts]);

  const onPutConcept = async () => {
    postPutConcept(chapToAdd.id, conceptFile, blankFile);
  };
  useEffect(() => {
    setConceptId(newId);
  }, [newId]);
  const onDeleteConcept = async () => {
    await deleteConcept(conceptId);
    setConceptId(null);
    setFilledUrl(null);
    setConceptImg(null);
    setConceptFile(null);
    setBlankUrl(null);
    setBlankImg(null);
    setBlankFile(null);
  };

  useEffect(() => {
    if (chapToAdd.id !== null) {
      setConceptId(null);
      setFilledUrl(null);
      setConceptImg(null);
      setConceptFile(null);
      setBlankUrl(null);
      setBlankImg(null);
      setBlankFile(null);
      getConcept(chapToAdd.id);
    }
  }, [chapToAdd]);

  return (
    <MC.Wrapper>
      {isWarning && (
        <WarningModal
          deleteFunc={onDeleteConcept}
          closeModal={closeWarning}
          warningText={"기존 문제지에 출제된 개념 또한 삭제됩니다."}
        />
      )}
      <MC.TitleLine>
        <MC.TitleBox>개념 조회 및 추가</MC.TitleBox>
      </MC.TitleLine>
      <MC.ChapterLine>
        <MC.ChapterLabel>선택 단원명</MC.ChapterLabel>
        {chapToAdd.description === null ? (
          <MC.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 단원이 없습니다.
            단원을 선택하세요.
          </MC.WarningDes>
        ) : (
          <MC.ChapterDescription>{chapToAdd.description}</MC.ChapterDescription>
        )}
      </MC.ChapterLine>
      <MC.ImgLine>
        <MC.ImgContainer>
          <MC.ImgLabelLine>
            <MC.ImgLabel>빈칸 이미지</MC.ImgLabel>
            <MC.SelectBtn htmlFor="blank-file-input" $disabled={chapToAdd.id === null}>
              이미지 선택
              <MC.FileInput
                id="blank-file-input"
                type="file"
                onChange={onBlankImgChange}
                accept="image/*"
                disabled={chapToAdd.id === null}
              />
            </MC.SelectBtn>
          </MC.ImgLabelLine>
          <MC.ImgBox>
            {blankUrl ? (
              <MC.ConceptImage src={blankUrl} />
            ) : blankImg ? (
              <MC.ConceptImage src={blankImg} alt="Preview" />
            ) : (
              <MC.NoImgMsg>이미지가 없습니다.</MC.NoImgMsg>
            )}
          </MC.ImgBox>
        </MC.ImgContainer>
        <MC.ImgContainer>
          <MC.ImgLabelLine>
            <MC.ImgLabel>개념 이미지</MC.ImgLabel>
            <MC.SelectBtn htmlFor="file-input" $disabled={chapToAdd.id === null}>
              이미지 선택
              <MC.FileInput
                id="file-input"
                type="file"
                onChange={onFilledImgChange}
                accept="image/*"
                disabled={chapToAdd.id === null}
              />
            </MC.SelectBtn>
          </MC.ImgLabelLine>
          <MC.ImgBox>
            {filledUrl ? (
              <MC.ConceptImage src={filledUrl} />
            ) : conceptImg ? (
              <MC.ConceptImage src={conceptImg} alt="Preview" />
            ) : (
              <MC.NoImgMsg>이미지가 없습니다.</MC.NoImgMsg>
            )}
          </MC.ImgBox>
        </MC.ImgContainer>
      </MC.ImgLine>
      <MC.BtnContainer>
        <MC.DeleteBtn onClick={openWarning} disabled={conceptId === null}>
          전체 삭제
        </MC.DeleteBtn>
        <MC.AddBtn
          onClick={onPutConcept}
          disabled={chapToAdd.id === null || conceptFile === null || blankFile === null}
        >
          저장하기
        </MC.AddBtn>
      </MC.BtnContainer>
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
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
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
    width: 11rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.75rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  WarningDes: styled.div`
    height: 4.5rem;
    width: 68rem;
    border-radius: 0.6rem;
    padding-left: 1.5rem;
    font-size: 1.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 0.2rem solid ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  `,
  ChapterDescription: styled.div`
    height: 4.5rem;
    width: 68rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.75rem;
    font-weight: 600;
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
  ImgContainer: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,
  ImgLabelLine: styled.div`
    width: 39rem;
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
  `,
  ImgLabel: styled.div`
    width: 15rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.75rem;
    font-weight: 600;
    margin-right: 1rem;
  `,
  ImgBox: styled.div`
    width: 39rem;
    min-height: 15.5rem;
    max-height: 53rem;
    border-radius: 1rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.gray50};
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
  ConceptImage: styled.img`
    width: 36.3rem;
    height: auto;
  `,
  NoImgMsg: styled.div`
    width: 36.3rem;
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
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.gray20 : theme.colors.gray40)};
    pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  `,
  BtnContainer: styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding-left: 3rem;
    margin-top: 1rem;
  `,
  AddBtn: styled.button`
    width: 12rem;
    height: 4.5rem;
    border-radius: 0.8rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.mainColor};
    margin-left: auto;
    margin-right: 2.75rem;
    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray30};
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
    &:disabled {
      cursor: default;
    }
  `,
};
