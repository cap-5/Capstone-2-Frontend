import React, { useState, useEffect, useMemo } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import EditItems from "./EditItems";
import { API_URL } from "../shared";

function OcrComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [receiptItems, setReceiptItems] = useState([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isOther, setIsOther] = useState(false);

  // const { groupId } = useParams();
  const groupId = 1;

  const predefinedCategories = [
    "Entertainment",
    "Groceries",
    "Clothing",
    "Transportation",
    "Electronics",
    "Restaurants / Dining",
    "Other",
  ];

  useEffect(() => {
    const doOcr = async () => {
      if (imageFile) {
        const worker = await createWorker("eng", 1);
        const {
          data: { text },
        } = await worker.recognize(imageFile);
        setOcrResult(text);
        await worker.terminate();
      }
    };
    doOcr();
  }, [imageFile]);

  const parseItemsFromText = (text) => {
    const lines = text.split("\n");
    const items = [];
    const skipWords = [
      "total",
      "subtotal",
      "tax",
      "swbtotel",
      "swbtota",
      "swbtote",
      "cash",
      "tender",
      "change",
      "paid",
      "payment",
      "balance",
      "debit",
      "credit",
    ];

    for (const line of lines) {
      const match = line.match(/(.+?)\s+(\d+\.\d{2})$/);
      if (match) {
        let name = match[1].trim();
        const price = parseFloat(match[2]);

        if (
          skipWords.some((word) => new RegExp(`\\b${word}\\b`, "i").test(name))
        )
          continue;

        if (skipWords.includes(name.toLowerCase())) continue;

        const quantityMatch = name.match(/^\d+\s+(.+)/);
        if (quantityMatch) name = quantityMatch[1];

        items.push({ name, price });
      }
    }
    return items;
  };

  const parsedItems = useMemo(() => parseItemsFromText(ocrResult), [ocrResult]);

  // update editable state when parsedItems change
  useEffect(() => {
    // Find max existing key in receiptItems
    const maxKey = receiptItems.length
      ? Math.max(...receiptItems.map((item) => item.key))
      : -1;

    // Assign keys to parsedItems starting after maxKey
    const enriched = parsedItems.map((item, idx) => ({
      ...item,
      key: maxKey + 1 + idx,
    }));

    setReceiptItems(enriched);
  }, [parsedItems]);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setOcrResult("Recognizing...");
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

  const sendToBackend = async () => {
    if (!receiptItems.length) {
      alert("No items to save.");
      return;
    }

    const finalCategory = isOther ? customCategory : category;
    if (!finalCategory) {
      alert("Please select or enter a category.");
      return;
    }

    const payload = {
      receipt: {
        title: "Scanned Receipt",
        body: ocrResult,
        category: finalCategory,
        Group_Id: groupId || null,
      },
      items: receiptItems,
    };

    try {
      setIsSaving(true);
      const res = await axios.post(
        `${API_URL}/api/receipts/${groupId}/Upload`,
        payload,
        {
          withCredentials: true,
        }
      );
      alert("Receipt saved!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error saving receipt.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Receipt OCR Uploader</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br />
      <br />

      <p>
        <strong>OCR Result:</strong>
      </p>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {ocrResult}
      </pre>

      <div style={{ marginTop: "1rem" }}>
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
        {isOther && (
          <div>
            <input
              type="text"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              placeholder="Enter custom category"
            />
          </div>
        )}
      </div>

      <EditItems items={receiptItems} setItems={setReceiptItems} />

      <button
        onClick={sendToBackend}
        disabled={isSaving || !receiptItems.length}
        style={{ marginTop: "1rem" }}
      >
        {isSaving ? "Saving..." : "Save to Database"}
      </button>
    </div>
  );
}

export default OcrComponent;
