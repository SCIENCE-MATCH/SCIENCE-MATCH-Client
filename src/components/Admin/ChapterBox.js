import Styles from "./ChapterBox.module.css";
import { useState, useEffect, useRef } from "react";
import { getCookie } from "../_Common/cookie";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import IconBtn from "../_Elements/IconBtn";

const ChapterBox = ({
  level,
  highRank,
  chapterNum,
  thisChap,
  parentId,
  data,
  deleteMe,
  chapToAdd,
  setChapToAdd
}) => {
  const history = useHistory();
  const [showLowRank, setShowLowRank] = useState(false);
  const [children, setChildren] = useState(thisChap.children);
  const [modifying, setModifying] = useState(false);
  const inputRef = useRef(null);
  const [isNew, setIsNew] = useState(false);
  const [description, setDescription] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [mouseOnPlus, setMouseOnPlus] = useState(false);

  const thisRank = highRank ? `${highRank}-${chapterNum}` : chapterNum;
  const thisLevel = `level${level}`;
  const nextLevel = `level${level + 1}`;
  const dynamicClassName = `${Styles.chapterLine} ${Styles[thisLevel]}`;
  const nextClassName = `${Styles.chapterLine} ${Styles[nextLevel]}`;
  const dataPut = { ...data };
  dataPut.parentId = parentId;

  const extend = () => setShowLowRank((prev) => !prev);

  const changeDes = (event) => {
    setDescription(event.target.value);
  };
  const addNewChapter = () => {
    thisChap.children = [
      ...thisChap.children,
      { children: [], description: "", id: "" }
    ];
    setChildren(thisChap.children);
    //console.log(thisChap, thisChap.children);
  };

  const deleteChild = ({ index }) => {
    thisChap.children.splice(index, 1);
    //console.log(thisChap);
    children.splice(index, 1);
  };

  useEffect(() => {
    setDescription(thisChap.description);
    thisChap.description === "" ? setIsNew(true) : setIsNew(false);
  }, []);

  const onMouseOverOnPlus = () => {
    setMouseOnPlus(true);
  };

  const onMouseOutFromPlus = () => {
    setMouseOnPlus(false);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      isNew ? putChapter() : updateChapter();
      setModifying(false);
      setIsNew(false);
    }
  };
  const onDeleteConfirmed = async () => {
    await deleteChapter(); // 예시로 deleteChapter를 호출했지만 실제로는 여러분이 원하는 삭제 로직을 호출하면 됩니다.
    setDeleted(true);
  };

  const onDeleteChap = () => {
    // 사용자에게 확인 메시지를 띄우고, 확인이 눌리면 onDeleteConfirmed 함수 호출
    const userConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (userConfirmed) {
      onDeleteConfirmed();
    }
  };

  const updateChapter = async () => {
    console.log("업데이트 챕터", thisChap.id);
    const dataPutUpdate = {
      description: description,
      id: thisChap.id
    };
    dataPutUpdate.id = thisChap.id;
    thisChap.description = description;
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/chapter";

      const response = await Axios.patch(url, dataPutUpdate, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response,
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        history.push("/");
      }
    }
  };
  const putChapter = async () => {
    dataPut.description = description;
    thisChap.description = description;
    try {
      const accessToken = getCookie("aToken");
      const url = "https://www.science-match.p-e.kr/admin/chapter";

      const response = await Axios.post(url, dataPut, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      //console.log(response.data);
      thisChap.id = response.data.data;
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response,
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        history.push("/");
      }
    }
  };
  const deleteChapter = async () => {
    dataPut.description = description;
    try {
      const accessToken = getCookie("aToken");
      const url = `https://www.science-match.p-e.kr/admin/chapter?chapterId=${thisChap.id}`;

      const response = await Axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      //console.log(response.data);
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response,
        error.response.data.code,
        error.response.data.message
      );
      if (error.response.data.message === "만료된 액세스 토큰입니다.") {
        alert("다시 로그인 해주세요");
        history.push("/");
      }
    }
    deleteMe(chapterNum - 1);
    //console.log("지웁니다: ", chapterNum - 1);
  };

  useEffect(() => {
    thisChap.description == "" ? setIsNew(true) : setIsNew(false);
    thisChap.description == "" ? setModifying(true) : setModifying(false);
  }, []);
  useEffect(() => {
    if (modifying) {
      inputRef.current.focus();
    }
    setIsReadOnly(!modifying);
  }, [modifying]);

  const [isReadOnly, setIsReadOnly] = useState(false);

  return (
    /*children: []
      description: "개념2"
      id: 11
      listOrder: 2
      school: "HIGH"
      semester: "SECOND"
      subject: "BIOLOGY"*/
    <div className={deleted ? Styles.deleted : Styles.backgroundBox}>
      <div
        className={dynamicClassName}
        onClick={thisChap.description != "" ? extend : null}
        onDoubleClick={() => {
          setModifying(true);
        }}
      >
        <div style={{ width: 5 }} />
        {level < 3 ? (
          showLowRank ? (
            <IconBtn icon="up" onClick={extend} checked={true} />
          ) : (
            <IconBtn
              icon="down"
              onClick={extend}
              disabled={thisChap.description === ""}
            />
          )
        ) : (
          <div className={Styles.checkBox}>
            {chapToAdd === thisChap.id ? (
              <IconBtn
                icon="check"
                onClick={() => {
                  setChapToAdd(null);
                }}
                checked={true}
              />
            ) : (
              <button
                onClick={() => {
                  setChapToAdd(thisChap.id);
                }}
              />
            )}
          </div>
        )}
        <div style={{ width: 5 }} />
        {thisRank}
        <div>
          <input
            className={modifying ? null : Styles.readOnlyInput}
            value={description}
            onChange={changeDes}
            onKeyPress={handleEnterKeyPress}
            ref={inputRef}
            readOnly={!modifying}
          ></input>
        </div>
        <div className={Styles.modifyBox}>
          {isNew || modifying ? (
            <IconBtn
              icon="save"
              onClick={() => {
                isNew ? putChapter() : updateChapter();
                setModifying(false);
                setIsNew(false);
                extend();
              }}
              disabled={description === "" ? true : false}
            />
          ) : (
            <IconBtn
              icon="pen"
              onClick={() => {
                setModifying(true);
                extend();
              }}
            />
          )}
          <div style={{ width: 10 }} />
          <IconBtn
            icon="trash"
            onClick={() => {
              onDeleteChap();
              extend();
            }}
            disabled={isNew ? true : false}
          />
        </div>
      </div>
      {showLowRank ? (
        children.map((childChap, index) => (
          <ChapterBox
            level={level + 1}
            highRank={thisRank}
            thisChap={childChap}
            chapterNum={index + 1}
            parentId={thisChap.id}
            data={data}
            deleteMe={deleteChild}
            chapToAdd={chapToAdd}
            setChapToAdd={setChapToAdd}
            key={index}
          />
        ))
      ) : (
        <></>
      )}
      {level < 3 && showLowRank && !(thisChap.description === "") ? (
        <div
          className={nextClassName}
          onClick={addNewChapter}
          style={{ cursor: "pointer" }}
          onMouseOver={onMouseOverOnPlus}
          onMouseOut={onMouseOutFromPlus}
        >
          <IconBtn icon="plus" onClick={addNewChapter} checked={mouseOnPlus} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChapterBox;
