import React, { useState, useEffect, useMemo } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import EditItems from "./EditItems";
import { API_URL } from "../shared";

import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function OcrComponent() {
  const [ocrResult, setOcrResult] = useState("");
  const [editedBody, setEditedBody] = useState(""); // <-- new state for editable receipt text
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
      setEditedBody(text); // Initialize editedBody with OCR text
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
      "Swtotal",
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

  const parsedItems = useMemo(
    () => parseItemsFromText(editedBody),
    [editedBody]
  ); // parse from editedBody now

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

    try {
      setIsSaving(true);

      // Save receipt + items + totalPay in one request
      const res = await axios.post(
        `${API_URL}/api/receipts/${groupId}/Upload`,
        {
          receipt: {
            title: "Scanned Receipt",
            body: editedBody, // <-- send edited text here
            category: finalCategory,
            Group_Id: groupId,
          },
          items: receiptItems,
        },
        { withCredentials: true }
      );

      alert("Receipt saved!");

      // Get totalPay directly from saved receipt response
      const savedReceipt = res.data.receipt;
      setBackendTotal(savedReceipt.totalPay);
    } catch (err) {
      console.error(err);
      alert("Error saving receipt.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        Receipt OCR Uploader
      </Typography>

      <Button variant="contained" component="label" fullWidth>
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </Button>

      <Typography variant="subtitle1" mt={3} mb={1}>
        OCR Result (editable):
      </Typography>
      <TextField
        multiline
        minRows={6}
        fullWidth
        variant="outlined"
        value={editedBody}
        onChange={(e) => setEditedBody(e.target.value)}
      />

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={isOther ? "Other" : category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="" disabled>
            Select a category
          </MenuItem>
          {predefinedCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isOther && (
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={handleCustomCategoryChange}
          sx={{ mt: 2 }}
        />
      )}

      <Box mt={3}>
        <EditItems items={receiptItems} setItems={setReceiptItems} />
      </Box>

      {backendTotal !== null && (
        <Typography variant="h6" mt={3}>
          Total from backend: ${backendTotal.toFixed(2)}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={sendToBackend}
        disabled={isSaving || !receiptItems.length}
      >
        {isSaving ? "Saving..." : "Save to Database"}
      </Button>
    </Box>
  );
}

export default OcrComponent;
