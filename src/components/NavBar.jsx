import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, onLogout, groupId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // call your logout logic first
    navigate("/"); // then navigate to home ("/")
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone II</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <Link to="/upload/1" className="nav-link">
              OCR Tool
            </Link>
            <Link to="/user-search" className="nav-link">
              User Search
            </Link>
            <Link to="/create-group" className="nav-link">
              Create Group
            </Link>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
