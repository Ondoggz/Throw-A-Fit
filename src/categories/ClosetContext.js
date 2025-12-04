import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const ClosetContext = createContext();
export const useCloset = () => useContext(ClosetContext);

export const ClosetProvider = ({ children }) => {
  const [previewItems, setPreviewItems] = useState([]);
  const [mainPreviewItem, setMainPreviewItem] = useState(null);

  // Add item to preview
  const addItemToPreview = (item, containerWidth = 200, containerHeight = 200) => {
    setMainPreviewItem(item);
    const centerX = (containerWidth - 200) / 2;
    const centerY = (containerHeight - 200) / 2;

    setPreviewItems(prev => [
      ...prev,
      { ...item, x: centerX, y: centerY }
    ]);
  };

  // Remove item from preview
  const removeItemFromPreview = (index) => {
    setPreviewItems(prev => prev.filter((_, i) => i !== index));
  };

  // Update item position
  const updateItemPosition = (index, x, y) => {
    setPreviewItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, x: Math.max(x, 0), y: Math.max(y, 0) } : item
      )
    );
  };

  // Reset closet
  const resetCloset = useCallback(() => {
    setPreviewItems([]);
    setMainPreviewItem(null);
  }, []);

  // Load user items from backend
  const loadUserItems = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/items/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const items = await res.json();

      if (Array.isArray(items)) {
        setPreviewItems(items.map(item => ({ ...item, x: 0, y: 0 })));
        setMainPreviewItem(items[0] || null);
      }
    } catch (err) {
      console.error("Error loading user items:", err);
    }
  }, []);

  // Auto-load user items when token exists
  useEffect(() => {
    loadUserItems();
  }, [loadUserItems]);

  return (
    <ClosetContext.Provider
      value={{
        previewItems,
        mainPreviewItem,
        addItemToPreview,
        removeItemFromPreview,
        updateItemPosition,
        resetCloset,
        loadUserItems,
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
};
