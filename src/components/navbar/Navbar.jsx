import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn"); // Remove login session
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.akshaya_logo} alt="Logo" />

      <div className="navbar-buttons">
        <button className="change-password-btn" onClick={() => navigate("/change-password")}>
          Change Password
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
