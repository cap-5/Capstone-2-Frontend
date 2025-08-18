import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";

import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Container,
} from "@mui/material";

import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [receipts, setReceipts] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [err, setErr] = useState("");

  // Fetch group members
  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await axios.get(`${API_URL}/api/group/${id}/members`, {
        withCredentials: true,
      });
      setMembers(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch receipts
  const fetchReceipts = async () => {
    try {
      setLoadingReceipts(true);
      const res = await axios.get(`${API_URL}/api/group/GroupReceipts/${id}`);
      setReceipts(res.data || []);
    } catch (e) {
      console.error("Error fetching receipts", e);
    } finally {
      setLoadingReceipts(false);
    }
  };

  // Fetch group name
  const fetchGroupName = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/group/myGroups/${id}`);
      setGroupName(res.data.groupName || "Unnamed Group");
    } catch (e) {
      console.error("Failed to fetch group name", e);
    }
  };

  // Remove a member
  const removeMember = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/group/${id}/members/${userId}`, {
        withCredentials: true,
      });
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to remove member");
    }
  };

  // Leave group
  const handleLeave = async () => {
    const confirm = window.confirm("Are you sure you want to leave this group?");
    if (!confirm) return;

    try {
      setLeaving(true);
      await axios.post(`${API_URL}/api/group/${id}/leave`, {}, { withCredentials: true });
      toast.success("You left the group");
      navigate("/group");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to leave group");
    } finally {
      setLeaving(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchReceipts();
    fetchGroupName();
  }, [id]);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Group: {groupName}
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Group Tabs">
        <Tab label="Members" />
        <Tab label="Receipts" />
      </Tabs>

      {/* Action Buttons */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<DocumentScannerIcon />}
            variant="outlined"
            onClick={() => navigate(`/upload/${id}`)}
          >
            Scan Receipt
          </Button>
          <Button
            startIcon={<PersonAddAltIcon />}
            variant="contained"
            onClick={() => navigate(`/group/${id}/user-search`)}
          >
            Add Members
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLeave}
            disabled={leaving}
          >
            {leaving ? "Leaving..." : "Leave Group"}
          </Button>
        </Stack>
      </Box>

      {/* === Members Tab === */}
      {tabIndex === 0 && (
        <Box sx={{ mt: 3 }}>
          {loadingMembers ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : err ? (
            <Typography color="error">{err}</Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Members ({members.length})
              </Typography>

              <List
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {members.length === 0 ? (
                  <Typography sx={{ px: 2, py: 2 }} color="text.secondary">
                    No members yet.
                  </Typography>
                ) : (
                  members.map((m, idx) => (
                    <React.Fragment key={m.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="remove"
                            onClick={() => removeMember(m.id)}
                          >
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
            </>
          )}
        </Box>
      )}

      {/* === Receipts Tab === */}
      {tabIndex === 1 && (
        <Box sx={{ mt: 3 }}>
          {loadingReceipts ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Body
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Category
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Created At
                    </TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow
                      key={receipt.id}
                      onClick={() => navigate(`/assign/${id}/${receipt.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/assign/${id}/${receipt.id}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <TableCell>{receipt.title}</TableCell>
                      <TableCell align="right">{receipt.body?.substring(0, 50)}</TableCell>
                      <TableCell align="right">{receipt.category || "No category"}</TableCell>
                      <TableCell align="right">${receipt.totalPay || 0}</TableCell>
                      <TableCell align="right">{receipt.createdAt?.substring(0, 10)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}

export default GroupDetailPage;
