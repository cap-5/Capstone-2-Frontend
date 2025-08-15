import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

export default function Dash() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        {/* Side Menu */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Menu</Typography>
            <Button fullWidth sx={{ mt: 2 }}>
              Option 1
            </Button>
            <Button fullWidth>Option 2</Button>
          </Box>
        </Drawer>

        {/* Navbar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
            p: 3,
          })}
        >
          <Toolbar />
          <Stack spacing={2} sx={{ alignItems: "center" }}>
            <Typography variant="h4">Welcome!</Typography>
            <Typography>This is your standalone MUI Dashboard.</Typography>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
