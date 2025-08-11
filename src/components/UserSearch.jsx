import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useParams } from "react-router-dom"; // Uncomment later

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [invitedUserIds, setInvitedUserIds] = useState([]);

  // const { groupId } = useParams();
  const groupId = 1;

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
      const response = await axios.get(`${API_URL}/api/users/search?query=${searchTerm}`);
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
      console.error("Failed to send invite:", error.response?.data || error.message);
      toast.error(`${error.response?.data?.error || "Failed to send invite."}`);
    }
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          style={{ padding: "8px", width: "250px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "10px", padding: "8px 12px" }}>
          Search
        </button>

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <ul
            style={{
              border: "1px solid #ccc",
              maxHeight: "150px",
              overflowY: "auto",
              width: "250px",
              backgroundColor: "white",
              position: "absolute",
              zIndex: 10,
              marginTop: "5px",
              padding: 0,
              listStyle: "none",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.id}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
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
            <li key={u.id} style={{ marginBottom: "8px" }}>
              <strong style={{ marginRight: "10px" }}>{u.username}</strong>
              <button
                style={{ padding: "5px 20px" }}
                onClick={() => handleInvite(u.id)}
                disabled={invitedUserIds.includes(u.id)}
              >
                {invitedUserIds.includes(u.id) ? "Invited" : "Invite"}
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

      {/* Toast Notifications */}
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
    </div>
  );
};

export default UserSearch;
