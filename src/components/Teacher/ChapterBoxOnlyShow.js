import Styles from "../Admin/ChapterBox.module.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import IconBtn from "../_Elements/IconBtn";

const ChapterBoxOnlyShow = ({
  level,
  highRank,
  chapterNum,
  thisChap,
  selectedChaps,
  setSelectedChaps,
  checkFromParent,
  setCheckFromParent
}) => {
  const history = useHistory();
  const [showLowRank, setShowLowRank] = useState(false);
  const [children, setChildren] = useState(thisChap.children);
  const [description, setDescription] = useState("");
  const [checkAllChildren, setCheckAllChildren] = useState(false);

  const thisRank = highRank ? `${highRank}-${chapterNum}` : chapterNum;
  const thisLevel = `level${level}`;
  const dynamicClassName = `${Styles.chapterLine} ${Styles[thisLevel]}`;

  useEffect(() => {
    if (level == 3) {
      if (checkFromParent) {
        // chap이 selectedChaps에 이미 있는지 확인
        const isChapSelected = selectedChaps.includes(thisChap.id);

        // 이미 있다면 그대로 두고, 없다면 추가
        const updatedChaps = isChapSelected
          ? [...selectedChaps]
          : [...selectedChaps, thisChap.id];
        // 상태 업데이트
        setSelectedChaps(updatedChaps);
      } else {
        // chap이 selectedChaps에 이미 있는지 확인
        const isChapSelected = selectedChaps.includes(thisChap.id);

        // 이미 있다면 해당 항목을 제거하고, 없다면 그대로 둠
        const updatedChaps = isChapSelected
          ? selectedChaps.filter((selectedChap) => selectedChap !== thisChap.id)
          : [...selectedChaps];
        // 상태 업데이트
        setSelectedChaps(updatedChaps);
      }
    } else {
      onChildrenCheckClicked();
      checkFromParent ? setCheckAllChildren(true) : setCheckAllChildren(false);
      if (checkFromParent) setShowLowRank(true);
      else setShowLowRank(false);
    }
  }, [checkFromParent]);
  const onChildrenCheckClicked = () => {
    setCheckAllChildren((prev) => !prev);
  };
  const onChapClicked = () => {
    // chap이 selectedChaps에 이미 있는지 확인
    const isChapSelected = selectedChaps.includes(thisChap.id);

    // 이미 있다면 해당 항목을 제거하고, 없다면 추가
    const updatedChaps = isChapSelected
      ? selectedChaps.filter((selectedChap) => selectedChap !== thisChap.id)
      : [...selectedChaps, thisChap.id];

    // 상태 업데이트
    setSelectedChaps(updatedChaps);
  };

  const extend = () => {
    setShowLowRank((prev) => !prev);
  };

  useEffect(() => {
    setDescription(thisChap.description);
  }, []);

  return (
    <div className={Styles.backgroundBox}>
      <div
        className={dynamicClassName}
        onClick={level < 3 ? extend : onChapClicked}
      >
        <div style={{ width: 5 }} />
        {level < 3 ? (
          <div style={{ display: "flex" }}>
            <div className={Styles.checkBox}>
              {checkAllChildren ? (
                <IconBtn
                  icon="check"
                  onClick={onChildrenCheckClicked}
                  checked={true}
                />
              ) : (
                <button onClick={onChildrenCheckClicked} />
              )}
            </div>
            {showLowRank ? (
              <IconBtn icon="up" checked={true} />
            ) : (
              <IconBtn icon="down" />
            )}
          </div>
        ) : (
          <div className={Styles.checkBox}>
            {selectedChaps.includes(thisChap.id) ? (
              <IconBtn icon="check" onClick={onChapClicked} checked={true} />
            ) : (
              <button onClick={onChapClicked} />
            )}
          </div>
        )}
        <div style={{ width: 5 }} />
        {thisRank}
        <div>
          <a onClick={level < 3 ? null : onChapClicked}>{description}</a>
        </div>
        <div className={Styles.modifyBox}>
          <div style={{ width: 10 }} />
        </div>
      </div>
      {showLowRank ? (
        children.map((childChap, index) => (
          <ChapterBoxOnlyShow
            level={level + 1}
            highRank={thisRank}
            thisChap={childChap}
            chapterNum={index + 1}
            selectedChaps={selectedChaps}
            setSelectedChaps={setSelectedChaps}
            checkFromParent={checkAllChildren}
            setCheckAllChildren={setCheckAllChildren}
            key={index}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChapterBoxOnlyShow;
