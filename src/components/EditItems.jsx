import React, { useEffect, useState } from "react";
// import parseReceipt from "../parseReceipt";

// const initialData = [
//   { id: 1, name: "Ttemt", price: 10.0 },
//   { id: 2, name: "Item 2", price: 20.0 },
//   { id: 3, name: "Item 3", price: 30.0 },
// ];

export default function EditItems({ parsedItems }) {
  const [receiptItems, setReceiptItems] = useState(parsedItems);

  useEffect(() => {
    setReceiptItems(parsedItems);
  }, [parsedItems]);

  function handleEditItemName(itemId, newName) {
    setReceiptItems(
      receiptItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, name: newName };
        } else {
          return item;
        }
      }),
    );
  }

  function handleEditItemPrice(itemId, newPrice) {
    setReceiptItems(
      receiptItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, price: newPrice };
        } else {
          return item;
        }
      }),
    );
  }

  return (
    <div>
      <h2>Edit Items:</h2>
      <ul>
        {console.log("RECEIPT ITEMS: ", receiptItems)}
        {receiptItems.map((item) => (
          <li key={item.id}>
            <label for="name">Item Name: </label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={(e) => {
                handleEditItemName(item.id, e.target.value);
              }}
            />
            <label for="price">Price: </label>
            <input
              type="number"
              name="price"
              value={item.price}
              step="0.01"
              onChange={(e) => {
                handleEditItemPrice(item.id, e.target.value);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
