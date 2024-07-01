import React, { useState } from "react";
import styled from "styled-components";

const RadioButton = ({ label, value, checked, onChange }) => {
  return (
    <RadioButtonLabel>
      <HiddenRadioButton type="radio" value={value} checked={checked} onChange={onChange} />
      <StyledRadioButton checked={checked} />
      {label}
    </RadioButtonLabel>
  );
};

const TestPage = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div>
      <RadioButton label="Option 1" value="option1" checked={selectedValue === "option1"} onChange={handleChange} />
      <RadioButton label="Option 2" value="option2" checked={selectedValue === "option2"} onChange={handleChange} />
      <RadioButton label="Option 3" value="option3" checked={selectedValue === "option3"} onChange={handleChange} />
    </div>
  );
};

export default TestPage;

const HiddenRadioButton = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledRadioButton = styled.div`
  width: 16px;
  height: 16px;
  background: ${(props) => (props.checked ? "black" : "white")};
  border-radius: 50%;
  border: 1px solid black;
  transition: all 150ms;
  ${HiddenRadioButton}:focus + & {
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.25);
  }
  display: inline-block;
  margin-right: 8px;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 8px;
  user-select: none;
`;
