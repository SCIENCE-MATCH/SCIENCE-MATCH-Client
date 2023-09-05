import { useState } from "react";
import RegistStudent from "./RegistStudent";

const ManageStudent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "flex-end"
        }}
      >
        <p>~검색 기능~</p>
        <button onClick={openModal}>학생 개별 등록</button>
        {modalOpen && <RegistStudent closeModal={closeModal} />}
      </div>
    </div>
  );
};

export default ManageStudent;
