import axios from "axios";

/**
 * Captures a PayPal order after user approval
 * @param {string} orderId - Order ID from PayPal
 */
const captureOrder = async (orderId) => {
  try {
    const res = await axios.post(`/api/paypal/capture-order/${orderId}`);
    console.log("Payment captured successfully:", res.data);
    // Optionally redirect to a success page here
  } catch (err) {
    console.error("Failed to capture order:", err.response?.data || err.message);
  }
};

export default captureOrder;
