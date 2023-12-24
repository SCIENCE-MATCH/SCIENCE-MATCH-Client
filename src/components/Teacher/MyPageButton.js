import styles from "../Colors.module.css";

const MyPageBtn = ({ text, myPageSelected, setMyPageSelected }) => {
  const onClick = () => {
    setMyPageSelected(true);
  };
  return (
    <button
      onClick={onClick}
      style={
        myPageSelected
          ? {
              //선택 됐을 때
              width: "100px", // 너비 수정
              height: "40px", // 높이 수정
              borderRadius: "100px", // border-radius 수정
              border: "1px solid var(--main-color)", // 테두리 제거
              fontSize: "20px", // fontSize 수정
              fontWeight: "bold", // fontWeight 수정
              color: "var(--main-color)",
              backgroundColor: "var(--bright-main)" // 배경색 설정
            }
          : {
              //미선택 시
              width: "100px", // 너비 수정
              height: "40px", // 높이 수정
              borderRadius: "100px", // border-radius 수정
              border: "1px solid black", // 테두리 스타일을 1px의 검은색 실선으로 수정
              fontSize: "20px",
              fontWeight: "bold",
              color: "black", // 글씨 색을 검정색으로 수정
              backgroundColor: "white", // 배경색을 흰색으로 설정
              cursor: "pointer"
            }
      }
    >
      {text}
    </button>
  );
};

export default MyPageBtn;
