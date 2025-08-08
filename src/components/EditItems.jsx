import React, { useEffect, useRef } from "react";

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
          return { ...item, price: isNaN(priceFloat) ? 0 : priceFloat };
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
    <div>
      <h2>Edit Items:</h2>
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <label htmlFor={`name-${item.key}`}>Item Name: </label>
            <input
              type="text"
              id={`name-${item.key}`}
              value={item.name}
              onChange={(e) => handleEditItemName(item.key, e.target.value)}
            />

            <label htmlFor={`price-${item.key}`}> Price: </label>
            <input
              type="number"
              id={`price-${item.key}`}
              value={item.price}
              step="0.01"
              onChange={(e) => handleEditItemPrice(item.key, e.target.value)}
            />

            <button type="button" onClick={() => handleDeleteItem(item.key)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={handleAddItem}>
        Add Item
      </button>
    </div>
  );
}

export default EditItems;
