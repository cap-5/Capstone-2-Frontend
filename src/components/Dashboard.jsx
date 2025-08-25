import React from "react";
import { Link, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import "./dash.css";
// Icons
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import "./dash.css";
import { keyframes } from "@emotion/react";

const drawerWidth = 240;
const navBarHeight = 64;

// Gradient animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: `calc(100vh - ${navBarHeight}px)` }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            top: `${navBarHeight}px`,
            height: `calc(100vh - ${navBarHeight}px)`,
            borderRight: "none",
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            height: "100%",
            background: `linear-gradient(
              270deg,
              rgba(102, 126, 234, 0.5),
              rgba(118, 75, 162, 0.5),
              rgba(107, 141, 214, 0.5),
              rgba(118, 75, 162, 0.5)
            )`,
            backgroundSize: "800% 800%",
            animation: `${gradientShift} 15s ease infinite`,
            backdropFilter: "blur(6px)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "white", p: 2, fontWeight: "bold" }}
          >
            My Dashboard
          </Typography>
          <List>
            <ListItem
              button
              component={Link}
              to="profile"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <PersonIcon sx={{ mr: 1 }} />
              <ListItemText primary="Profile" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="notifications"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <NotificationsIcon sx={{ mr: 1 }} />
              <ListItemText primary="Group Invites" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="userReceipts"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <ReceiptIcon sx={{ mr: 1 }} />
              <ListItemText primary="My Upload Receipts" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="payments"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <PaymentIcon sx={{ mr: 1 }} />
              <ListItemText primary="My Payments" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          overflowY: "auto",
          marginTop: `${navBarHeight}px`,
          height: `calc(100vh - ${navBarHeight}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
