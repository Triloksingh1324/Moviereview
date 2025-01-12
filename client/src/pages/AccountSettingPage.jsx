import React, { useEffect, useState } from "react";
import getUserDetail from "../hooks/GetUserDetails";
import axios from "axios"; // Use axios to send data to the backend
import "../css/AccountSettingPage.css";
import { FaUserCircle } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../component/Navbar";
const AccountSettings = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [auth, setAuth] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
  ];
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "********", // Default to hidden password
    profileImage: "", // Add profile image
  });

  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [show,setShow]=useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [showDeleteBtn, setShowDeleteBtn] = useState(true);
  const [checkVerify, setCheckVerify] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetail();
      console.log("us", userDetails.isVerified);
      if (userDetails) {
        setUserData({
          username: userDetails.username,
          email: userDetails.email,
          password: "********",
          profileImage: userDetails.profileImage,
          isVerified: userDetails?.isVerified,
          auth: userDetails?.authProvider,
        });
        setCheckVerify(userDetails.isVerified);
        setAuth(userDetails.authProvider);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setShowDeleteBtn(false);
  };

  const handleSetPassword=async()=>{
    
    if (passwordData.newPassword.length < 6) {
      toast.warn("Password must be greater than  5 characters", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New password and Confirmation Password do not match", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    
    let payload = { password: passwordData.newPassword };
    console.log("payload",payload)
    try {
      const result= await axios.post(`${apiUrl}/api/users/set-password`,payload,
        { withCredentials: true })
      console.log("result",result.data)
      if (result.data.success){
        toast.success(result.data.data, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log("Error Password Set",error)
      toast.error("Error Creating Password", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }
  // Function to send updated details to backend for specific field
  const handleSave = async (field) => {
    try {
      let payload = {};

      if (field === "username") {
        payload = { username: userData.username };
      } else if (field === "email") {
        const emailDomain = userData.email.split("@")[1];
        if (!commonDomains.includes(emailDomain)) {
          toast.error("Enter Valid Email", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }
        if (!emailRegex.test(userData.email)) {
          toast.error("Enter Valid Email", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }
        payload = { email: userData.email };
      } else if (field === "password") {
        // Validate password fields
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
          toast.error("New password and Confirmation Password do not match", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }
        if (passwordData.newPassword.length < 6) {
          toast.warn("Password must be greater than  5 characters", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }
        payload = {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        };
      }

      // Send the update to the backend only for the specific field
      const response = await axios.post(
        `${apiUrl}/api/users/update-${field}`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(`${field} updated successfully`, {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        const userDetails = await getUserDetail();

        setEditMode({ ...editMode, [field]: false }); // Exit edit mode
      } else {
        toast.error(`Failed to update ${field}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      if (field == "password") {
        toast.error("Old Password And New Password Do Not Match", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (field == "email") {
        toast.error("This Email already exist", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Something Wrong", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  
  // Function to handle profile image upload
  const handleProfileImageUpload = async () => {
    if (!profileImage) {
      toast.error("Please Select and Image First", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    const formData = new FormData();
    formData.append("profileImage", profileImage); // Append the profile image

    try {
      const response = await axios.post(
        `${apiUrl}/api/users/update-profile-image`,
        formData,
        { withCredentials: true }
      ); // Send formData directly

      if (response.status === 200) {
        toast.success("Profile Image Updated Successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Failed to upload Image", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      // alert("");
      toast.error("Error uploading profile image", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const removeProfileImage = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/users/remove-profile-image`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Profile Image Removed Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      // alert("")
      toast.error("Error deleting image", {
        position: "top-center",
        autoClose: 3000,
      });
      console.log("Error Deleting file", error);
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/users/send-verification-code`,
        {
          email: userData.email,
          subject: "Email Verification Code",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Verification code sent to your email", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to send verification code", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Use Same Email or Update it First", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Error sending verification code", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const verifyEmail = async () => {
    
    try {
      const response = await axios.post(
        `${apiUrl}/api/users/verify-email`,
        {
          email: userData.email,
          code: verificationCode,
        },
        { withCredentials: true }
      );
      console.log("res", response);
      if (response.status === 200) {
        setIsVerified(true);
        toast.success("Email verified successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid or Expired Code", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Error verifying email", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const handleToggle=async()=>{
    setShow(!show)
  }
  return (
    <>
      <Navbar  show={show}/>
      <div className="account-settings" onClick={handleToggle}>
        <h2 className="account-settings-title">Account Settings</h2>
        <h2 className="account-settings-title">Profile Image</h2>
        <div className="profile-section">
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt="Profile"
              className="profile-avatar"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            />
          ) : (
            <FaUserCircle
              size={100}
              className="profile-icon"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            />
          )}
          <input
            type="file"
            id="profileImageInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {profileImage && (
            <button className="upload-btn" onClick={handleProfileImageUpload}>
              <FaUpload className="uploadIcon" />
              Update Picture
            </button>
          )}
          <div className="dltAndUpload">
            <div>
              {showDeleteBtn && (
                <button
                  className="upload-btn"
                  onClick={() =>
                    document.getElementById("profileImageInput").click()
                  }
                >
                  <FaUpload className="uploadIcon" />
                  Upload New Image
                </button>
              )}
            </div>

            <div>
              {showDeleteBtn && (
                <button className="upload-btn2" onClick={removeProfileImage}>
                  <RiDeleteBin5Fill size={22} className="uploadIcon" />
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="account-section">
          <h3>Username</h3>
          <div className="account-field">
            {editMode.username ? (
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userData.username}</span>
            )}
            <button
              onClick={() =>
                editMode.username
                  ? handleSave("username")
                  : handleEditClick("username")
              }
            >
              {editMode.username ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="account-section">
          <h3>
            Email
            {checkVerify ? (
              <>
                <IoShieldCheckmarkSharp
                  title="Verified"
                  className="checkmark"
                />
                <span className="verifyIcon">Verified</span>
              </>
            ) : (
              <>
                <MdCancel title="Verified" className="checkmark2" />
                <span className="verifyIcon">Not Verified</span>
              </>
            )}
          </h3>

          <div className="account-field">
            {editMode.email ? (
              <div>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
                 <button
        className={checkVerify ? "send-code-btn2" : "send-code-btn"}
        onClick={checkVerify ? null : sendVerificationCode}
        disabled={checkVerify}
      >
        Send Verification Code
      </button>
                  
                
                
              </div>
            ) : (
              <span>{userData.email}</span>
            )}
            <button
              className={editMode.email ? "emailSave" : ""}
              onClick={() =>
                editMode.email ? handleSave("email") : handleEditClick("email")
              }
            >
              {editMode.email ? "Save" : "Edit"}
            </button>
          </div>

          {editMode.email && (
            
            <div className="verification-section">
              {!checkVerify &&
              <input
                type="text"
                placeholder="Enter 6-Digit Verfication Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
}{!checkVerify &&
              <button className="verify-btn" onClick={verifyEmail}>
                Verify
              </button>
}
            </div>
          )}
          
        </div>

        <div className="account-section">
        {auth ? (<h3>Set Password</h3>):(<h3>Password</h3>)}
  
  <div className="account-field">
    {auth ? (
      <div>
        {/* <h3>Set New Password</h3> */}
        <form className="formSetPassword">
          <h3>New Password:</h3>
          <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

          <h3 className="confPassword">Confirm Password:</h3>
          <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
            />
        </form>
        <button className="setPassword" onClick={handleSetPassword}>
  Set Password
</button>
      </div>
    ) : (
      <div className="editModePassword">
        {editMode.password ? (
          <div className="password-edit">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
            />
          </div>
        ) : (
          <div className="spanPassword">{userData.password}</div>
        )}
        <div className="btnEdit">
        <button
          onClick={() =>
            editMode.password
              ? handleSave("password")
              : handleEditClick("password")
          }
        >
          {editMode.password ? "Save" : "Edit"}
        </button>
        </div>
      </div>
    )}
  </div>
</div>

        <ToastContainer />
      </div>
    </>
  );
};

export default AccountSettings;
