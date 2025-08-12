import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [invitedUserIds, setInvitedUserIds] = useState([]);

  //CHANGE THIS LATER
  const groupId = 4;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/Allusers`, {
        params: {
          page: currentPage,
          limit: 10,
          search: search,
        },
        withCredentials: true,
      });
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (searchTerm) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/users/search?query=${searchTerm}`
      );
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
    setSuggestions([]);
  };

  const handleInvite = async (receiverId) => {
    try {
      await axios.post(
        `${API_URL}/api/group/invite`,
        {
          receiverId,
          GroupId: groupId,
        },
        { withCredentials: true }
      );

      toast.success("Invite sent successfully!");
      setInvitedUserIds((prev) => [...prev, receiverId]);
    } catch (error) {
      console.error(
        "Failed to send invite:",
        error.response?.data || error.message
      );
      toast.error(`${error.response?.data?.error || "Failed to send invite."}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 480, mx: "auto", position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>

      {/* Search input with button */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, position: "relative" }}>
        <TextField
          fullWidth
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            if (value.length > 0) {
              fetchSuggestions(value);
            } else {
              setSuggestions([]);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "56px",
              left: 0,
              right: 100, // leave space for button
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 20,
            }}
          >
            <List dense>
              {suggestions.map((s) => (
                <ListItem
                  button
                  key={s.id}
                  onClick={() => {
                    setSearch(s.username);
                    setSuggestions([]);
                    fetchUsers();
                  }}
                >
                  <ListItemText primary={s.username} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* User list */}
      <List>
        {users.length > 0
          ? users.map((u) => (
              <ListItem
                key={u.id}
                secondaryAction={
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleInvite(u.id)}
                    disabled={invitedUserIds.includes(u.id)}
                  >
                    {invitedUserIds.includes(u.id) ? "Invited" : "Invite"}
                  </Button>
                }
              >
                <ListItemText primary={u.username} />
              </ListItem>
            ))
          : !loading && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No users found.
              </Typography>
            )}
      </List>

      {/* Pagination controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 3,
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default UserSearch;
