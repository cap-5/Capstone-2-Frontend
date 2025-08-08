import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css"

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone II</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/ocr" className="nav-link">
              OCR Tool
            </Link>
      <Link to="/UserSearch" className="nav-link">
              User Search
            </Link>
            <Link to="/Profile" className="nav-link">
                 Profile
            </Link>
            <Link to="/CreateGroup"  className="nav-link">
                Create Group
            </Link>
        {user ? (
          <div className="user-section">
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
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
