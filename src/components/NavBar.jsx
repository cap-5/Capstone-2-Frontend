import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
<<<<<<< HEAD
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
=======
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          Capstone II
        </Typography>

        {/* Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              <Button component={RouterLink} to="/upload/1" color="inherit">
                OCR Tool
              </Button>
              <Button component={RouterLink} to="/user-search" color="inherit">
                User Search
              </Button>
              <Button component={RouterLink} to="/create-group" color="inherit">
                Create Group
              </Button>
              <Button component={RouterLink} to="/assign" color="inherit">
                Assign
              </Button>
              <Button component={RouterLink} to="/dashboard" color="inherit">
                Dashboard
              </Button>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", ml: 2, mr: 1 }}
              >
                Welcome, {user.username}!
              </Typography>

              <Button
                onClick={handleLogout}
                variant="contained"
                color="error"
                size="small"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/signup" color="inherit">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
>>>>>>> 5a5e9cb9a52b7df6ee7601e2f0ce023cf2c96afd
  );
};

export default NavBar;
