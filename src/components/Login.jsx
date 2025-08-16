import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth0 } from "@auth0/auth0-react";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    else if (formData.username.length < 3 || formData.username.length > 20)
      newErrors.username = "Username must be 3-20 characters";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      });
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(270deg, #001f3f, #0074D9, #7FDBFF, #001f3f)",
        backgroundSize: "1200% 1200%",
        animation: "moveGradient 30s linear infinite",
        boxSizing: "border-box", // ✅ include padding in height
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          bgcolor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          color: "white",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Login
        </Typography>

        {errors.general && (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {errors.general}
          </Typography>
        )}

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ py: 1.5, mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        {/* Google Sign In Button */}
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() =>
            loginWithRedirect({
              connection: "google-oauth2", // Auth0 connection name for Google
            })
          }
          sx={{
            py: 1.5,
            mt: 1,
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "#ccc",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Sign in with Google
        </Button>

        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Don't have an account?{" "}
          <Link component={RouterLink} to="/signup" color="secondary">
            Sign up
          </Link>
        </Typography>
      </Box>

      <style>
        {`
          @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;
