import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout, groupId }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone II</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <Link to="/upload/1">OCR Tool</Link>
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
