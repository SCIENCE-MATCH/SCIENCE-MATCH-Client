const handleChangeInput = (e, input, updateInput) => {
    const questionId = e.target.id;
    const updatedInput = [...input];
    const existingQuestion = updatedInput.find((item) => item.id === questionId);

    if (existingQuestion) {
      // 이미 해당 질문에 대한 답변이 있는 경우 업데이트
      existingQuestion.answer = e.target.value;
    } else {
      // 해당 질문에 대한 답변이 없는 경우 추가
      updatedInput.push({ id: questionId, answer: e.target.value });
    }

    updateInput(updatedInput);
};

export default handleChangeInput;