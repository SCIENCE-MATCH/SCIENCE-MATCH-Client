import React from "react";
import styles from "./InputBox.module.css";
import PropTypes from "prop-types";

const InputBox = ({
  type,
  value,
  onChange,
  maxLegnth,
  placeholder,
  isRequired,
}) => {
  return (
    <div className={styles.inputBox}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLegnth}
        placeholder={placeholder}
        required={isRequired}
      />
    </div>
  );
};
InputBox.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.string,
  maxLegnth: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.string,
};

export default InputBox;
