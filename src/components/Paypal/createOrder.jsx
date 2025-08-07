import axios from "axios";

const createPaypalOrder = async (amount = "10.00") => {
  try {
    
    const response = await axios.post("http://localhost:3000/api/paypal/create-order", {
      amount: amount,
    });

    const data = response.data;

    const approvalLink = data.links.find(link => link.rel === "approve");

    if (approvalLink) {
      console.log("Redirect user to:", approvalLink.href);
      window.location.href = approvalLink.href;
    } else {
      console.error("No approval link found");
    }
  } catch (error) {
    console.error("Error creating PayPal order:", error.response?.data || error.message);
  }
};

export default createPaypalOrder;


