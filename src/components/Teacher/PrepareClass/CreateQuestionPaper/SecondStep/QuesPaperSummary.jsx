import React, { useState, useCallback, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// 드래그 가능한 아이템 타입 정의
const ItemTypes = {
  ITEM: "item",
};

// 드래그 가능한 버튼 컴포넌트
const DraggableButton = ({ id, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <SQ.DragBox ref={drag} style={{ opacity, cursor: "pointer" }}>
      <FontAwesomeIcon icon={faBars} />
    </SQ.DragBox>
  );
};

// 리스트 아이템 컴포넌트
const ListItem = ({ ques, index, moveItem }) => {
  const ref = useRef(null);
  const hoverTimeout = useRef(null);
  const [isEnough, setIsEnough] = useState(false);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
      setIsEnough(false);
      hoverTimeout.current = setTimeout(() => {
        setIsEnough(true);
      }, 100);

      if (isEnough) {
        moveItem(dragIndex, hoverIndex);
        draggedItem.index = hoverIndex;
      }
    },
    leave: () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    },
  });

  drop(ref);

  const categorys = { MULTIPLE: "선택형", SUBJECTIVE: "단답형", DESCRIPTIVE: "서술형" };
  const diff_Eng_to_Kor = { LOW: "하", MEDIUM_LOW: "중하", MEDIUM: "중", MEDIUM_HARD: "중상", HARD: "상" };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: "flex",
        flexDirection: "row",
        willChange: "opacity,transform",
      }}
    >
      <SQ.QuestionLine>
        <SQ.ShortBox>{index + 1}</SQ.ShortBox>
        <SQ.ShortBox>{categorys[ques.category]}</SQ.ShortBox>
        <SQ.ShortBox>{diff_Eng_to_Kor[ques.level]}</SQ.ShortBox>
        <SQ.DescriptionBox>{ques.chapterDescription}</SQ.DescriptionBox>
        <DraggableButton id={ques.id} index={index} />
      </SQ.QuestionLine>
    </motion.div>
  );
};

// 리스트 컴포넌트
const List = ({ items, moveItem }) => {
  return (
    <SQ.QuestionList>
      <AnimatePresence>
        {items.map((item, index) => (
          <ListItem key={item.questionId} ques={item} index={index} moveItem={moveItem} />
        ))}
      </AnimatePresence>
    </SQ.QuestionList>
  );
};

// 메인 컴포넌트
const QuesPaperSummary = ({ selectedQuestions, setSelectedQuestions, setSortOption }) => {
  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedItem = selectedQuestions[dragIndex];
      const updatedItems = [...selectedQuestions];
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      setSelectedQuestions(updatedItems);
      setSortOption("custom");
    },
    [selectedQuestions]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <List items={selectedQuestions} moveItem={moveItem} />
    </DndProvider>
  );
};

export default QuesPaperSummary;

const SQ = {
  Wrapper: styled.div``,
  Container: styled.div`
    width: 60rem;
    height: 44.5rem;
    margin-top: 1rem;
    border-radius: 1rem;
    overflow: hidden;
    border: 0.1rem solid ${({ theme }) => theme.colors.background};
    background-color: white;
  `,
  ColumnHeader: styled.div`
    width: 60rem;
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.colors.notGraded};
  `,
  QuestionList: styled.ul`
    width: 60rem;
    height: 41rem;
    overflow: hidden;
    &:hover {
      overflow-y: scroll;
    }
    &::-webkit-scrollbar {
      width: 1rem; /* 세로 스크롤바의 너비 */
    }

    /* 스크롤바 트랙(배경) 스타일 */
    &::-webkit-scrollbar-track {
      //background: #f1f1f1; /* 트랙의 배경 색상 */
      //border-radius: 1rem; /* 트랙의 모서리 둥글게 */
    }

    /* 스크롤바 핸들(움직이는 부분) 스타일 */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.unselected}; /* 핸들의 배경 색상 */
      //border-radius: 1rem; /* 핸들의 모서리 둥글게 */
    }

    /* 스크롤바 핸들에 마우스 호버시 스타일 */
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.mainColor}; /* 호버 시 핸들의 배경 색상 */
    }
  `,
  QuestionLine: styled.li`
    display: flex;
    flex-direction: row;
  `,
  ShortBox: styled.div`
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gray};
    align-content: center;
    border-bottom: 0.025rem solid ${({ theme }) => theme.colors.background};
    border-top: 0.025rem solid ${({ theme }) => theme.colors.background};
    width: 7rem;
    height: 4rem;
  `,
  DragBtn: styled.button`
    border: 0.1rem solid black;
  `,
};
SQ.DescriptionBox = styled(SQ.ShortBox)`
  padding-left: 1rem;
  text-align: left;
  width: 32rem;
`;
SQ.DragBox = styled(SQ.ShortBox)`
  &:hover {
    color: ${({ theme }) => theme.colors.mainColor};
  }
`;
