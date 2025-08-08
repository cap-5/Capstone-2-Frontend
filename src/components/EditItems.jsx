import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared.js";

// const initialData = [
//   { id: 1, name: "Ttemt", price: 10.0 },
//   { id: 2, name: "Item 2", price: 20.0 },
//   { id: 3, name: "Item 3", price: 30.0 },
// ];

let nextKey = 0;

export default function EditItems({ parsedItems, ocrResult }) {
  const [receiptItems, setReceiptItems] = useState(parsedItems);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const newItems = parsedItems.map((item) => ({
      ...item,
      key: nextKey++,
    }));
    setReceiptItems(newItems);
  }, [parsedItems]);

  function handleEditItemName(itemKey, newName) {
    setReceiptItems(
      receiptItems.map((item) => {
        if (item.key === itemKey) {
          return { ...item, name: newName };
        } else {
          return item;
        }
      })
    );
  }

  function handleEditItemPrice(itemKey, newPrice) {
    setReceiptItems(
      receiptItems.map((item) => {
        if (item.key === itemKey) {
          return { ...item, price: newPrice };
        } else {
          return item;
        }
      })
    );
  }

  function handleDeleteItem(itemKey) {
    setReceiptItems(receiptItems.filter((item) => item.key !== itemKey));
  }

  function handleAddItem() {
    setReceiptItems([...receiptItems, { key: nextKey++, name: "", price: 0 }]);
  }

  const sendToBackend = async () => {
    if (!parsedItems.length) {
      alert("No valid items found in receipt.");
      return;
    }

    const receiptPayload = {
      receipt: {
        title: "Scanned Receipt",
        body: ocrResult,
        User_Id: 1, // Replace with actual user ID
        Group_Id: null,
      },
      items: receiptItems,
    };

    try {
      setIsSaving(true);
      const res = await axios.post(`${API_URL}/api/receipts`, receiptPayload);
      alert("Receipt saved successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(
        "Save error:",
        err.response ? err.response.data : err.message
      );
      alert("Error saving receipt.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>Edit Items:</h2>
      <ul>
        {console.log("RECEIPT ITEMS: ", receiptItems)}
        {receiptItems.map((item) => (
          <li key={item.key}>
            <label htmlFor="name">Item Name: </label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={(e) => {
                handleEditItemName(item.key, e.target.value);
              }}
            />

            <label htmlFor="price">Price: </label>
            <input
              type="number"
              name="price"
              value={item.price}
              step="0.01"
              onChange={(e) => {
                handleEditItemPrice(item.key, e.target.value);
              }}
            />

            <button type="button" onClick={() => handleDeleteItem(item.key)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={handleAddItem}>
        Add Item
      </button>

      <button
        onClick={sendToBackend}
        disabled={isSaving || !parsedItems.length}
      >
        {isSaving ? "Saving..." : "Save to Database"}
      </button>
    </div>
  );
}
