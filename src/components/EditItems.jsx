import React, { useEffect, useRef } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function EditItems({ items, setItems }) {
  // const initialData = [
  //   { id: 1, name: "Ttemt", price: 10.0 },
  //   { id: 2, name: "Item 2", price: 20.0 },
  //   { id: 3, name: "Item 3", price: 30.0 },
  // ];

  const nextKey = useRef(0);

  useEffect(() => {
    if (items.length) {
      const maxKey = Math.max(...items.map((item) => item.key));
      nextKey.current = maxKey + 1;
    } else {
      nextKey.current = 0;
    }
  }, [items]);

  const handleEditItemName = (itemKey, newName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.key === itemKey) {
          return { ...item, name: newName };
        } else {
          return item;
        }
      })
    );
  };

  const handleEditItemPrice = (itemKey, newPrice) => {
    const priceFloat = parseFloat(newPrice);
    setItems((prev) =>
      prev.map((item) => {
        if (item.key === itemKey) {
          return { ...item, price: isNaN(priceFloat) ? "" : priceFloat };
        } else {
          return item;
        }
      })
    );
  };

  const handleDeleteItem = (itemKey) => {
    setItems((prev) => prev.filter((item) => item.key !== itemKey));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { key: nextKey.current++, name: "", price: 0 },
    ]);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Edit Items:
      </Typography>

      <Stack spacing={2}>
        {items.map((item) => (
          <Stack
            key={item.key}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ borderBottom: "1px solid #ddd", pb: 1 }}
          >
            <TextField
              label="Item Name"
              value={item.name}
              onChange={(e) => handleEditItemName(item.key, e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
            />

            <TextField
              label="Price"
              type="number"
              value={item.price}
              onChange={(e) => handleEditItemPrice(item.key, e.target.value)}
              size="small"
              sx={{ width: 100 }}
            />

            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleDeleteItem(item.key)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button
        variant="contained"
        onClick={handleAddItem}
        sx={{ mt: 3 }}
        fullWidth
      >
        Add Item
      </Button>
    </Box>
  );
}

export default EditItems;
