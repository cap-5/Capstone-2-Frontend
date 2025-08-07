import React, { useState, useEffect, useMemo } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import { useParams } from "react-router-dom";

function OcrComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [imageFile, setImageFile] = useState(null);
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

        const normalized = name.toLowerCase().replace(/[^a-z]/g, "");
        if (skipWords.some((word) => normalized.includes(word))) continue;

        const quantityMatch = name.match(/^\d+\s+(.+)/);
        if (quantityMatch) {
          name = quantityMatch[1];
        }

        // classify item type
        let type = "product";
        if (/cash|payment|visa|mastercard|credit|debit/i.test(name)) {
          type = "payment";
        } else if (/change|balance/i.test(name)) {
          type = "change";
        }

        items.push({ name, price, type });
      }
    }

    return items;
  };

  const parsedItems = useMemo(() => parseItemsFromText(ocrResult), [ocrResult]);

  const sendToBackend = async () => {
    if (!parsedItems.length) {
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
      },
      items: parsedItems,
    };

    try {
      setIsSaving(true);

      const res = await axios.post(
        `http://localhost:8080/api/receipts`,
        receiptPayload,
        { withCredentials: true }
      );

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

      <h4>Parsed Items:</h4>
      {parsedItems.length > 0 ? (
        <ul>
          {parsedItems.map((item, i) => (
            <li key={i}>
              {item.name} - ${item.price.toFixed(2)}
            </li> //beef solution
          ))}
        </ul>
      ) : (
        <p>No items detected.</p>
      )}

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
        disabled={isSaving || !parsedItems.length}
      >
        {isSaving ? "Saving..." : "Save to Database"}
      </button>
    </div>
  );
}

export default OcrComponent;
