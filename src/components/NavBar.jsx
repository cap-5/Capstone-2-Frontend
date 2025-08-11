import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Home, Bell, Settings, HelpCircle, Shield } from "lucide-react";

// Tabs with paths and icons
const tabs = [
 
];


const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
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

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              {/* Dynamic Tabs */}
              {tabs.map((tab, index) => {
                if (tab.type === "separator") return null; // Skip separator
                const Icon = tab.icon;
                return (
                  <Button
                    key={index}
                    component={RouterLink}
                    to={tab.path}
                    color="inherit"
                    startIcon={<Icon size={18} />}
                  >
                    {tab.title}
                  </Button>
                );
              })}

              {/* Other Static Buttons (Optional — remove if redundant) */}
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

              {/* User Info + Logout */}
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
  );
};

export default NavBar;

