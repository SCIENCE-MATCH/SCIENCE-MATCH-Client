import { useState, useEffect } from "react";
import { getCookie } from "../../../components/_Common/cookie";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Styles from "./CreateQuestionPaper.module.css";
import PdfGenerator from "./GeneratePDF";
import ChapterLookUp from "../../adminRoutes/Question/ChapterLookUp";
import ChapterOnlyShow from "./ChapterOnlyShow";

const CreateQuestionPaper = () => {
  const history = useHistory();
  const [chapToSearch, setChapToSearch] = useState(null);
  const [selectedChaps, setSelectedChaps] = useState([]);
  return (
    <div className={Styles.backgroundBox}>
      <ChapterOnlyShow
        selectedChaps={selectedChaps}
        setSelectedChaps={setSelectedChaps}
      />
      <PdfGenerator />
    </div>
  );
};

export default CreateQuestionPaper;
