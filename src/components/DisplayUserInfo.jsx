import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          withCredentials: true,
        });

        const data = res.data.userInfo;

        setUser(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          profilePicture: data.profilePic || "",
        });
      } catch (err) {
        setError("Failed to load user info");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const res = await axios.patch(`${API_URL}/api/users/me`, form, {
        withCredentials: true,
      });

      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user.");
    }
  };

  const handleCancel = () => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      profilePicture: user.profilePic || "",
    });
    setIsEditing(false);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card
        sx={{
          width: 500,
          boxShadow: 4,
          borderRadius: 3,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)", // lifts up slightly
            boxShadow: 8, // stronger shadow
          },
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={form.profilePicture}
              sx={{ width: 64, height: 64 }}
              alt={form.firstName || "User"}
            />
          }
          title={`${user.firstName} ${user.lastName}`}
          subheader={user.email}
        />
        <CardContent>
          <Stack spacing={2}>
            {isEditing ? (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Profile Picture URL"
                  name="profilePicture"
                  value={form.profilePicture}
                  onChange={handleChange}
                  fullWidth
                />
                {form.profilePicture && (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Avatar
                      src={form.profilePicture}
                      sx={{ width: 100, height: 100 }}
                      alt="Preview"
                    />
                  </Box>
                )}
              </>
            ) : (
              <>
                <Typography>
                  <strong>First Name:</strong> {user.firstName}
                </Typography>
                <Typography>
                  <strong>Last Name:</strong> {user.lastName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography>
                  <strong>Profile Pic:</strong> {user.profilePic || "N/A"}
                </Typography>
              </>
            )}

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              {!isEditing ? (
                <Button variant="contained" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
