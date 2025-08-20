import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import { toast } from "react-toastify";

import Container from "@mui/material/Container";
import { Box, ListItemButton, ListItemIcon, Stack } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { ListItemText } from "@mui/material";

const dummyReceipt = [
  { id: 1, name: "Apples", price: 6.0 },
  { id: 2, name: "Bananas", price: 6.0 },
  { id: 3, name: "Candy", price: 6.0 },
];

const dummyGroup = [
  { id: 1, name: "Alice", total: 0 },
  { id: 2, name: "Bobby", total: 0 },
  { id: 3, name: "Carl", total: 0 },
];

export default function AssignItems() {
  const { groupId, receiptId } = useParams();

  const [items, setItems] = useState([]);
  const [payers, setPayers] = useState([]);
  /* 
  Store item-payer assignments like this:
    { itemId: x, payerId: [] }
  */
  const [assignments, setAssignments] = useState([]);

  console.log("ASSIGNMENTS: ", assignments);

  const isPayerChecked = (itemId, payerId) =>
    assignments?.some((a) => a.itemId === itemId && a.payerId === payerId) ||
    false;

  const isAllChecked = (itemId) =>
    payers?.length > 0 &&
    payers.every((p) =>
      assignments?.some((a) => a.itemId === itemId && a.payerId === p.id)
    );
  // Assign the passed item to the selected payer
  function handleAssignItem(e, item, price, payer) {
    if (e.target.checked) {
      setAssignments([
        ...assignments,
        { itemId: item, itemPrice: price, payerId: payer },
      ]);
    } else {
      console.log("UNCHECKED ITEM ID: ", item);
      console.log("UNCHECKED PAYER ID: ", payer);
      setAssignments(
        assignments.filter(
          (assignment) =>
            assignment.payerId !== payer || assignment.itemId !== item
        )
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
        const filteredPrev = prev.filter((a) => a.itemId !== itemId);
        return [...filteredPrev, ...allAssignments];
      } else {
        return prev.filter((a) => a.itemId !== itemId);
      }
    });
  }

  // Reformat assignment state for easier calculation
  function groupAssignments(assignments) {
    /* 
    Reformats assignment object to look like this:
    { itemID: x, itemPrice: y, payers: [] }
    */

    console.log("ASSIGNMENTS FROM GROUPASSIGNMENTS: ", assignments);
    const byItem = new Map(); // preserves first-seen order

    for (const { itemId, itemPrice, payerId } of assignments) {
      // normalize to an array
      const payerList = Array.isArray(payerId) ? payerId : [payerId];

      if (!byItem.has(itemId)) {
        byItem.set(itemId, { itemId, itemPrice, payers: [] });
      }

      const entry = byItem.get(itemId);

      // de-dupe while preserving order
      const seen = new Set(entry.payers);
      for (const p of payerList) {
        if (!seen.has(p)) {
          seen.add(p);
          entry.payers.push(p);
        }
      }
      console.log(payerList);
    }

    console.log("FROM GROUPASSIGNMENTS: ", [...byItem.values()]);
    return [...byItem.values()];
  }

  function handleUpdateAssignment() {
    const newAssignments = groupAssignments(assignments);
    const updatedPayers = calculateTotal(newAssignments);
    setPayers(updatedPayers); // now UI updates properly
  }

  async function handleSendRequest() {
    const payments = payers
      .filter((p) => p.total > 0)
      .map((p) => ({
        payerId: p.id,
        amount: p.total,
      }));

    try {
      const res = await axios.post(
        `${API_URL}/api/group/${groupId}/receipts/${receiptId}/send-request`,
        { payments },
        { withCredentials: true }
      );
      console.log("Request sent:", res.data);
      toast.success(" Payment requests sent!");
    } catch (err) {
      console.error(
        "Error sending requests:",
        err.response?.data || err.message
      );

      if (err.response?.status === 400) {
        toast.info(" Requests already sent for this receipt.");
      } else {
        toast.error(" Failed to send payment requests.");
      }
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
    toast.success("Totals Updated!");
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
        const groupResponse = await axios.get(
          `${API_URL}/api/group/${groupId}/members`
        );
        const members = groupResponse.data || []; // default to empty array
        const trimmedMembers = members.map(({ id, firstName, lastName }) => ({
          id,
          name: firstName + " " + lastName,
          total: 0,
        }));
        console.log("FETCHED GROUP MEMBERS: ", members);
        console.log("TRIMMED: ", trimmedMembers);
        setPayers(trimmedMembers);
      } catch (err) {
        console.error("Error fetching group members:", err);
        setPayers([]); // fallback
      }
    }

    async function fetchItems() {
      try {
        const receiptResponse = await axios.get(
          `${API_URL}/api/receipts/${receiptId}/items`
        );
        const items = receiptResponse.data || []; // default to empty array
        const trimmedItems = items.map(({ id, name, price }) => ({
          id,
          name,
          price,
        }));
        console.log("FETCHED ITEMS: ", items);
        console.log("TRIMMED ITEMS: ", trimmedItems);
        setItems(trimmedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]); // fallback
      }
    }

    fetchItems();
    fetchMembers();
  }, [groupId, receiptId]);

  return (
    <Box
      sx={{
        width: 3 / 4,
        margin: 2,
      }}
    >
      <h1>Assign Items</h1>

      <Stack direction={"row"}>
        <Container maxWidth="md">
          <h2>Items: {items.length} </h2>
          <List>
            {items?.map((item) => (
              <ListItem key={item.id}>
                <Container sx={{ backgroundColor: "#D3D3D3" }}>
                  <ListItemText
                    sx={{
                      ".MuiListItemText-primary": {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      },
                    }}
                    primary={item.name + "- $" + item.price}
                  />

                  <FormGroup row={true}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAllChecked(item.id)}
                          onChange={(e) =>
                            handleAssignAll(e, item.id, item.price)
                          }
                        />
                      }
                      label="All"
                    />
                    {payers?.map((payer) => (
                      <Box key={payer.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isPayerChecked(item.id, payer.id)}
                              onChange={(e) =>
                                handleAssignItem(
                                  e,
                                  item.id,
                                  item.price,
                                  payer.id
                                )
                              }
                            />
                          }
                          label={payer.name}
                        />
                      </Box>
                    ))}
                  </FormGroup>
                </Container>
                {/* <ListItemText
                  sx={{ margin: 5 }}
                  primary={item.name + "- $" + item.price}
                />

                <FormGroup row={true}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAllChecked(item.id)}
                        onChange={(e) =>
                          handleAssignAll(e, item.id, item.price)
                        }
                      />
                    }
                    label="All"
                  />
                  {payers?.map((payer) => (
                    <Box key={payer.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isPayerChecked(item.id, payer.id)}
                            onChange={(e) =>
                              handleAssignItem(e, item.id, item.price, payer.id)
                            }
                          />
                        }
                        label={payer.name}
                      />
                    </Box>
                  ))}
                </FormGroup> */}
              </ListItem>
            ))}
          </List>
        </Container>

        {/* <input
              type="checkbox"
              checked={isAllChecked(item.id)}
              onChange={(e) => handleAssignAll(e, item.id, item.price)}
            /> */}
        {/* <label>All</label> */}
        {/* {payers?.map((payer) => (
              <span key={payer.id}>
                <input
                  type="checkbox"
                  checked={isPayerChecked(item.id, payer.id)}
                  onChange={(e) =>
                    handleAssignItem(e, item.id, item.price, payer.id)
                  }
                />
                <label>{payer.name}</label>
              </span>
            ))} */}
        {/* </li>
        ))}
      </ul> */}

        <Container maxWidth="sm">
          <h2>Payers:</h2>
          <List>
            {payers?.map((payer) => (
              <ListItem key={payer.id}>
                <ListItemText
                  sx={{
                    ".MuiListItemText-primary": {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    },
                  }}
                  primary={payer.name + "- Total: $" + payer.total.toFixed(2)}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Stack>

      {/* <h2>Payers:</h2>
      <ul>
        {payers?.map((payer) => (
          <li key={payer.id}>
            {payer.name} - Total: ${payer.total.toFixed(2)}
          </li>
        ))}
      </ul> */}

      {/* <button onClick={handleUpdateAssignment}>Update</button> */}
      {/* <button onClick={handleSendRequest}>Send Payment Requests</button> */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleUpdateAssignment}>
            Calculate Totals
          </Button>

          <Button variant="contained" onClick={handleSendRequest}>
            Send Payment Requests
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
