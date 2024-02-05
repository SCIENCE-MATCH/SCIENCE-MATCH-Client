import { useState } from "react";
import Styles from "./AddQuestion.module.css";
import ChapterLookUp from "./ChapterLookUp";
import RegisterQuestion from "./RegisterQuestion";

const AddQuestion = () => {
  const [chapToAdd, setChapToAdd] = useState([null]);

  return (
    <div className={Styles.backgroundBox}>
      <ChapterLookUp exportChapToAdd={setChapToAdd} />
      <RegisterQuestion chapToAdd={chapToAdd} />
    </div>
  );
};

export default AddQuestion;
