import React, { useState, useEffect } from "react";
import "../css/RegisterModel.css";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import googleIcon from "../assets/google.svg";
import { useAuth0 } from "@auth0/auth0-react";

function LoginModel({ onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "";

  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  console.log("user4", user);
  useEffect(() => {
    const verificationState = localStorage.getItem("isVerificationSent");
    if (verificationState === "true") {
      setIsVerificationSent(true);
    }
  }, []);

   const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${apiUrl}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
      if (result.data.success) {
        toast.success(result.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          onLoginSuccess();
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      toast.error("Invalid Details", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error:", err);
    }
  };

  const handleForgetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const result = await axios.post(`${apiUrl}/api/users/forgot-password`, {
        email,
        subject: "Forget Password Code",
      },{ withCredentials: true });
      if (result.data.success) {
        setIsVerificationSent(true);
        localStorage.setItem("isVerificationSent", "true");
        toast.success("Verification code sent to your email.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Error sending reset email", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error:", err);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const result = await axios.post(`${apiUrl}/api/users/verify-code`, {
        email,
        code: verificationCode,
      },{ withCredentials: true });
      if (result.data.success) {
        toast.success("Code verified successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setIsVerificationSent(false);
        setIsCodeVerified(true);
        localStorage.removeItem("isVerificationSent");
      } else {
        toast.error("Invalid verification code.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Error verifying code.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error:", err);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Passwords should be greater than 5 characters!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const result = await axios.post(`${apiUrl}/api/users/reset-password`, {
        email,
        password: newPassword,
      },{ withCredentials: true });
      if (result.data.success) {
        toast.success(result.data.data, {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          setIsCodeVerified(false);
        }, 3000);
      }
    } catch (err) {
      toast.error("Error resetting password.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error:", err);
    }
  };
  const handleAuth0Login = async () => {
    try {
      await loginWithRedirect();
      localStorage.setItem("toast", "true");
    } catch (error) {
      console.error("Login redirect error:", error);
      // toast.error("Error redirecting to login.", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="loginMainContainer">
      <div className="registerFormContainer">
        <h2 className="heading">Login</h2>
        <div className="registerInputContainer">
          <input
            className="registerInputField"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        {!isVerificationSent && !isCodeVerified && (
          <>
            <div className="registerInputContainer">
              <input
                className="registerInputField"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="forget">
              <button onClick={handleForgetPassword}>Forget Password?</button>
            </div>
            <div>
              <button className="btnRegister" onClick={handleLogin}>
                Login
              </button>
            </div>
          </>
        )}

        {isVerificationSent && !isCodeVerified && (
          <>
            <div className="registerInputContainer">
              <input
                className="registerInputField"
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <label htmlFor="verificationCode">Enter Verification Code</label>
            </div>
            <div>
              <button className="btnRegister" onClick={handleVerifyCode}>
                Verify Code
              </button>
            </div>
          </>
        )}

        {isCodeVerified && (
          <>
            <div className="registerInputContainer">
              <input
                className="registerInputField"
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="newPassword">New Password</label>
            </div>
            <div className="registerInputContainer">
              <input
                className="registerInputField"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <div>
              <button className="btnRegister" onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          </>
        )}
        <div className="registerWith">or Login with</div>
        <div className="googleButton">
          {isAuthenticated ? (
            <button onClick={() => logout()}>logout</button>
          ) : (
            ""
          )}
          <button onClick={handleAuth0Login} className="googleButton">
            <img src={googleIcon} alt="Google" className="googleIcon" />
          </button>
        </div>
        <div className="member">
          Don't have an account?{" "}
          <Link onClick={onSwitchToRegister}>Register</Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default LoginModel;
