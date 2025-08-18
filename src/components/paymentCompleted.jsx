// src/pages/PaymentComplete.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, CircularProgress, Box, Alert } from "@mui/material";
import { API_URL } from "../shared";

const PaymentComplete = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const orderId = searchParams.get("token") || searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    const capturePayment = async () => {
      if (!orderId || !paymentId) {
        setMessage("Missing payment information.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${API_URL}/api/PaypalRoutes/Payment/${paymentId}/capture`,
          {},
          { withCredentials: true }
        );

        console.log(res.data);
        setMessage("Payment captured successfully! Thank you for your payment.");
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.error || "Failed to capture payment.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [orderId, paymentId]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress />
          <Typography mt={2}>Processing your payment...</Typography>
        </Box>
      ) : (
        <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default PaymentComplete;
