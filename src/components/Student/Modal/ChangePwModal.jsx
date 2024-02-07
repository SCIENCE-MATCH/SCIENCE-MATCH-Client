import React from "react";
import ModalPortal from "./ModalPortal";
import ModalForm from "./ModalForm";

const ChangePwModal = ({ setModalOn }) => {
  return (
    <ModalPortal>
      <ModalForm setModalOn={setModalOn} />
    </ModalPortal>
  );
};

export default ChangePwModal;
