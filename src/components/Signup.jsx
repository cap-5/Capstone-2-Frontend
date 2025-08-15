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
import { useAuth0 } from "@auth0/auth0-react";
import GoogleIcon from "@mui/icons-material/Google";

const Signup = ({ setUser }) => {
  const { loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    profilePic: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    else if (formData.username.length < 3 || formData.username.length > 20)
      newErrors.username = "Username must be 3-20 characters";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Pleaase confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password,
          email: formData.email,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error || "An error occurred during signup",
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
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(270deg, #001f3f, #0074D9, #7FDBFF, #001f3f)",
        backgroundSize: "1200% 1200%",
        animation: "moveGradient 30s linear infinite",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          zIndex: 1,
          width: "100%",
          maxWidth: 450,
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
          Sign Up
        </Typography>

        {errors.general && (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {errors.general}
          </Typography>
        )}

        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

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

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

        <TextField
          label="Profile Pic URL"
          name="profilePic"
          value={formData.profilePic}
          onChange={handleChange}
          variant="filled"
          fullWidth
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
        />

        {/* Regular Sign Up Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ py: 1.5, mt: 1 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign Up"
          )}
        </Button>

        {/* Google Sign Up / Login Button */}
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() =>
            loginWithRedirect({
              connection: "google-oauth2",
              screen_hint: "signup",
            })
          }
          sx={{
            py: 1.5,
            mt: 1,
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "#4285F4",
              backgroundColor: "#f5f5f5",
              color: "black",
            },
          }}
          fullWidth
        >
          Sign up with Google
        </Button>

        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" color="secondary">
            Login
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

export default Signup;
