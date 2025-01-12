import React, { useState } from 'react';
import "../css/LogoutModal.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
const LogoutModal = ({ isOpen, onClose, onLogoutConfirm }) => {
  
  const { logout} = useAuth0();
  if (!isOpen) return null;
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const handleLogout = async () => {
    await axios
      .post(`${apiUrl}/api/users/logOut`,{},{ withCredentials: true } )
      .then((result) => {
        if (result.data.success) {
          
          toast.success(result.data.message, {
            position: "top-center",
            autoClose: 3000,
            onClose: () => {
              window.location.reload(); // Reload page after toast closes
            }
          });
          logout()
        }
        setTimeout(()=>{
          onLogoutConfirm()
        },2000)
        
      })
      .catch((err) => {
        toastwarn("Logout Failed", {
          position: "top-center",
          autoClose: 3000,
        });
        console.log(err)
      });
  };
  return (
    <div className="logoutModalOverlay">
      <div className="logoutModalContent">
        <h3>Are you sure you want to logout?</h3>
        <div className="logoutModalButtons">
          <button className="confirmButton" onClick={handleLogout}>
            Yes, Logout
          </button>
          <button className="cancelButton" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default LogoutModal;
