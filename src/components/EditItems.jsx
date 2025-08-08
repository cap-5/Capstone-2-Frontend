import React, { useState, useEffect, useMemo } from "react";
import { createWorker } from "tesseract.js";
import EditItems from "./EditItems.jsx";

function OcrComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [imageFile, setImageFile] = useState(null);

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

        items.push({ name, price });
      }
    }

    return items;
  };

  const parsedItems = useMemo(() => parseItemsFromText(ocrResult), [ocrResult]);

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

      <EditItems parsedItems={parsedItems} ocrResult={ocrResult} />
    </div>
  );
}

export default OcrComponent;
