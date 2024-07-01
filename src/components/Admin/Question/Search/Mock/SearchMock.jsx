import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const SearchMock = ({ chapToSearch }) => {
  return (
    <RQ.Wrapper>
      <RQ.TitleLine>
        <RQ.TitleBox>모의고사 문제 검색</RQ.TitleBox>
      </RQ.TitleLine>
      <RQ.ChapterLine>
        <RQ.ChapterLabel>선택 회차</RQ.ChapterLabel>
        {chapToSearch.description === "" ? (
          <RQ.WarningDes>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginRight: `1rem` }} /> 선택된 모의고사가 없습니다.
            모의고사를 선택하세요.
          </RQ.WarningDes>
        ) : (
          <RQ.ChapterDescription>{chapToSearch.description}</RQ.ChapterDescription>
        )}
      </RQ.ChapterLine>
    </RQ.Wrapper>
  );
};

export default SearchMock;

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
    font-size: 1.8rem;
    font-weight: 600;
    margin-right: 1rem;
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
};
