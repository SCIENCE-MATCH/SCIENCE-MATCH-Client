import React from "react";
import styles from "./IconBtn.module.css"; // 스타일 파일을 가져옵니다.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faCheck,
  faTrash,
  faAngleDown,
  faAngleUp,
  faSave,
  faPlus,
  faP
} from "@fortawesome/free-solid-svg-icons";

function IconBtn({ icon, onClick, disabled, checked, style }) {
  return (
    <button
      className={`${icon === "trash" && !disabled ? styles.red : ""} ${
        checked ? styles.checked : ""
      } ${disabled ? styles.disabledBtn : styles.iconButton}`}
      onClick={onClick}
      disabled={disabled}
      style={style ? style : {}}
    >
      <FontAwesomeIcon
        icon={
          icon === "pen"
            ? faPen
            : icon === "check"
            ? faCheck
            : icon === "trash"
            ? faTrash
            : icon === "down"
            ? faAngleDown
            : icon === "up"
            ? faAngleUp
            : icon === "save"
            ? faSave
            : icon === "plus"
            ? faPlus
            : ""
        }
      />
      {/* Font Awesome 아이콘을 사용합니다. */}
    </button>
  );
}

export default IconBtn;
