import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }
    try {
      await axios.post("https://adminbackend-dg8o.onrender.com/api/admin/change-password", {
        email,
        action: "send-otp",
      });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error("Error sending OTP. Try again.");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      await axios.post("https://adminbackend-dg8o.onrender.com/api/admin/change-password", {
        email,
        otp,
        action: "verify-otp",
      });
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP. Please check and try again.");
    }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    try {
      await axios.post("https://adminbackend-dg8o.onrender.com/api/admin/change-password", {
        email,
        newPassword,
        action: "change-password",
      });
      toast.success("Password changed successfully!");
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to dashboard after success
      }, 2000);
    } catch (error) {
      toast.error("Error changing password. Try again.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={changePassword}>Change Password</button>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
