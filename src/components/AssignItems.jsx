import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import {
  Box,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function AssignItems() {
  const { groupId, receiptId } = useParams();
  const [items, setItems] = useState([]);
  const [payers, setPayers] = useState([]);
  const [requestSent, setRequestSent] = useState(false);

  const navigate = useNavigate();

  /* 
  Store item-payer assignments like this:
    { itemId: x, payerId: [] }
  */

  const [assignments, setAssignments] = useState([]);

  console.log("ASSIGNMENTS: ", assignments);

  // Check if a specific payer has the item assigned
  const isPayerChecked = (itemId, payerId) =>
    assignments.some((a) => a.itemId === itemId && a.payerId === payerId);

  // Check if all payers have the item assigned
  const isAllChecked = (itemId) =>
    payers.length > 0 &&
    payers.every((p) =>
      assignments.some((a) => a.itemId === itemId && a.payerId === p.id)
    );

  // Assign the passed item to the selected payer
  function handleAssignItem(e, itemId, price, payerId) {
    if (e.target.checked) {
      setAssignments((prev) => [
        ...prev,
        { itemId, itemPrice: price, payerId },
      ]);
    } else {
      setAssignments((prev) =>
        prev.filter((a) => !(a.itemId === itemId && a.payerId === payerId))
      );
    }
  }

  function handleAssignAll(e, itemId, price) {
    setAssignments((prev) => {
      if (e.target.checked) {
        const allAssignments = payers.map((payer) => ({
          itemId,
          itemPrice: price,
          payerId: payer.id,
        }));
        // Remove old assignments for this item first
        const filteredPrev = prev.filter((a) => a.itemId !== itemId);
        return [...filteredPrev, ...allAssignments];
      } else {
        return prev.filter((a) => a.itemId !== itemId);
      }
    });
  }

  // Reformat assignment state for easier calculation
  /* 
    Reformats assignment object to look like this:
    { itemID: x, itemPrice: y, payers: [] }
    */
  function groupAssignments(assignments) {
    const byItem = new Map();
    for (const { itemId, itemPrice, payerId } of assignments) {
      if (!byItem.has(itemId)) {
        byItem.set(itemId, { itemId, itemPrice, payers: [] });
      }
      const entry = byItem.get(itemId);
      if (!entry.payers.includes(payerId)) {
        entry.payers.push(payerId);
      }
    }
    return [...byItem.values()];
  }

  function handleUpdateAssignment() {
    const grouped = groupAssignments(assignments);
    const updatedPayers = calculateTotal(grouped);
    setPayers(updatedPayers);
    toast.dismiss();
    toast.success("Totals Updated!");
  }

  async function handleSendRequest() {
    if (requestSent) return;

    const payments = payers
      .filter((p) => p.total > 0)
      .map((p) => ({ payerId: p.id, amount: p.total }));

    try {
      const res = await axios.post(
        `${API_URL}/api/group/${groupId}/receipts/${receiptId}/send-request`,
        { payments },
        { withCredentials: true }
      );

      toast.dismiss();

      if (res.status === 201) {
        toast.success("Payment requests sent!");
        setRequestSent(true);
        setTimeout(() => navigate(`/groups/${groupId}`), 200);
      }
    } catch (err) {
      toast.dismiss();

      // Detect backend “already sent” error
      if (
        err.response?.status === 400 &&
        err.response?.data?.error?.includes("already been sent")
      ) {
        toast.info("Payment requests have already been sent for this receipt.");
        setRequestSent(true); // lock the UI
      } else {
        toast.error("Failed to send payment requests.");
      }

      console.error(
        "Error sending requests:",
        err.response?.data || err.message
      );
    }
  }

  function calculateTotal(assignments) {
    /**
     * Find the length of the payers in updatedAssignments
     * Divide the item price by length of payers.
     * Loop thru payers, update each payer's "total"  state by the split price.
     */
    console.log("ASSIGNMENTS FROM CALCTOTAL: ", assignments);
    let newPayers = [...payers].map((p) => ({ ...p, total: 0 }));

    console.log("COPY OF PAYERS FROM CALC TOTAL: ", newPayers);
    for (let i = 0; i < assignments.length; i++) {
      console.log("CALCULATING PRICE OF ITEM #:", assignments[i].itemId);

      const thisItemPayers = assignments[i].payers || [];

      const thisItemNumPayers = thisItemPayers.length;
      console.log("NUM PAYERS: ", thisItemNumPayers);
      if (thisItemNumPayers === 0) continue;
      const thisItemSplitPrice = assignments[i].itemPrice / thisItemNumPayers;
      console.log("DIVIDED PRICE: ", thisItemSplitPrice);
      // update each payer's total in the newPayers array
      for (let j = 0; j < thisItemPayers.length; j++) {
        const thisPayerId = thisItemPayers[j];
        console.log("UPDATING TOTAL OF PAYER ID: ", thisPayerId);

        const thisPayer = newPayers.find((payer) => payer.id === thisPayerId);
        if (thisPayer) {
          thisPayer.total += thisItemSplitPrice;
        }
        console.log("OLD PAYER OBJECT: ", thisPayer);

        console.log("UPDATED PAYER OBJECT: ", thisPayer);

        // let newPayers = payers.filter(payer => payer.id !== thisPayerId) // filter out the old payer object
        // newPayers.push(updatePayer); // and add the new one
      }
    }
    setPayers(newPayers);
    return newPayers;
    /*     let total = 0;
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i].payerId === payer) {
        const id = assignments[i].itemId;
        const item = dummyReceipt.find((item) => item.id === id);
        const price = item.price;
        total += price;
      }
    }
    return total; */
    // for (let i = 0; i < receipt.length; i++) {
    //   const item = receipt[i];
    //   const itemPayers = assignments.filter(assignment => assignment.itemId === item.id);
    //   const numItemPayers = itemPayers.length;
    //   const splitPrice = item.price / numItemPayers;
    //   if ( numItemPayers > 1 ) {
    //   }
    // }
    // const counts = assignments.reduce((acc, { itemId }) => {
    //   acc[itemId] = (acc[itemId] || 0) + 1;
    //   return acc;
    // }, {});
    // const repeated = assignments.filter((obj) => counts[obj.itemId] > 1);
    // console.log("REPEATED: ", repeated);
    //   for (let i = 0; i < repeated.length; i++) {
    //     for (let j = 0; j < repeated)
    //     const itemPayers = repeated.filter(repeated => repeated.itemId === item.id);
    //     const numItemPayers = itemPayers.length;
    //     id = repeated[i].payerId;
    //     price = repeated.price;
    //   }
  }

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await axios.get(`${API_URL}/api/group/${groupId}/members`);
        console.log("groupResponse.data:", res.data);

        // Access the members array
        const membersArray = Array.isArray(res.data.members)
          ? res.data.members
          : [];

        const trimmedMembers = membersArray.map(
          ({ id, firstName, lastName }) => ({
            id,
            name: firstName + " " + lastName,
            total: 0,
          })
        );

        setPayers(trimmedMembers);
      } catch (err) {
        console.error("Error fetching group members:", err);
        setPayers([]);
      }
    }

    async function fetchItems() {
      try {
        const res = await axios.get(
          `${API_URL}/api/receipts/${receiptId}/items`
        );
        const items = res.data || [];
        const trimmedItems = items.map(({ id, name, price }) => ({
          id,
          name,
          price,
        }));
        setItems(trimmedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      }
    }

    async function checkIfRequestSent() {
      try {
        const res = await axios.get(
          `${API_URL}/api/group/${groupId}/receipts/${receiptId}/request-status`,
          { withCredentials: true }
        );
        // Suppose the API returns { sent: true/false }
        if (res.data.sent) {
          setRequestSent(true); // disable all interactions
          toast.info(
            "Payment requests have already been sent for this receipt."
          );
        }
      } catch (err) {
        console.error("Error checking request status:", err);
      }
    }

    fetchMembers();
    fetchItems();
    checkIfRequestSent();
  }, [groupId, receiptId]);

  return (
    <Box sx={{ width: "75%", margin: 2 }}>
      <h1>Assign Items</h1>

      <Stack direction={"row"} spacing={4}>
        <Container maxWidth="md">
          <h2>Items: {items.length}</h2>
          <List>
            {items.map((item) => (
              <ListItem key={item.id}>
                <Container sx={{ backgroundColor: "#D3D3D3", padding: 1 }}>
                  <ListItemText
                    sx={{
                      ".MuiListItemText-primary": {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      },
                    }}
                    primary={`${item.name} - $${item.price.toFixed(2)}`}
                  />

                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAllChecked(item.id)}
                          onChange={(e) =>
                            handleAssignAll(e, item.id, item.price)
                          }
                          disabled={requestSent} // disable if request sent
                        />
                      }
                      label="All"
                    />
                    {payers.map((payer) => (
                      <FormControlLabel
                        key={payer.id}
                        control={
                          <Checkbox
                            checked={isPayerChecked(item.id, payer.id)}
                            onChange={(e) =>
                              handleAssignItem(e, item.id, item.price, payer.id)
                            }
                            disabled={requestSent} // disable if request sent
                          />
                        }
                        label={payer.name}
                      />
                    ))}
                  </FormGroup>
                </Container>
              </ListItem>
            ))}
          </List>
        </Container>

        <Container maxWidth="sm">
          <h2>Payers:</h2>
          <List>
            {payers.map((payer) => (
              <ListItem key={payer.id}>
                <ListItemText
                  sx={{
                    ".MuiListItemText-primary": {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    },
                  }}
                  primary={`${payer.name} - Total: $${payer.total.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Stack>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleUpdateAssignment}
            disabled={requestSent} // disable if request sent
          >
            Calculate Totals
          </Button>

          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={requestSent} // disable if request sent
          >
            Send Payment Requests
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
