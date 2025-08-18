import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useParams, useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import IconButton from "@mui/material/IconButton";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import { Stack } from "@mui/material";

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
} from "@mui/material";

function GroupDetail () {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [members, setMembers] = useState([]);
  const [leaving, setLeaving] = useState(false);
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

  // Change notification so it shows you cannot leave during that page.
  const handleLeave = async () => {
    const ok = window.confirm("Leave this group?");
    if (!ok) return;
  
    try {
      setLeaving(true);
      await axios.post(`${API_URL}/api/group/${id}/leave`, {},
      { withCredentials: true });
      toast ? toast.success("You left the group") : alert("You left the group");
      navigate("/group");
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to leave group.";
      toast ? toast.error(msg) : alert(msg);
    } finally {
      setLeaving(false);
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

  <ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

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
     
      {/* Add members + Leave group buttons */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<DocumentScannerIcon />}
            variant="outlined"
            onClick={() => navigate(`/upload/${id}`)}
          >
            Scan receipt
          </Button>
          
          
          <Button
            startIcon={<PersonAddAltIcon />}
            variant="contained"
            onClick={() => navigate(`/group/${id}/user-search`)} 
          >
            Add members
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleLeave}
            disabled={leaving}
          >
            {leaving ? "Leaving..." : "Leave group"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default GroupDetail;