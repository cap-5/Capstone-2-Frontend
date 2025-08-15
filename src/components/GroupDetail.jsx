import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useParams, useNavigate } from "react-router-dom"; 
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import IconButton from "@mui/material/IconButton";

import { // Modify this later, could look nicer but this is good for now //
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";

function GroupDetail () {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Fetches members of a group by id
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/group/${id}/members`, {
        withCredentials: true
      });
      setMembers(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  // Removes members of a group
  const removeMember = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/group/${id}/members/${userId}`, {
        withCredentials: true 
      });
      setMembers((prev) => prev.filter((m) => m.id !==userId));
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to remove member");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 640, mx: "auto", py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (err) {
    return (
      <Box sx={{ maxWidth: 640, mx: "auto", py: 6, textAlign: "center" }}>
        <Typography color="error">{err}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 3 }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>Members ({members.length})</Typography>
      <List sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
        {members.length === 0 ? (
          <Typography sx={{ px: 2, py: 2 }} color="text.secondary">
            No members yet.
          </Typography>
        ) : (
          members.map((m, idx) => (
            <React.Fragment key={m.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="remove" onClick={() => removeMember(m.id)}>
                    <PersonRemoveIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={m.profilePic || undefined}>
                    {m.username?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={m.username} secondary={m.email} />
              </ListItem>
              {idx < members.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        )}
      </List>

      {/* Add members button */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          startIcon={<PersonAddAltIcon />}
          variant="contained"
          onClick={() => navigate(`/group/${id}/user-search`)}
        >
          Add members
        </Button>
      </Box>
    </Box>
  );
}

export default GroupDetail;