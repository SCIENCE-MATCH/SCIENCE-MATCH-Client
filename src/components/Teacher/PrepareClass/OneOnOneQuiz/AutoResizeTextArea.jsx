import { useEffect, useRef } from "react";
import styled from "styled-components";

/** value, setValue, placehoder, width*/
const AutoResizeTextArea = ({ value, setValue, placeholder, width, maxLen }) => {
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    if (event.target.value.length <= maxLen) {
      setValue(event.target.value);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <ARTA.TextAreaWrapper $width={width}>
      <ARTA.MyTextArea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        $width={width}
      />
      <ARTA.CharCount>{`${value.length} / ${maxLen}`}</ARTA.CharCount>
    </ARTA.TextAreaWrapper>
  );
};

export default AutoResizeTextArea;
const ARTA = {
  TextAreaWrapper: styled.div`
    position: relative;
    width: ${({ $width }) => $width};
  `,
  MyTextArea: styled.textarea`
    width: ${({ $width }) => $width};
    min-height: 4rem;
    border-radius: 0.8rem;
    border: 0.02rem solid ${({ theme }) => theme.colors.unselected};
    padding-left: 1rem;
    padding-block: 0.75rem;
    line-height: 3rem;
    font-size: 1.7rem;
    font-weight: 600;
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
  `,
  CharCount: styled.div`
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    color: ${({ theme }) => theme.colors.gray60};
    font-size: 1.1rem;
    font-weight: 400;
  `,
};
