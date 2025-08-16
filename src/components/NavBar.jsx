import React from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
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
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            height: "64px", // define navbar height
          }}
        >
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
            Home
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <Button component={RouterLink} to="/upload/1" color="inherit">
                  OCR Tool
                </Button>
                <Button component={RouterLink} to="/Group" color="inherit">
                  My Groups
                </Button>
                <Button component={RouterLink} to="/assign" color="inherit">
                  Assign
                </Button>
                <Button component={RouterLink} to="/dashboard" color="inherit">
                  Dashboard
                </Button>
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

      {/* Offset for fixed AppBar */}
      <Toolbar sx={{ minHeight: "64px" }} />

      {/* Nested routes */}
      <Outlet />
    </>
  );
};

export default NavBar;
