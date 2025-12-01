import React, { createContext, useContext, useState } from "react";

const ClosetContext = createContext();

export const useCloset = () => useContext(ClosetContext);

export const ClosetProvider = ({ children }) => {
  const [previewItems, setPreviewItems] = useState([]);
  const [mainPreviewItem, setMainPreviewItem] = useState(null);

  // Add item to preview stack
  const addItemToPreview = (item, containerWidth = 200, containerHeight = 200) => {
    setMainPreviewItem(item);
    const centerX = (containerWidth - 200) / 2;
    const centerY = (containerHeight - 200) / 2;

    setPreviewItems(prev => [
      ...prev,
      { ...item, x: centerX, y: centerY }
    ]);
  };

  // Remove item from preview stack
  const removeItemFromPreview = (index) => {
    setPreviewItems(prev => prev.filter((_, i) => i !== index));
  };

  // Update position for dragging
  const updateItemPosition = (index, x, y) => {
    setPreviewItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, x: Math.max(x, 0), y: Math.max(y, 0) } : item
      )
    );
  };

  return (
    <ClosetContext.Provider
      value={{
        previewItems,
        mainPreviewItem,
        addItemToPreview,
        removeItemFromPreview,
        updateItemPosition,
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
};
