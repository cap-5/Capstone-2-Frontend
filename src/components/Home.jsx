import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import "./HomeStyle.css"

const Home = () => {
  return (
    <Box className="hero-container">
      <div className="animated-bg"></div>
      <Container maxWidth="md" className="content">
        <Typography variant="h2" className="title">
          Snap. Split. Send.
        </Typography>
        <Typography variant="h6" className="subtitle">
          Capture your receipts, split the bill, and share with friends
          instantly.
        </Typography>
        <Button variant="contained" size="large" className="cta-button">
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
