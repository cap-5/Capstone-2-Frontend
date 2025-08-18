import React, { useState, useEffect, useMemo } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import EditItems from "./EditItems";
import { API_URL } from "../shared";
import { useParams, useNavigate } from "react-router-dom";

// MUI imports for UI components and styling
import {
  Box,
  Button, // Styled clickable button component
  Typography, // Text component with predefined variants (headings, subtitles)
  TextField, // Input field or textarea with styling
  MenuItem, // Individual selectable item inside Select dropdown
  Select, // Styled dropdown select component
  InputLabel, // Label for Select input
  FormControl, // Wrapper for form controls to handle label/input layout/accessibility
} from "@mui/material";

function OcrComponent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [ocrResult, setOcrResult] = useState("");
  const [editedBody, setEditedBody] = useState(""); // Editable OCR text
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [receiptItems, setReceiptItems] = useState([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isOther, setIsOther] = useState(false);
  const [backendTotal, setBackendTotal] = useState(null);

  // const groupId = 3; // Hardcoded for now

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
      // Create a new OCR worker with English language support
      const worker = await createWorker("eng", 1);

      // Run OCR on the uploaded image file to extract text
      const {
        data: { text },
      } = await worker.recognize(imageFile);
      setOcrResult(text);
      setEditedBody(text); // Initialize editable text with OCR output
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
      // Matches lines that end with a price formatted as digits + decimal + two digits (e.g. "15.00")
      const match = line.match(/(.+?)\s+(\d+\.\d{2})$/);

      // If line doesn't match the pattern, skip it and continue
      if (!match) return acc;

      let name = match[1].trim();
      const price = parseFloat(match[2]);

      // Ignore lines containing keywords like "total", "tax" etc.
      if (skipWords.some((word) => new RegExp(`\\b${word}\\b`, "i").test(name)))
        return acc;

      // Remove quantity number from item name, e.g. "2 apples" becomes "apples"
      const quantityMatch = name.match(/^\d+\s+(.+)/);
      if (quantityMatch) name = quantityMatch[1];

      acc.push({ name, price });
      return acc;
    }, []);
  };

  // Uses useMemo to only parse the receipt text when the user edits the text
  const parsedItems = useMemo(
    () => parseItemsFromText(editedBody),
    [editedBody]
  );

  useEffect(() => {
    // Get the current highest key in receiptItems, or -1 if empty
    const maxKey = receiptItems.length
      ? Math.max(...receiptItems.map((i) => i.key))
      : -1;

    // Create a new array 'enriched' by adding unique keys to each parsed item
    const enriched = parsedItems.map((item, idx) => ({
      ...item,
      key: maxKey + 1 + idx, // Assign unique key by incrementing from maxKey
    }));

    // Update receiptItems state with the enriched array containing keys
    setReceiptItems(enriched);
  }, [parsedItems]);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]); // Save the uploaded file in state
      setOcrResult("Recognizing...");
      setBackendTotal(null); // Clear any previous total value
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

    // if other true then custom
    const finalCategory = isOther ? customCategory : category;
    if (!finalCategory) {
      alert("Please select or enter a category.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await axios.post(
        `${API_URL}/api/receipts/${groupId}/Upload`,
        {
          receipt: {
            title: "Scanned Receipt",
            body: editedBody,
            category: finalCategory,
            Group_Id: groupId,
          },
          items: receiptItems,
        },
        { withCredentials: true }
      );

      alert("Receipt saved!");
      navigate(`/groups/${groupId}`); // Good feature maybe?

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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff", // simple white background
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          mx: 2,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper", // default MUI card color
          color: "text.primary",
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
            Total: ${backendTotal.toFixed(2)}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={sendToBackend}
          disabled={isSaving || !receiptItems.length}
        >
          {isSaving ? "Saving..." : "Save to Database"}
        </Button>
      </Box>
    </Box>
  );
}

export default OcrComponent;
