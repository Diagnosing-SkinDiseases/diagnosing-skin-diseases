import React from "react";
import "../../CSS/Admin/ConfirmModal.css";

const ConfirmModal = ({ show, handleClose, children }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ConfirmModal;
