import React from "react";
import "../../CSS/Admin/ConfirmModal.css";

const ConfirmModal = ({ show, handleClose, children }) => {
  return (
    <div className={`delete-modal ${show ? "show" : ""}`} onClick={handleClose}>
      <div
        className="delete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ConfirmModal;
