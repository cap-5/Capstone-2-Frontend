import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardPayments.css";

import {
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Container,
  Chip,
} from "@mui/material";
import { API_URL } from "../shared";

const DashboardPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
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
    <Container sx={{ py: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
      >
        Pending Payments
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          No pending payments
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            py: 2,
          }}
        >
          {payments.map((payment) => (
            <Card
              key={payment.id}
              className="payment-card"
              sx={{
                flex: "0 0 auto",
                minWidth: { xs: 200, sm: 220, md: 250 },
                maxWidth: { xs: 240, sm: 260, md: 280 },
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  ${payment.amount}
                </Typography>
                <Typography variant="body1">
                  <strong>Group:</strong>{" "}
                  {payment.groupInfo?.groupName || "Unknown"}
                </Typography>
                <Typography variant="body1">
                  <strong>Requester:</strong>{" "}
                  {payment.requester?.username || "Unknown"}
                </Typography>
                <Chip
                  label={
                    payment.status === "awaiting_payment"
                      ? "AWAITING PAYMENT"
                      : "PENDING"
                  }
                  size="medium"
                  sx={{ mt: 1, fontWeight: "bold" }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant={
                    payment.status === "awaiting_payment"
                      ? "outlined"
                      : "contained"
                  }
                  color={
                    payment.status === "awaiting_payment"
                      ? "secondary"
                      : "primary"
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
        </Box>
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
