import { useEffect, useState } from "react";
import styled from "styled-components";
import changeTeacherPw from "../../../libs/hooks/Teacher/MyPage/useChangeTPw";
import useGetTeacherInfo from "../../../libs/hooks/Teacher/MyPage/useGetMyPage";
import useUpdateLogo from "../../../libs/hooks/Teacher/MyPage/useUpdateLogo";
import useLogOut from "../../../libs/hooks/Teacher/MyPage/useLogOut";

const MyPage = () => {
  const { submitPwChange } = changeTeacherPw();
  const { updateLogo } = useUpdateLogo();
  const { logOut } = useLogOut();
  const { data, getInfo } = useGetTeacherInfo();

  console.log(data);
  const [modalType, setModalType] = useState(0);
  const [pw, setPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwCheck, setNewPwCheck] = useState("");

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const handleLogOut = async () => {
    logOut();
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  };

  useEffect(() => {
    if (data && data.logoUrl) {
      (async () => {
        try {
          const img = await loadImage(data.logoUrl);
          let tempWidth = img.naturalWidth;
          let tempHeight = img.naturalHeight;
          if (tempWidth * 3 > tempHeight * 8) {
            setImgHeight((tempHeight * 40) / tempWidth);
            setImgWidth(40);
          } else {
            setImgWidth((tempWidth * 15) / tempHeight);
            setImgHeight(15);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [data]);

  const changePw = () => {
    setModalType(1);
  };

  const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  const handlePwSubmit = async () => {
    await submitPwChange(pw, newPw, setModalType);
  };

  const [newLogoImg, setNewLogoImg] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");

  const handleUpdateLogo = async () => {
    await updateLogo(newLogoImg);
    getInfo();
  };

  const onLogoImgSelected = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setNewLogoImg(file);
      const reader = new FileReader();
      reader.onload = () => {
        setNewLogoUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일을 선택해주세요.");
    }
  };

  const [newImgWidth, setNewImgWidth] = useState(0);
  const [newImgHeight, setNewImgHeight] = useState(0);

  useEffect(() => {
    if (newLogoUrl) {
      (async () => {
        try {
          const img = await loadImage(newLogoUrl);
          let tempWidth = img.naturalWidth;
          let tempHeight = img.naturalHeight;
          if (tempWidth * 3 > tempHeight * 8) {
            setNewImgHeight((tempHeight * 40) / tempWidth);
            setNewImgWidth(40);
          } else {
            setNewImgWidth((tempWidth * 15) / tempHeight);
            setNewImgHeight(15);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [newLogoUrl]);

  const renderModal = () => {
    switch (modalType) {
      case 0:
        return null;
      case 1:
        return (
          <MODAL.Modal_Overlay>
            <MODAL.PasswordModal>
              <MODAL.ModalTitle>비밀번호 변경</MODAL.ModalTitle>
              <MODAL.PwLine>
                <MODAL.PwLabel>현재 비밀번호</MODAL.PwLabel>
                <MODAL.PwInput
                  isRequired={true}
                  type="password"
                  placeholder="현재 비밀번호를 입력해주세요."
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value);
                  }}
                  maxLength="16"
                />
              </MODAL.PwLine>
              <MODAL.PwLine>
                <MODAL.PwLabel>새로운 비밀번호</MODAL.PwLabel>
                <MODAL.PwInput
                  isRequired={true}
                  type="password"
                  placeholder="새로운 비밀번호를 입력해주세요."
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                  }}
                  maxLength="16"
                />
              </MODAL.PwLine>
              <MODAL.PwLine>
                <MODAL.PwLabel>비밀번호 확인</MODAL.PwLabel>
                <MODAL.PwInput
                  isRequired={true}
                  type="password"
                  placeholder="다시 한 번 입력해주세요."
                  value={newPwCheck}
                  onChange={(e) => {
                    setNewPwCheck(e.target.value);
                  }}
                  maxLength="16"
                />
              </MODAL.PwLine>
              <MODAL.PwTip>
                {newPw === "" || newPwCheck === "" || newPw === newPwCheck ? (
                  ""
                ) : (
                  <MODAL.TipLine>비밀번호가 일치하지 않습니다.</MODAL.TipLine>
                )}
                <MODAL.TipLine $isNoPro={newPw === "" || newPw.length > 7}>8자 이상 길이로 만들어주세요.</MODAL.TipLine>
                <MODAL.TipLine $isNoPro={newPw === "" || pwPattern.test(newPw)}>
                  영문 대/소문자, 숫자를 조합해 만들어주세요.
                </MODAL.TipLine>
              </MODAL.PwTip>
              <MODAL.BtnContainer>
                <MODAL.CancelBtn
                  onClick={() => {
                    setModalType(0);
                  }}
                >
                  취소
                </MODAL.CancelBtn>
                <MODAL.ConfirmBtn disabled={newPw !== newPwCheck || !pwPattern.test(newPw)} onClick={handlePwSubmit}>
                  저장하기
                </MODAL.ConfirmBtn>
              </MODAL.BtnContainer>
            </MODAL.PasswordModal>
          </MODAL.Modal_Overlay>
        );
      case 2:
        return (
          <MODAL.Modal_Overlay>
            <MODAL.PasswordModal>
              <MODAL.ModalTitle style={{ marginBottom: "2rem" }}>로고 변경</MODAL.ModalTitle>
              <MP.LogoBox>
                {newLogoUrl ? (
                  <MP.LogoImg src={newLogoUrl} $minHeight={newImgHeight} $minWidth={newImgWidth} />
                ) : (
                  <MODAL.NoImgMsg>선택된 이미지가 없습니다.</MODAL.NoImgMsg>
                )}
              </MP.LogoBox>
              <MODAL.BtnContainer>
                <MODAL.LogoInput htmlFor="fileInput">
                  로고 이미지 업로드
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={onLogoImgSelected}
                  />
                </MODAL.LogoInput>
                <MODAL.LogoDelete
                  onClick={() => {
                    setNewLogoImg("");
                    setNewLogoUrl("");
                  }}
                >
                  로고 사용 안함
                </MODAL.LogoDelete>
              </MODAL.BtnContainer>
              <MODAL.BtnContainer>
                <MODAL.CancelBtn
                  onClick={() => {
                    setModalType(0);
                  }}
                >
                  취소
                </MODAL.CancelBtn>
                <MODAL.ConfirmBtn
                  onClick={() => {
                    handleUpdateLogo();
                    setModalType(0);
                  }}
                >
                  저장하기
                </MODAL.ConfirmBtn>
              </MODAL.BtnContainer>
            </MODAL.PasswordModal>
          </MODAL.Modal_Overlay>
        );
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <MP.Wrapper>
      <MP.MyPageSection>
        <MP.Label style={{ fontSize: `2rem`, marginLeft: `3rem`, marginRight: `auto` }}>내 정보</MP.Label>
        <MP.InfoContainer>
          <MP.PersonalInfo>
            <MP.PropLine>
              <MP.Label>이메일</MP.Label>
              <MP.DataSlot>{data.email}</MP.DataSlot>
            </MP.PropLine>
            <MP.PropLine>
              <MP.Label>비밀번호</MP.Label>
              <MP.InsideLongBtn onClick={changePw}>비밀번호 변경</MP.InsideLongBtn>
            </MP.PropLine>
            <MP.PropLine>
              <MP.Label>원장선생님 이름</MP.Label>
              <MP.DataSlot>{data.name}</MP.DataSlot>
            </MP.PropLine>
            <MP.PropLine>
              <MP.Label>연락처</MP.Label>
              <MP.DataSlot>
                {data.phoneNum.slice(0, 3) + " - " + data.phoneNum.slice(3, 7) + " - " + data.phoneNum.slice(7)}
              </MP.DataSlot>
            </MP.PropLine>
          </MP.PersonalInfo>
          <MP.AcademyInfo>
            <MP.PropLine>
              <MP.Label>교육기관 이름</MP.Label>
              <MP.DataSlot>{data.academyName}</MP.DataSlot>
            </MP.PropLine>
            <MP.PropLine>
              <MP.LabelForLogo>로고</MP.LabelForLogo>
              <MP.LogoBox>
                {data.logoUrl ? (
                  <MP.LogoImg src={data.logoUrl} $minHeight={imgHeight} $minWidth={imgWidth} />
                ) : (
                  <MODAL.NoImgMsg>선택된 이미지가 없습니다.</MODAL.NoImgMsg>
                )}
              </MP.LogoBox>
            </MP.PropLine>
            <MP.PropLine>
              <MP.LabelForLogo />
              <MP.InsideLongBtn
                onClick={() => {
                  setNewLogoImg(data.logoUrl);
                  setModalType(2);
                }}
              >
                로고 변경
              </MP.InsideLongBtn>
            </MP.PropLine>
          </MP.AcademyInfo>
        </MP.InfoContainer>
        <MP.BtnLine>
          <MP.OutsideShortBtn onClick={handleLogOut}>로그아웃</MP.OutsideShortBtn>
        </MP.BtnLine>
      </MP.MyPageSection>
      {renderModal()}
    </MP.Wrapper>
  );
};

export default MyPage;

const MP = {
  Wrapper: styled.div`
    background-color: ${({ theme }) => theme.colors.brightGray};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: auto; /*standard: 1400*/
    height: 80rem;
    margin-top: 7rem;
  `,
  MyPageSection: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    background-color: white;
    width: 135rem;
    height: 80rem;
    padding-top: 2rem;
    border-radius: 1rem;
    border: 0.05rem solid ${({ theme }) => theme.colors.gray20};
  `,
  InfoContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 1.5rem;
  `,
  PersonalInfo: styled.div`
    display: flex;
    flex-direction: column;
    width: 65rem;
    height: 30rem;
    border-radius: 2rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    margin-right: 1.5rem;
    padding: 2rem;
  `,
  PropLine: styled.div`
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
  `,
  Label: styled.div`
    display: flex;
    align-items: center;
    width: 15rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: bold;
  `,
  DataSlot: styled.div`
    display: flex;
    align-items: center;
    width: 30rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: normal;
  `,
  Detail: styled.div`
    width: 30rem;
    height: 2rem;
    font-size: 1.6rem;
    font-weight: normal;
    color: ${({ theme }) => theme.colors.gray40};
  `,
  AcademyInfo: styled.div`
    display: flex;
    flex-direction: column;
    width: 65rem;
    height: 30rem;
    border-radius: 2rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    padding: 2rem;
  `,
  LabelForLogo: styled.div`
    display: flex;
    align-items: center;
    width: 10rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: bold;
  `,
  LogoBox: styled.div`
    width: 40rem;
    height: 15rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.8rem;
    //border: 0.1rem solid ${({ theme }) => theme.colors.gray20};
    margin-right: 0rem;
    overflow: hidden;
  `,
  LogoImg: styled.img`
    width: ${({ $minWidth }) => `${$minWidth}rem`};
    height: ${({ $minHeight }) => `${$minHeight}rem`};
    max-width: 40rem;
    max-height: 15rem;
  `,
  BtnLine: styled.div`
    width: 100%;
    padding-inline: 2rem;
    display: flex;
    justify-content: space-between;
  `,
  InsideLongBtn: styled.button`
    width: 14rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.01rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 1.5rem;
    font-weight: normal;
    &:hover {
      background-color: ${({ theme }) => theme.colors.lightMain};
      border: 0.01rem solid ${({ theme }) => theme.colors.mainColor};
      color: ${({ theme }) => theme.colors.main80};
    }
  `,
  OutsideShortBtn: styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.01rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 1.5rem;
    font-weight: normal;
    &:hover {
      background-color: ${({ theme }) => theme.colors.lightMain};
      border: 0.01rem solid ${({ theme }) => theme.colors.mainColor};
      color: ${({ theme }) => theme.colors.main80};
    }
  `,
};

const MODAL = {
  Modal_Overlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 50% 불투명도 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  PasswordModal: styled.div`
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    width: 47rem;
    height: 42rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 2rem;
  `,
  ModalTitle: styled.div`
    width: 100%;
    height: 5rem;
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  PwLine: styled.div`
    height: 6rem;
    display: flex;
    align-items: center;
  `,
  PwLabel: styled.div`
    width: 13rem;
    height: 5rem;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
  `,
  PwInput: styled.input`
    width: 30rem;
    height: 4rem;
    border-radius: 0.6rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.gray30};
    font-size: 1.5rem;
    font-weight: normal;
    padding: 1rem;
  `,
  PwTip: styled.div`
    height: 8rem;
    border-radius: 0.6rem;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.gray05};
  `,
  TipLine: styled.div`
    color: ${({ $isNoPro, theme }) => ($isNoPro ? theme.colors.gray70 : theme.colors.warning)};
    font-size: 1.4rem;
    font-weight: ${({ $isNoPro, theme }) => ($isNoPro ? "normal" : "bold")};
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  `,
  BtnContainer: styled.div`
    width: 100%;
    height: 5rem;
    margin-top: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  CancelBtn: styled.button`
    height: 4rem;
    width: 10rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.gray10};
    font-size: 1.25rem;
    font-weight: bold;
  `,
  ConfirmBtn: styled.button`
    height: 4rem;
    width: 10rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    font-size: 1.25rem;
    font-weight: bold;
  `,
  LogoInput: styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.01rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 1.5rem;
    font-weight: normal;
    margin-left: 2rem;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.colors.lightMain};
      border: 0.01rem solid ${({ theme }) => theme.colors.mainColor};
      color: ${({ theme }) => theme.colors.main80};
    }
  `,
  LogoDelete: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray05};
    border: 0.01rem solid ${({ theme }) => theme.colors.gray15};
    font-size: 1.5rem;
    font-weight: normal;
    margin-inline: 2rem;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.colors.softWarning};
      border: 0.01rem solid ${({ theme }) => theme.colors.warning};
      color: ${({ theme }) => theme.colors.warning};
    }
  `,
  NoImgMsg: styled.div`
    width: 38rem;
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
};
const MYMODAL = {
  Modal: styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    position: relative;
    width: 69rem;
    height: 78.5rem;
    display: flex;
    flex-direction: column;
  `,

  /* 모달 내용 스타일 */
  TitleLine: styled.div`
    height: 7rem;
    width: 100%;
    padding-inline: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray30};
    margin-bottom: 1rem;
  `,
  Title: styled.div`
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ContentLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6rem;
  `,
  ContentBox: styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
  `,
  InputLabel: styled.div`
    height: 6rem;
    width: 10rem;
    font-size: 1.6rem;
    font-weight: 700;
    margin-left: 3rem;
    margin-right: 2rem;
    display: flex;
    align-items: center;
  `,
  InputBox: styled.input`
    width: 22.5rem;
    height: 4rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: 0.1rem solid ${({ $isEmpty, theme }) => ($isEmpty ? theme.colors.warning : theme.colors.unselected)};
  `,
  InputWarning: styled.div`
    color: ${({ theme }) => theme.colors.warning};
    font-size: 1.3rem;
    font-weight: 500;
    margin-left: 1rem;
  `,

  BtnLine: styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    margin-top: auto;
    padding-inline: 3rem;
    padding-block: 1.5rem;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray30};
  `,

  CloseBtn: styled.button`
    width: 10rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    border: 0.1rem solid ${({ theme }) => theme.colors.unselected};
  `,
  SubmitBtn: styled.button`
    margin-left: 1rem;
    width: 13rem;
    height: 4rem;
    border-radius: 0.6rem;
    font-size: 1.6rem;
    font-weight: 700;
    background-color: ${({ theme }) => theme.colors.mainColor};
    color: white;
    margin-left: auto;
  `,
};
