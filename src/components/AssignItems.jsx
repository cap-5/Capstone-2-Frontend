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
    { itemID: x, payerId: y }
  Use a set because no payer can be assigned the same item more than once.
  */
  const [assignments, setAssignments] = useState(new Set());

  console.log("ASSIGNMENTS: ", assignments);

  function handleAssignItem(e, item, payer) {
    if (e.target.checked) {
      const newAssignments = new Set(assignments);
      newAssignments.add({itemID: item, payerID: payer});
      setAssignments(newAssignments);
    } else {
      const newAssignments = new Set(assignments);
      newAssignments.delete({ itemID: item, payerID: payer });
      setAssignments(newAssignments);
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
            Total:
          </li>
        ))}
      </div>
    </div>
  );
}
