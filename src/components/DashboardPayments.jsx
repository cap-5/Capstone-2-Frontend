import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  List,
  ListItem,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { API_URL } from "../shared";

const DashboardPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/group/Payments`, { withCredentials: true });
        setPayments(res.data || []);
      } catch (err) {
        setSnack({ open: true, message: err.message || "Failed to load payments", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Accept payment: send PayPal request
  const handleAcceptPayment = async (paymentId) => {
    setActionLoadingId(paymentId);
    try {
      const res = await axios.post(
        `${API_URL}/api/PaypalRoutes/Payment/${paymentId}/accept`,
        {},
        { withCredentials: true }
      );

      console.log(res.data);

      // Update local payment status to awaiting_payment
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, status: "awaiting_payment" } : p
        )
      );

      setSnack({
        open: true,
        message: "Payment request sent! Payer can now pay via PayPal.",
        severity: "success",
      });
    } catch (err) {
      setSnack({
        open: true,
        message: err.message || "Failed to send payment request",
        severity: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Pending Payments
      </Typography>

      {loading && payments.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography color="text.secondary">No pending payments</Typography>
      ) : (
        <List>
          {payments.map((payment) => (
            <ListItem
              key={payment.id}
              sx={{
                mb: 2,
                p: 2,
                boxShadow: 2,
                borderRadius: 2,
                bgcolor: "#fafafa",
                flexDirection: "column",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)", bgcolor: "#f0f0f0" },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    ${payment.amount} - {payment.groupInfo?.groupName || "Group"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payment.status === "awaiting_payment"
                      ? "Waiting for payer to complete PayPal payment"
                      : `Requested by: ${payment.requester?.username || "Unknown"}`}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAcceptPayment(payment.id)}
                  disabled={actionLoadingId === payment.id || payment.status === "awaiting_payment"}
                  sx={{ minWidth: 120, position: "relative" }}
                >
                  {actionLoadingId === payment.id ? (
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
                  ) : payment.status === "awaiting_payment" ? (
                    "Awaiting Payment"
                  ) : (
                    "Accept"
                  )}
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

export default DashboardPayments;
