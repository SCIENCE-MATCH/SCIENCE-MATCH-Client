/*import React from "react";
import styles from "./InputButton.module.css";
import PropTypes from "prop-types";

const InputButton = ({ value, type, onClick, disabled }) => {
  return (
    <button
      className={styles.inputButton}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

InputButton.propTypes = {
  value: PropTypes.string
};

export default InputButton;*/
import React, { MouseEvent } from "react";
import styles from "./InputButton.module.css";

const InputButton = ({ value, type = "button", onClick, disabled = false }) => {
  const buttonClassName = disabled
    ? styles.disabledInputButton
    : styles.inputButton;
  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={disabled}
      tabIndex={-1}
    >
      {value}
    </button>
  );
};

export default InputButton;
