import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared.js";
import { useParams } from "react-router-dom";

let nextKey = 0;

export default function EditItems({ parsedItems, ocrResult }) {
  const [receiptItems, setReceiptItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isOther, setIsOther] = useState(false);

  const predefinedCategories = [
    "Entertainment",
    "Groceries",
    "Clothing",
    "Transportation",
    "Electronics",
    "Restaurants / Dining",
    "Other",
  ];

  const { groupId } = useParams();

  useEffect(() => {
    const newItems = parsedItems.map((item) => ({
      ...item,
      key: nextKey++,
    }));
    setReceiptItems(newItems);
  }, [parsedItems]);

  function handleEditItemName(itemKey, newName) {
    setReceiptItems(
      receiptItems.map((item) =>
        item.key === itemKey ? { ...item, name: newName } : item
      )
    );
  }

  function handleEditItemPrice(itemKey, newPrice) {
    setReceiptItems(
      receiptItems.map((item) =>
        item.key === itemKey
          ? { ...item, price: parseFloat(newPrice) || 0 }
          : item
      )
    );
  }

  const sendToBackend = async () => {
    if (!receiptItems.length) {
      alert("No valid items found in receipt.");
      return;
    }

    const finalCategory = isOther ? customCategory : category;

    if (!finalCategory) {
      alert("Please select or enter a category.");
      return;
    }

    const receiptPayload = {
      receipt: {
        title: "Scanned Receipt",
        body: ocrResult,
        category: finalCategory,
        groupId: groupId ? parseInt(groupId) : null,
      },
      items: receiptItems, 
    };

    try {
      setIsSaving(true);

      const res = axios.post(`${API_URL}/api/receipts`, receiptPayload, {
        withCredentials: true,
      });

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

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected === "Other") {
      setIsOther(true);
      setCategory("");
    } else {
      setIsOther(false);
      setCategory(selected);
    }
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
    setCategory(e.target.value);
  };

  return (
    <div>
      <h2>Edit Items:</h2>
      <ul>
        {receiptItems.map((item) => (
          <li key={item.key}>
            <label>
              Item Name:
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleEditItemName(item.key, e.target.value)}
              />
            </label>
            <label style={{ marginLeft: "1rem" }}>
              Price:
              <input
                type="number"
                step="0.01"
                value={item.price}
                onChange={(e) => handleEditItemPrice(item.key, e.target.value)}
              />
            </label>
          </li>
        ))}
      </ul>

      <div style={{ margin: "1rem 0" }}>
        <label>
          Category:
          <select
            value={isOther ? "Other" : category}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Select a category
            </option>
            {predefinedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isOther && (
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Custom Category:
            <input
              type="text"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              placeholder="Enter your category"
            />
          </label>
        </div>
      )}

      <button
        onClick={sendToBackend}
        disabled={isSaving || !receiptItems.length}
      >
        {isSaving ? "Saving..." : "Save to Database"}
      </button>
    </div>
  );
}
