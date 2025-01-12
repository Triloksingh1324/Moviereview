import React, { useState } from "react";
import "../css/RegisterModel.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterModel = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Client-side validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const emailDomain = email.split("@")[1];
      if (!commonDomains.includes(emailDomain)) {
      toast.error("Enter Valid Email", {
        position: "top-center",
        autoClose: 3000,
      });
      return
    }
    if (!emailRegex.test(email)){
      toast.error("Enter Valid Email", {
        position: "top-center",
        autoClose: 3000,
      });
      return
    }
  
    const data = {
      username,
      email,
      password,
      confirmPassword,
    };
  
    try {
      const result = await axios.post(`${apiUrl}/api/users/register`, data,
        { withCredentials: true } 
      );
  
      if (result.data.success) {
        toast.success(result.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          onSwitchToLogin();
         
        }, 3000);
        
      } else {
        toast.warn(result.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      toast.error("User already exist", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error:", err);
    }
  };
  
  return (
    <div className="registerMainContainer">
      <div className="registerFormContainer">
        <h2 className="heading">Register</h2>

        {/* {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
            Registration successful!
          </Alert>
        )} */}

        <div className="registerInputContainer">
          <input
            className="registerInputField"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username" className="labels">Username</label>
        </div>

        <div className="registerInputContainer">
          <input
            className="registerInputField"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email" className="labels">Email</label>
        </div>

        <div className="registerInputContainer">
          <input
            className="registerInputField"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="createPassword" className="labels">Create Password</label>
        </div>

        <div className="registerInputContainer">
          <input
            className="registerInputField"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword" className="labels">Confirm Password</label>
        </div>

        <div>
          <button className="btnRegister" onClick={handleSubmit}>Register</button>
        </div>

        <div className="member">
          Already a member? <Link onClick={onSwitchToLogin}>Login</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegisterModel;
