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
  const [users, setUsers] = useState([]); // Displays all users
  const [search, setSearch] = useState(""); // Search input
  const [loading, setLoading] = useState(false); // Loading
  const [suggestions, setSuggestions] = useState([]); // Autocomplete results for search input
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page number
  const [totalPages, setTotalPages] = useState(1); // Tracks total number of pages available from backend 
  const [selectedGroupId, setSelectedGroupId] = useState(""); // Invite


  // Fetches users from the backened with pagination search 
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

  // Fetch on initial load 
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
    setSuggestions([]);
  };

  const handleInvite = async (receiverId) => {
    if (!selectedGroupId) {
      alert("Please select a group first.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/group/invite`,
        {
          receiverId,
          GroupId: selectedGroupId,
        },
        {
          withCredentials: true,
        }
      );

      alert("Invite sent successfully!");
    } catch (error) {
      console.error("Invite failed:", error);
      if (error.response?.data?.error) {
        alert(`Invite failed: ${error.response.data.error}`);
      } else {
        alert("Failed to send invite.");
      }
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
      </div>

       {/* Group Selection Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="group-select" style={{ marginRight: "10px" }}>
          Select a group:
        </label>
        <select
          id="group-select"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="">-- Choose Group --</option>
          <option value="1">Group 1</option>
          <option value="2">Group 2</option>
          {/* Later, fetch your actual groups dynamically */}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* User List */}
      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u.id}>
              <strong style={{ marginRight: "10px" }}>{u.username}</strong> 
              <button onClick={() => handleInvite(u.id)} style={{ padding: "5px 20px" }}>
                Invite 
              </button>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
      
      {/* Pagination Controls */}
      <div style={{ marginTop: "15px", display: "flex", alignItems: "center" }}>
        <button
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
