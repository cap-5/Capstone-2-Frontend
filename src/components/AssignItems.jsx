import React, { useState } from "react";

const dummyReceipt = [
  { id: 1, name: "Apples", price: 6.0 },
  { id: 2, name: "Bananas", price: 6.0 },
  { id: 3, name: "Candy", price: 6.0 },
];

const dummyGroup = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bobby" },
  { id: 3, name: "Carl" },
];

export default function AssignItems() {
  const [items, setItems] = useState(dummyReceipt);
  const [payers, setPayers] = useState(dummyGroup);
  /* 
  Store item-payer assignments like this:
    { itemId: x, payerId: y }
  */
  const [assignments, setAssignments] = useState([]);

  console.log("ASSIGNMENTS: ", assignments);

  function handleAssignItem(e, item, payer) {
    if (e.target.checked) {
      setAssignments([...assignments, { itemId: item, payerId: payer }]);
    } else {
      setAssignments(
        assignments.filter(
          (assignment) =>
            assignment.itemId !== item && assignment.payerId !== payer
        )
      );
    }
  }

  function calculateTotal(receipt, payer) {
    /* 
    For each item in the receipt, find the number of payers who have been assigned that item.
    Divide the price of that item by that number.
    Add the divided price to the total of each payer.
    */

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
    for (let i = 0; i < receipt.length; i++) {
      const item = receipt[i];
      const numPayers = assignments.filter(assignment => assignment.itemId === item.id).length;
      const splitPrice = item.price / numPayers;
    }
  }

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
                    onChange={(e) => handleAssignItem(e, item.id, payer.id)}
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
            Total: {calculateTotal(payer.id)}
          </li>
        ))}
      </div>
    </div>
  );
}
