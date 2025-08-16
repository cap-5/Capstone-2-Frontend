import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import "./HomeStyle.css";

// Typewriter effect for subtitle
const Typewriter = ({ text, speed = 50 }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
};

const Home = ({ user }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <Box className="hero-container">
      {/* Animated gradient background */}
      <div className="animated-bg"></div>

      {/* Particles */}
      <Particles
        className="particles"
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            move: { enable: true, speed: 0.5 },
            opacity: { value: 0.3 },
            color: { value: "#ffffff" },
          },
        }}
      />

      {/* Floating shapes */}
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>

      <Container maxWidth="md" className="content">
        <Typography variant="h2" className="title">
          Snap. Split. Send.
        </Typography>
        <Typography variant="h6" className="subtitle">
          <Typewriter text="Capture your receipts, split the bill, and share with friends instantly." />
        </Typography>
        <Button
          variant="contained"
          size="large"
          className="cta-button"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </Container>

      {/* Scroll indicator */}
      <div className="scroll-indicator">⬇️</div>
    </Box>
  );
};

export default Home;
