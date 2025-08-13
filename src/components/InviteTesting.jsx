import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";

const [selectedGroupId, setSelectedGroupId] = useState("");
const [userId, setUserId] = useState(null);

useEffect(() => {
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/groups/mine`, {
        withCredentials: true,
      });
      setGroups(response.data.groups);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  fetchGroups();
}, []);

return <div>Invite Testing Component</div>;

export default InviteTesting;