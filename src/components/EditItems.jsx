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

  function handleOnChange(e) {
    const { name, value } = e.target;
    setReceiptItems((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div>
      <h2>Edit Items:</h2>
      <ul>
        {receiptItems.map((item) => (
          <li key={item.id}>
            <label for="name">Item Name: </label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleOnChange}
            />
            <label for="price">Price: </label>
            <input
              type="number"
              name="price"
              value={item.price}
              step="0.01"
              onChange={handleOnChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
