import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  Card,
  CardContent,
  CardActions,
  Stack,
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
        const res = await axios.get(`${API_URL}/api/group/Payments`, {
          withCredentials: true,
        });
        setPayments(res.data || []);
      } catch (err) {
        setSnack({
          open: true,
          message: err.message || "Failed to load payments",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Accept payment
  const handleAcceptPayment = async (paymentId) => {
    setActionLoadingId(paymentId);
    try {
      const res = await axios.post(
        `${API_URL}/api/PaypalRoutes/Payment/${paymentId}/accept`,
        {},
        { withCredentials: true }
      );

      console.log(res.data);

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
        <Stack spacing={2}>
          {payments.map((payment) => (
            <Card
              key={payment.id}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  ${payment.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {payment.groupInfo?.groupName || "Group"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {payment.status === "awaiting_payment"
                    ? "Waiting for PayPal payment to be completed"
                    : `Requested by: ${payment.requester?.username || "Unknown"}`}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                <Button
                  variant={
                    payment.status === "awaiting_payment" ? "outlined" : "contained"
                  }
                  color={
                    payment.status === "awaiting_payment" ? "secondary" : "primary"
                  }
                  size="small"
                  onClick={() => handleAcceptPayment(payment.id)}
                  disabled={
                    actionLoadingId === payment.id ||
                    payment.status === "awaiting_payment"
                  }
                >
                  {actionLoadingId === payment.id ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : payment.status === "awaiting_payment" ? (
                    "Awaiting Payment"
                  ) : (
                    "Accept"
                  )}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
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
