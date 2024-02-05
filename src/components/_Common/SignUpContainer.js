import React from "react";
import styles from "./SignUpContainer.module.css";

const SignUpContainer = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default SignUpContainer;
