import React, { useState, useEffect, useMemo } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
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
  const [backendTotal, setBackendTotal] = useState(null);

  const groupId = 1; // Hardcoded for now

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
    if (!imageFile) return;

    const doOcr = async () => {
      const worker = await createWorker("eng", 1);
      const {
        data: { text },
      } = await worker.recognize(imageFile);
      setOcrResult(text);
      await worker.terminate();
    };

    doOcr();
  }, [imageFile]);

  const parseItemsFromText = (text) => {
    const lines = text.split("\n");
    const skipWords = [
      "total",
      "subtotal",
      "swbtote",
      "tax",
      "cash",
      "tender",
      "change",
      "paid",
      "payment",
      "balance",
      "debit",
      "credit",
    ];

    return lines.reduce((acc, line) => {
      const match = line.match(/(.+?)\s+(\d+\.\d{2})$/);
      if (!match) return acc;

      let name = match[1].trim();
      const price = parseFloat(match[2]);

      if (skipWords.some((word) => new RegExp(`\\b${word}\\b`, "i").test(name)))
        return acc;

      const quantityMatch = name.match(/^\d+\s+(.+)/);
      if (quantityMatch) name = quantityMatch[1];

      acc.push({ name, price });
      return acc;
    }, []);
  };

  const parsedItems = useMemo(() => parseItemsFromText(ocrResult), [ocrResult]);

  useEffect(() => {
    const maxKey = receiptItems.length
      ? Math.max(...receiptItems.map((i) => i.key))
      : -1;
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
      setBackendTotal(null);
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "Other") {
      setIsOther(true);
      setCategory("");
    } else {
      setIsOther(false);
      setCategory(e.target.value);
    }
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
    setCategory(e.target.value);
  };

  const fetchTotal = async (receiptId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/PaypalRoutes/totalPayment/${receiptId}`
      );
      setBackendTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch total:", error);
      setBackendTotal(null);
    }
  };

  const sendToBackend = async () => {
    if (!receiptItems.length) {
      alert("No items to save.");
      return;
    }
  };

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
        Group_Id: groupId,
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
      const savedReceiptId = res.data.receipt?.id;
      if (savedReceiptId) fetchTotal(savedReceiptId);
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
          <input
            type="text"
            value={customCategory}
            onChange={handleCustomCategoryChange}
            placeholder="Enter custom category"
            style={{ marginTop: "0.5rem" }}
          />
        )}
      </div>

      <EditItems items={receiptItems} setItems={setReceiptItems} />

      {backendTotal !== null && (
        <p style={{ marginTop: "1rem" }}>
          <strong>Total from backend: </strong>${backendTotal.toFixed(2)}
        </p>
      )}

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
