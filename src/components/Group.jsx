import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom"; 
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { // Modify this later, could look nicer but this is good for now //
  Box,
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

// No comment, self explanatory 
const initialCreateState = {groupName: "", description: ""};

// This creates the default avatar background. Temporary for now. Add your own in the future
const groupAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 60% 45%)`;
}

// Groups list. A lot features and combining to do still so will be changing
function Groups () {
    const navigate = useNavigate() // Still need to update this, not done yet
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(initialCreateState);

    // This fetches the groups for the signed in user
    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/group/myGroups`, {
                withCredentials: true,
            });
            setGroups(res.data);
        }   catch (err) {
            console.error("Error fetching groups:", err);
        }   finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      fetchGroups();
    }, []);  

    // This is for when you first create a group. Maybe change later
    const openCreate = () => {
      setForm(initialCreateState);
      setCreateOpen(true);
    };

    // Backend, updates the local list.
    const handleCreate = async () => {
      if (!form.groupName.trim()) {
        return;
      }

      try {
        setCreating(true);
        const res = await axios.post(`${API_URL}/api/group/create`, {
          groupName: form.groupName.trim(),
          description: form.description.trim() }, {
          withCredentials: true }
        );

        setGroups((prev) => [res.data.group, ...prev]);
        setCreateOpen(false);
      } catch (err) {
        console.error("Create group error", err);
      } finally {
        setCreating(false);
      }
    };

    const goToGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

    const deleteGroup = async (groupId) => {
      try {
        const res = await axios.delete(`${API_URL}/api/group/delete/${groupId}`, {
          withCredentials: true 
        });
        toast.success("Group deleted successfully!");
      
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
      } catch (err) {
        console.error("Delete group error", err);
        toast.error(err?.response?.data?.error || "Could not delete group.");
      }
    };


    //  | CSS Stuff Below Here || \\
    const EmptyState = () => (
    <Box
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        You do not have any groups yet
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        maxWidth: 640,
        mx: "auto",
        px: 2,
        py: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Groups
      </Typography>

      {/* Toast notifications (Move this later somewhere else eventually) */}
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

      {/* Group List */}
      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : groups.length === 0 ? (
          <EmptyState />
        ) : (
          <List disablePadding>
            {groups.map((g, idx) => {
              const title = g.groupName || "Untitled Group";
              const subtitle = g.expenseSummary ?? "No expenses"; 
              const initials =
                title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?";

              return (
                <React.Fragment key={g.id}>
                  <ListItemButton
                    onClick={() => goToGroup(g.id)}
                    sx={{
                      py: 1.5,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: groupAvatarColor(title) }}>{initials}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={title}
                      secondary={subtitle}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete group"
                      onClick={(e) => {
                        e.stopPropagation(); // Move the line below to the actual function
                        if (window.confirm("Are you sure you want to delete this group?")) {
                          deleteGroup(g.id);
                        }
                      }}
                    >
                    <DeleteOutlineIcon />
                  </IconButton>
                  </ListItemButton>
                  {idx < groups.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Start a new group button */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<GroupAddIcon />}
          onClick={openCreate}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Start a new group
        </Button>
      </Box>

      {/* Create Group */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create a new group</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Group name"
            value={form.groupName}
            onChange={(e) => setForm((f) => ({ ...f, groupName: e.target.value }))}
            autoFocus
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={creating}>
            {creating ? "Creating..." : "Create group"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Groups;
