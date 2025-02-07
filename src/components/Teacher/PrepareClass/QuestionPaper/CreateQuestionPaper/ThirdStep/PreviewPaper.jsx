import styled from "styled-components";
import React, { useState, useEffect } from "react";
import useGetLogo from "../../../../../../libs/hooks/Teacher/MyPage/useGetLogo";

const PreviewPaper = ({
  selectedQuestions,
  selectedConcepts,
  colorTheme,
  tamplateNum,
  title,
  showChapterName,
  makerName,
  paperGrade,
  lineUpFourDiv,
  isOnlyConcept,
  addBlank,
}) => {
  const { getLogo, logoUrl } = useGetLogo();
  const tempQues = [...selectedQuestions];
  tempQues.sort((a, b) => a.chapterId - b.chapterId);
  let today = new Date();
  let formattedDate = `${("0" + today.getHours()).slice(-2)}:${("0" + today.getMinutes()).slice(-2)}`;

  let dateAndMakerText = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
    today.getDate()
  ).padStart(2, "0")} | ${isOnlyConcept ? `개념 ${selectedConcepts.length}개` : `${selectedQuestions.length} 문제`} | ${
    makerName === "" ? "" : `${makerName}선생님 | `
  }이름 ____________________`;

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
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
        } catch (error) {}
      }
    })();
  }, [logoUrl]);

  const QuesInFourDiv = (index) => {
    if (isOnlyConcept) {
      if (selectedConcepts[index - 1])
        return (
          <PP.FourDivSection>
            <PP.NumAndImg>
              <PP.ConceptImg
                src={addBlank ? selectedConcepts[index - 1].blankImage : selectedConcepts[index - 1].image}
              />
            </PP.NumAndImg>
          </PP.FourDivSection>
        );
    } else if (selectedQuestions[index - 1])
      return (
        <PP.FourDivSection>
          {showChapterName && (
            <PP.CategoryLabel>{`| ${selectedQuestions[index - 1].chapterDescription} |`}</PP.CategoryLabel>
          )}
          <PP.NumAndImg>
            <PP.QuesNum $color={colorTheme}>{String(index).padStart(2, "0")}</PP.QuesNum>
            <PP.QuesImg src={selectedQuestions[index - 1].imageURL} />
          </PP.NumAndImg>
        </PP.FourDivSection>
      );
    return <React.Fragment />;
  };
  const QuesInFourDivInSecond = (index) => {
    if (isOnlyConcept) {
      if (selectedConcepts[index - 1])
        return (
          <PP.FourDivInSecond>
            <PP.NumAndImg>
              <PP.ConceptImg
                src={addBlank ? selectedConcepts[index - 1].blankImage : selectedConcepts[index - 1].image}
              />
            </PP.NumAndImg>
          </PP.FourDivInSecond>
        );
    } else if (selectedQuestions[index - 1])
      return (
        <PP.FourDivInSecond>
          {showChapterName && (
            <PP.CategoryLabel>{`| ${selectedQuestions[index - 1].chapterDescription} |`}</PP.CategoryLabel>
          )}
          <PP.NumAndImg>
            <PP.QuesNum $color={colorTheme}>{String(index).padStart(2, "0")}</PP.QuesNum>
            <PP.QuesImg src={selectedQuestions[index - 1].imageURL} />
          </PP.NumAndImg>
        </PP.FourDivInSecond>
      );
    return <React.Fragment />;
  };

  switch (tamplateNum) {
    case 1:
      return (
        <PP.PreviewZone>
          <PP.A4SizePaper>
            <PP.InsideBox>
              <PP.TitleSection>
                <PP.TitleLine>
                  <PP.Grade $color={colorTheme}>{paperGrade}</PP.Grade>
                  <PP.Title>
                    {title !== ""
                      ? `${title}`
                      : !isOnlyConcept
                      ? `${paperGrade + "  " + formattedDate}`
                      : addBlank
                      ? `${paperGrade + "  개념(빈칸)  " + formattedDate}`
                      : `${paperGrade + "  개념  " + formattedDate}`}
                  </PP.Title>
                </PP.TitleLine>
                <PP.SecondLine>
                  <PP.CateRange>
                    {isOnlyConcept ? `` : `${tempQues[0].chapterDescription} ~ ${tempQues.pop().chapterDescription}`}
                  </PP.CateRange>
                  <PP.LogoImg src={logoUrl} $minHeight={imgHeight} $minWidth={imgWidth} />
                </PP.SecondLine>
                <PP.PaperInfo>{dateAndMakerText}</PP.PaperInfo>
              </PP.TitleSection>
              <PP.FirstPageQues>
                <PP.LeftPart>
                  {QuesInFourDiv(1)}
                  {QuesInFourDiv(2)}
                </PP.LeftPart>
                <PP.RightPart>
                  {QuesInFourDiv(3)}
                  {QuesInFourDiv(4)}
                </PP.RightPart>
              </PP.FirstPageQues>
              <PP.PageSection>
                <PP.PageBox>1</PP.PageBox>
              </PP.PageSection>
            </PP.InsideBox>
          </PP.A4SizePaper>
          <PP.SecondPage>
            <PP.InsideBox>
              <PP.HeaderLine>
                <PP.PaperInfo>{dateAndMakerText}</PP.PaperInfo>
              </PP.HeaderLine>
              <PP.FirstPageQues>
                <PP.SecondPageLeft>
                  {QuesInFourDivInSecond(5)}
                  {QuesInFourDivInSecond(6)}
                </PP.SecondPageLeft>
                <PP.SecondPageRight>
                  {QuesInFourDivInSecond(7)}
                  {QuesInFourDivInSecond(8)}
                </PP.SecondPageRight>
              </PP.FirstPageQues>
              <PP.PageSection>
                <PP.PageBox>2</PP.PageBox>
              </PP.PageSection>
            </PP.InsideBox>
          </PP.SecondPage>
        </PP.PreviewZone>
      );
    case 2:
      return <PP.A4SizePaper>응애</PP.A4SizePaper>;
    default:
      return <PP.PreviewZone></PP.PreviewZone>;
  }
};

export default PreviewPaper;

const PP = {
  PreviewZone: styled.div`
    width: 58rem;
    height: 52rem;
    margin-left: 2rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem; /* 세로 스크롤바의 너비 */
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1; /* 트랙의 배경 색상 */
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
      border-radius: 1rem;
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
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
  `,
  SecondPage: styled.div`
    margin-top: 2rem;
    width: 56rem;
    height: 79.1rem;
    background-color: white;
    padding: 1.33rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
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
  HeaderLine: styled.div`
    width: 53.34rem;
    height: 2.67rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 0.02rem solid ${({ theme }) => theme.colors.gray20};
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
    margin-block: 1rem;
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
  FirstPageQues: styled.div`
    display: flex;
    flex-direction: row;
  `,
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
  SecondPageLeft: styled.div`
    width: 26.67rem;
    height: 72rem;
    border-right: 0.02rem solid ${({ theme }) => theme.colors.gray20};
    padding: 1.33rem;
  `,
  SecondPageRight: styled.div`
    width: 26.67rem;
    height: 72rem;
    padding: 1.33rem;
  `,
  FourDivSection: styled.div`
    width: 22.66rem;
    margin-bottom: 2.67rem;
    height: 26.67rem;
  `,
  FourDivInSecond: styled.div`
    width: 22.66rem;
    margin-bottom: 2.67rem;
    height: 32rem;
  `,
  AutoDivSection: styled.div`
    width: 22.66rem;
    margin-bottom: 2.67rem;
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
  ConceptImg: styled.img`
    width: 21.33rem;
    margin-left: 1.33rem;
  `,
  PageSection: styled.div`
    width: 53.34rem;
    height: 2.67rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,
  PageBox: styled.div`
    font-size: 1.4rem;
  `,
};
