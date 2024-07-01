import styled from "styled-components";
import Axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../../../libs/cookie";

const PreviewPaper = ({ selectedQuestions, colorTheme, tamplateNum, title, makerName, paperGrade }) => {
  const navigate = useNavigate();
  const tempQues = [...selectedQuestions];
  tempQues.sort((a, b) => a.chapterId - b.chapterId);
  let today = new Date();
  let dateAndMakerText = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
    today.getDate()
  ).padStart(2, "0")} | ${selectedQuestions.length} 문제 | ${makerName}선생님 | 이름 ____________________`;

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  };
  const [logoUrl, setLogoUrl] = useState("");
  const getLogo = async () => {
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/teacher/mypage";

      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLogoUrl(response.data.data.logo);
    } catch (error) {
      // API 요청이 실패한 경우
      alert("로고를 불러오지 못했습니다.");
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
      }
      navigate("/");
    }
  };
  useEffect(() => {
    getLogo();
  }, []);

  const [imgWidth, setImgWidth] = useState(0);

  const [imgHeight, setImgHeight] = useState(0);
  useEffect(() => {
    (async () => {
      if (logoUrl) {
        try {
          const img = await loadImage(logoUrl);
          let tempWidth = img.naturalWidth;
          let tempHeight = img.naturalHeight;
          if (tempWidth * 3 > tempHeight * 8) {
            setImgHeight((tempHeight * 12) / tempWidth);
            setImgWidth(12);
          } else {
            setImgWidth((tempWidth * 4.5) / tempHeight);
            setImgHeight(4.5);
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [logoUrl]);

  const RenderQues = (ques, index) => {
    return (
      <PP.SampleQues>
        <PP.CategoryLabel>{`| ${ques.chapterDescription} |`}</PP.CategoryLabel>
        <PP.NumAndImg>
          <PP.QuesNum $color={colorTheme}>{String(index).padStart(2, "0")}</PP.QuesNum>
          <PP.QuesImg src={ques.imageURL} />
        </PP.NumAndImg>
      </PP.SampleQues>
    );
  };

  return (
    <PP.PreviewZone>
      <PP.A4SizePaper>
        <PP.InsideBox>
          <PP.TitleSection>
            <PP.TitleLine>
              <PP.Grade $color={colorTheme}>{paperGrade}</PP.Grade>
              <PP.Title>{title}</PP.Title>
            </PP.TitleLine>
            <PP.SecondLine>
              <PP.CateRange>{`${tempQues[0].chapterDescription} ~ ${tempQues.pop().chapterDescription}`}</PP.CateRange>
              <PP.LogoImg src={logoUrl} $minHeight={imgHeight} $minWidth={imgWidth} />
            </PP.SecondLine>
            <PP.PaperInfo>{dateAndMakerText}</PP.PaperInfo>
          </PP.TitleSection>
          <PP.FirstPageQues>
            <PP.LeftPart>{RenderQues(selectedQuestions[0], 1)}</PP.LeftPart>;<PP.RightPart></PP.RightPart>
          </PP.FirstPageQues>
        </PP.InsideBox>
      </PP.A4SizePaper>
      <PP.SecondPage></PP.SecondPage>
    </PP.PreviewZone>
  );
};

export default PreviewPaper;

const PP = {
  PreviewZone: styled.div`
    width: 58rem;
    height: 52rem;
    margin-left: 2rem;
    overflow-y: scroll;
    background-color: ${({ theme }) => theme.colors.gray05};
    &::-webkit-scrollbar {
      width: 2rem; /* 세로 스크롤바의 너비 */
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1; /* 트랙의 배경 색상 */
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  A4SizePaper: styled.div`
    width: 56rem;
    height: 79.1rem;
    background-color: white;
    padding: 1.33rem;
    border: 0.02rem solid gray;
  `,
  SecondPage: styled.div`
    margin-top: 2rem;
    width: 56rem;
    height: 79.1rem;
    background-color: white;
  `,
  InsideBox: styled.div`
    width: 53.34rem;
    height: 76.44rem;
  `,
  TitleSection: styled.div`
    display: flex;
    flex-direction: column;
    width: 53.34rem;
    height: 13.33rem;
    border-bottom: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    padding-left: 1.33rem;
    padding-top: 2.67rem;
  `,
  TitleLine: styled.div`
    display: flex;
    align-items: center;
  `,
  Grade: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ $color }) => $color};
  `,
  Title: styled.div`
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 0.2rem;
    justify-content: center;
  `,
  SecondLine: styled.div`
    width: 49.3rem;
    display: flex;
    justify-content: space-between;
  `,
  CateRange: styled.div`
    margin-top: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray60};
  `,
  PaperInfo: styled.div`
    font-size: 0.9rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray40};
    margin-top: 1rem;
  `,
  LogoImg: styled.img`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ $minWidth }) => `${$minWidth}rem`};
    height: ${({ $minHeight }) => `${$minHeight}rem`};
    margin-right: ${({ $minWidth }) => `${(12 - $minWidth) / 2}rem`};
  `,

  //문제 부분
  FirstPageQues: styled.div``,
  LeftPart: styled.div`
    width: 26.67rem;
    height: 60rem;
    border-right: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    padding: 1.33rem;
  `,
  RightPart: styled.div`
    width: 26.67rem;
    height: 60rem;
    padding: 1.33rem;
  `,
  SampleQues: styled.div`
    width: 22.66rem;

    border: 0.01rem solid red;
  `,
  CategoryLabel: styled.div`
    font-size: 0.8rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray50};
    margin-bottom: 0.5rem;
  `,
  NumAndImg: styled.div`
    display: flex;
    flex-direction: row;
  `,
  QuesNum: styled.div`
    color: ${({ $color }) => $color};
    font-size: 1.75rem;
    font-weight: 700;
    margin-right: auto;
  `,
  QuesImg: styled.img`
    width: 20rem;
  `,
};
