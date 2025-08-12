import React, { useState, useEffect } from "react";
import axios from "axios";

const MyNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invites, setInvites] = useState([]);

  // Fetch invites on component mount
  useEffect(() => {
    const fetchInvites = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:8080/api/group/invites", {
          withCredentials: true,
        });
        setInvites(res.data.invites); // assuming response shape { invites: [...] }
      } catch (err) {
        setError(err.message || "Error fetching invites");
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  const acceptInvite = async (inviteId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/group/invite/${inviteId}/accept`,
        {},
        { withCredentials: true }
      );
     
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      setError(err.message || "Error accepting invite");
    } finally {
      setLoading(false);
    }
  };

  const declineInvite = async (inviteId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/group/invite/${inviteId}/decline`,
        {},
        { withCredentials: true }
      );
      
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      setError(err.message || "Error declining invite");
    } finally {
      setLoading(false);
    }
  };

  if (loading && invites.length === 0) return <p>Loading invites...</p>;

  return (
    <div>
      <h2>Pending Invites</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {invites.length === 0 && <p>No pending invites</p>}
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            <span>{invite.groupName || "Group Invite"}</span>
            <button onClick={() => acceptInvite(invite.id)} disabled={loading}>
              Accept
            </button>
            <button onClick={() => declineInvite(invite.id)} disabled={loading}>
              Decline
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyNotification;
