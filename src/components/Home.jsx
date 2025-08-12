import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import "./Homestyle.css";

const HeroSection = () => {
  return (
    <Box className="hero-container">
      <svg
        className="topographic-map"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
      >
        {/* Your SVG content here */}
      </svg>
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

export default HeroSection;
