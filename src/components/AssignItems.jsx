import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [items, setItems] = useState(dummyReceipt);
  const [payers, setPayers] = useState(dummyGroup);
  /* 
  Store item-payer assignments like this:
    { itemId: x, payerId: [] }
  */
  const [assignments, setAssignments] = useState([]);

  console.log("ASSIGNMENTS: ", assignments);

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
    console.log("COMPRESSED: ", newAssignments);
    calculateTotal(newAssignments);
  }

  function calculateTotal(assignments) {
    /**
     * Find the length of the payers in updatedAssignments
     * Divide the item price by length of payers.
     * Loop thru payers, update each payer's "total"  state by the split price.
     */
    console.log("ASSIGNMENTS FROM CALCTOTAL: ", assignments);
    let newPayers = [...payers]; // make a copy of payers to store updated payer objects
    for (const payer of newPayers) {
      payer.total = 0;
    }
    console.log("COPY OF PAYERS FROM CALC TOTAL: ", newPayers);
    for (let i = 0; i < assignments.length; i++) {
      console.log("CALCULATING PRICE OF ITEM #:", assignments[i].itemId);

      const thisItemPayers = assignments[i].payers;
      const thisItemNumPayers = assignments[i].payers.length;
      console.log("NUM PAYERS: ", thisItemNumPayers);
      const thisItemSplitPrice = assignments[i].itemPrice / thisItemNumPayers;
      console.log("DIVIDED PRICE: ", thisItemSplitPrice);
      // update each payer's total in the newPayers array
      for (let j = 0; j < thisItemPayers.length; j++) {
        const thisPayerId = thisItemPayers[j];
        console.log("UPDATING TOTAL OF PAYER ID: ", thisPayerId);

        const thisPayer = newPayers.find((payer) => payer.id === thisPayerId);
        const oldTotal = thisPayer.total;
        console.log("OLD PAYER OBJECT: ", thisPayer);

        thisPayer.total = oldTotal + thisItemSplitPrice;
        console.log("UPDATED PAYER OBJECT: ", thisPayer);

        // let newPayers = payers.filter(payer => payer.id !== thisPayerId) // filter out the old payer object
        // newPayers.push(updatePayer); // and add the new one
      }
    }
    setPayers(newPayers);

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
        const groupResponse = await axios.get(
          "http://localhost:8080/api/group/1/members"
        );
        const members = groupResponse.data;
        const trimmedMembers = members.map(({ id, firstName }) => ({
          id,
          name: firstName,
          total: 0,
        }));
        console.log("FETCHED GROUP MEMBERS: ", members);
        console.log("TRIMMED: ", trimmedMembers);
        setPayers(trimmedMembers);
      }

      async function fetchItems() {
        const receiptResponse = await axios.get(
          "http://localhost:8080/api/receipts/3/items"
        );
        const items = receiptResponse.data;
        console.log("FETCHED ITEMS: ", items);

        const trimmed = items.map(({ id, name, price }) => ({
          id,
          name,
          price,
        }));
        console.log("TRIMMED ITEMS: ", trimmed);
        setItems(trimmed);
      }

    fetchItems();
    fetchMembers();
    
    
  }, []);

  return (
    <div>
      <h1>Assign Items</h1>

      <div>
        <h2>Items to be Assigned:</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} <br></br>
              <input type="checkbox" name="all"></input>
              <label htmlFor="all">All </label>
              {payers.map((payer) => (
                <span key={payer.id}>
                  <input
                    type="checkbox"
                    name={payer.name}
                    onChange={(e) =>
                      handleAssignItem(e, item.id, item.price, payer.id)
                    }
                  ></input>
                  <label htmlFor={payer.name}>{payer.name + " "}</label>
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Payers:</h2>
        {payers.map((payer) => (
          <li key={payer.id}>
            {payer.name + " "}
            Total: {payer.total}
          </li>
        ))}
      </div>

      <button type="button" onClick={handleUpdateAssignment}>
        Update
      </button>
    </div>
  );
}
