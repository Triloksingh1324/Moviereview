// Modal.js
import React from "react";
import "../css/Model.css"
import { ImCross } from "react-icons/im";
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeModal" onClick={onClose}><ImCross size={18}/></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
