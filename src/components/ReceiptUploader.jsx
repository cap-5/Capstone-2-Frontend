import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const ReceiptUploader = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);

    try {
      const fileDataBase64 = await toBase64(file);

      const res = await axios.post(`${API_BASE}/veryfiReceipt/upload`, {
        fileName: file.name,
        fileDataBase64: fileDataBase64,
      });

      console.log("Successfully Uploaded", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div>
      <h2>Upload a Receipt</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {result?.error && <div>Error: {result.error}</div>}

      {result && result.line_items?.length > 0 && (
        <div>
          <h3>Receipt Summary</h3>
          {result.line_items.map((item, idx) => (
            <div key={idx}>
              {item.quantity || 1}x {item.description || "Item"} — $
              {item.total || item.amount || 0}
            </div>
          ))}
          <br />
          <div>Total: ${result.total || result.total_amount || "N/A"}</div>
          <div>
            Cash: ${result.cash || result.cash_given || "Not specified"}
          </div>
          <div>Change: ${result.change || "Not specified"}</div>
        </div>
      )}

      {result && !result.line_items?.length && !result.error && (
        <div>
          <h3>No items detected. Raw result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReceiptUploader;
