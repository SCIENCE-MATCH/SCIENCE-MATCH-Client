import React, { ChangeEvent } from "react";
import styles from "./InputBox.module.css";
import PropTypes from "prop-types";

const InputBox = ({
  type,
  key,
  value,
  onChange,
  maxLength,
  placeholder,
  isRequired,
  isDisabled
}) => {
  return (
    <input
      className={styles.inputBox}
      type={type}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      placeholder={placeholder}
      required={isRequired}
      disabled={isDisabled}
    />
  );
};

export default InputBox;
