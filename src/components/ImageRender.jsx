import React, { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import { API_URL } from "../shared.js";
import EditItems from "./EditItems.jsx";
import { parse } from "dotenv";

let nextKey = 0; 

function OcrComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const doOcr = async () => {
      if (imageFile) {
        const worker = await createWorker("eng", 1, {
          logger: (m) => console.log(m),
        });
        const {
          data: { text },
        } = await worker.recognize(imageFile);
        setOcrResult(text);
        await worker.terminate();
      }
    };
    doOcr();
  }, [imageFile]);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setOcrResult("Recognizing...");
    }
  };

  // Improved parser with fuzzy filter to skip subtotal/total lines with OCR noise
  const parseItemsFromText = (text) => {
    const lines = text.split("\n");
    const items = [];

    // Words to skip, include common OCR typos for subtotal/total etc.
    const skipWords = [
      "total",
      "subtotal",
      "tax",
      "swbtotel",
      "swbtota",
      "swbtote",
    ];

    for (const line of lines) {
      const match = line.match(/(.+?)\s+(\d+\.\d{2})$/);
      if (match) {
        let name = match[1].trim();
        const price = parseFloat(match[2]);

        // Normalize name for fuzzy matching (lowercase + letters only)
        const normalized = name.toLowerCase().replace(/[^a-z]/g, "");

        // Skip lines if normalized name contains any skipWords
        if (skipWords.some((word) => normalized.includes(word))) continue;

        // Remove leading quantity if present (e.g., "1 chicken" → "chicken")
        const quantityMatch = name.match(/^\d+\s+(.+)/);
        if (quantityMatch) {
          name = quantityMatch[1];
        }

        items.push({ name, price });
      }
    }

    return items;
  };

  let parsedItems = parseItemsFromText(ocrResult);
  // assign a key to each element in parsedItems
  // parsedItems = parsedItems.map(item => ({
  //   ...item,
  //     key: nextKey++
  // }));

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
      items: parsedItems,
    };

    try {
      setIsSaving(true);
      const res = await axios.post(`${API_URL}/api/receipts`, receiptPayload);
      alert("Receipt saved successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(
        "Save error:",
        err.response ? err.response.data : err.message,
      );
      alert("Error saving receipt.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
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

      <h4>Parsed Items:</h4>
      {parsedItems.length > 0 ? (
        <ul>
          {parsedItems.map((item, i) => (
            <li key={i}>
              {item.name} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items detected.</p>
      )}

      <EditItems parsedItems={parsedItems}/>

      <button
        onClick={sendToBackend}
        disabled={isSaving || !parsedItems.length}
      >
        {isSaving ? "Saving..." : "Save to Database"}
      </button>
    </div>
  );
}

export default OcrComponent;
