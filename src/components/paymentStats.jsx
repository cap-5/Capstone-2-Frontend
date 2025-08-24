import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  Box,
  Container,
} from "@mui/material";
import { API_URL } from "../shared";

const RequestedPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/group/RequestedPayments`, {
          withCredentials: true,
        });
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPayments(sorted);
      } catch (err) {
        setSnack({
          open: true,
          message: err.message || "Failed to fetch requested payments",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        Requested Payments
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          No requested payments found.
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
          {payments.map((p) => (
            <Card
              key={p.id}
              sx={{
                flex: "0 0 auto",
                minWidth: { xs: 200, sm: 220, md: 250 },
                maxWidth: { xs: 240, sm: 260, md: 280 },
                borderRadius: 3,
                boxShadow: 3,
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  ${p.amount}
                </Typography>
                <Typography variant="body1">
                  <strong>Receipt:</strong> {p.receipt?.title || "Unknown"}
                </Typography>
                <Typography variant="body1">
                  <strong>Group:</strong> {p.groupInfo?.groupName || "Unknown"}
                </Typography>
                <Typography variant="body1">
                  <strong>Payer:</strong> {p.payer?.username || "Unknown"}
                </Typography>
                <Chip
                  label={p.status.toUpperCase()}
                  size="medium"
                  sx={{ mt: 1, fontWeight: "bold" }}
                />
              </CardContent>
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

export default RequestedPayments;
