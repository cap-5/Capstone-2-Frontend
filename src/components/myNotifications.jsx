import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Snackbar,
  Container,
  Box,
} from "@mui/material";
import { API_URL } from "../shared";

const MyNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invites, setInvites] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [actionLoadingId, setActionLoadingId] = useState(null); // loading per invite button

  useEffect(() => {
    const fetchInvites = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/api/group/invites`, {
          withCredentials: true,
        });
        setInvites(res.data || []);
      } catch (err) {
        setError(err.message || "Error fetching invites");
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  const acceptInvite = async (inviteId) => {
    setActionLoadingId(inviteId);
    setError(null);
    try {
      await axios.post(
        `${API_URL}/api/group/invite/${inviteId}/accept`,
        {},
        { withCredentials: true }
      );
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      setSnack({ open: true, message: "Invite accepted!", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: err.message || "Error accepting invite", severity: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const declineInvite = async (inviteId) => {
    setActionLoadingId(inviteId);
    setError(null);
    try {
      await axios.post(
        `${API_URL}/api/group/invite/${inviteId}/decline`,
        {},
        { withCredentials: true }
      );
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      setSnack({ open: true, message: "Invite declined!", severity: "info" });
    } catch (err) {
      setSnack({ open: true, message: err.message || "Error declining invite", severity: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Pending Invites
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && invites.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : invites.length === 0 ? (
        <Typography color="text.secondary">No pending invites</Typography>
      ) : (
        <List>
          {invites.map((invite) => (
            <ListItem
              key={invite.id}
              sx={{
                mb: 2,
                p: 2,
                boxShadow: 2,
                borderRadius: 2,
                bgcolor: "#fafafa",
                flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.02)",
                  bgcolor: "#f0f0f0",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {invite.group?.groupName || "Group Invite"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {invite.group?.description}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => acceptInvite(invite.id)}
                  disabled={actionLoadingId === invite.id}
                  sx={{ mr: 1, minWidth: 100, position: "relative" }}
                >
                  {actionLoadingId === invite.id ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ) : (
                    "Accept"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => declineInvite(invite.id)}
                  disabled={actionLoadingId === invite.id}
                  sx={{ minWidth: 100 }}
                >
                  Decline
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyNotification;
