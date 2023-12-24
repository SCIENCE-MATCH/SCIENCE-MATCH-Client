import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Styles from "./AddQuestion.module.css";
import ChapterLookUp from "./ChapterLookUp";
import RegisterQuestion from "./RegisterQuestion";

const AddQuestion = () => {
  const history = useHistory();
  const [chapToAdd, setChapToAdd] = useState([null]);

  return (
    <div className={Styles.backgroundBox}>
      <ChapterLookUp exportChapToAdd={setChapToAdd} />
      <RegisterQuestion chapToAdd={chapToAdd} />
    </div>
  );
};

export default AddQuestion;
