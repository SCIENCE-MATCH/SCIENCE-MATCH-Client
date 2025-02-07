const handleChangeInput = (e, input, updateInput) => {
  const questionId = e.target.id;
  const updatedInput = [...input];
  const existingQuestion = updatedInput.find((item) => item.id === questionId);
  let newValue = e.target.value;

  if (existingQuestion) {
    // 이미 해당 질문에 대한 답변이 있는 경우 업데이트
    existingQuestion.answer = newValue;
  } else {
    // 해당 질문에 대한 답변이 없는 경우 추가
    updatedInput.push({ id: questionId, answer: newValue });
  }

  updateInput(updatedInput);
};

export default handleChangeInput;
