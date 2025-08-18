import React from "react";
import { Link, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";


const drawerWidth = 240;
const navBarHeight = 64;

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
            animation: "gradientShift 15s ease infinite",
            backdropFilter: "blur(6px)",
          }}
        >
          <Typography variant="h6" sx={{ color: "white", p: 2 }}>
            My Dashboard
          </Typography>
          <List>
            <ListItem button component={Link} to="profile">
              <ListItemText primary="Profile" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button component={Link} to="notifications">
              <ListItemText primary="Group Invites" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button component={Link} to="userReceipts">
              <ListItemText
                primary="My Upload Receipts"
                sx={{ color: "white" }}
              />
            </ListItem>

            <ListItem button component={Link} to="payments">
              <ListItemText primary="My Payments" sx={{ color: "white" }} />
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
