import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./UserSearch.css";

const UserSearch = () => {
  const [users, setUsers] = useState([]); // Displays all users
  const [search, setSearch] = useState(""); // Search input
  const [loading, setLoading] = useState(false); // Loading
  const [suggestions, setSuggestions] = useState([]); // Autocomplete results for search input
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page number
  const [totalPages, setTotalPages] = useState(1); // Tracks total number of pages available from backend 

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
      setTotalPages(response.data.totalPages || 1 );
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetches username suggestions for autocomplete
  const fetchSuggestions = async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/search?query=${searchTerm}`); 
      setSuggestions(response.data || []); 
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Fetch on initial load
  useEffect(() => {
    fetchUsers(); // Loads users immediately 
  }, [currentPage]);

  // This calls "fetchUsers" when user types and presses "Search"
  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 when searching
    fetchUsers(); // Fetches data
    setSuggestions([]); 
  };

  return (
    <div style={{ padding: "20px", position: "relative", maxWidth: "400px" }}>
      <h2>All Users</h2>

      {/* Search Input */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
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
          style={{ padding: "8px", width: "250px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "10px", padding: "8px 12px" }}>
          Search
        </button>

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <ul style={{
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            width: "250px",
            backgroundColor: "white",
            position: "absolute",
            zIndex: 10,
            marginTop: "5px",
            padding: 0,
            listStyle: "none"
          }}>
            {suggestions.map((s) => (
              <li
                key={s.id}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                }}
                onClick={() => {
                  setSearch(s.username);
                  setSuggestions([]);
                  fetchUsers();
                }}
              >
                {s.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Loading */}
      {loading && <p>Loading users...</p>}

      {/* User List */}
      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u.id}>
              <strong style={{ marginRight: "10px" }}>{u.username}</strong> 
              <button style={{ padding: "5px 20px" }}>Invite</button>
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
          style={{ padding: "5px 10px" }}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ padding: "5px 10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserSearch;
