import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";

// Fetches groups that the logged in user belongs to 
const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroupId, setselectedGroupId] = useState(null);
    const [inviteMessage, setInviteMessage] = useState("");

    const fetchGroups = async () => {
        try {
            const rest = await axios.get(`${API_URL}/api/users/getGroups`, {
                withCredentials: true,
            });
            setGroups(rest.data);
        }   catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    // Fetches users for inviting 
    const fetchUsers = async () => {
        try {
            const rest = await axios.get(`${API_URL}/api/users/Allusers`, {
                withCredentials: true,
            });
            setUsers(rest.data.users || rest.data);
        }   catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleInvite = async () => {
        if (!selectedUser || !selectedGroupId) {
            setInviteMessage("Select a group and user first.");
            return;
        }

        try {
            const rest = await axios.post(`${API_URL})/api/group/invite`, {
                receiverId: selectedUser.id,
                GroupId: selectedGroupId,
            }, {
                withCredentials: true,
            });

            setInviteMessage("Invite sent!");
        }   catch (err) {
            const msg = err?.response?.data?.error || "Invite failed."
            setInviteMessage(msg);
            } 
        }; 

        useEffect(() => {
            fetchGroups();
            fetchUsers();
        }, []); 

    return (
    <div className="groups-page">
      <h1>My Groups</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <strong>{group.groupName}</strong> - {group.description}
          </li>
        ))}
      </ul>

      <h2>Invite Someone to a Group</h2>
      <select onChange={(e) => setSelectedGroupId(e.target.value)}>
        <option value="">Select a group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.groupName}
          </option>
        ))}
      </select>

      <select onChange={(e) => setSelectedUser(JSON.parse(e.target.value))}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={JSON.stringify(user)}>
            {user.username}
          </option>
        ))}
      </select>

      <button onClick={handleInvite}>Send Invite</button>

      {inviteMessage && <p>{inviteMessage}</p>}
    </div>
  );
};

export default Groups; 