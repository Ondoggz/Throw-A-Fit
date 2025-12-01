import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { useCloset } from "../categories/ClosetContext";
import "./closet.css";

const BASE_API_URL = process.env.REACT_APP_API_URL || "https://throw-a-fit.onrender.com/api";

const ENDPOINT_MAP = {
  Tops: "/items/tops",
  Bottoms: "/items/bottoms",
  Accessories: "/items/accessories",
  Shoes: "/items/shoes",
};

// ────────── DRAGGABLE ITEM ──────────
const DraggablePreviewItem = ({ item, index, onDragStart, onRemove }) => {
  const ref = useRef(null);

  const handleMouseDown = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onDragStart(index, e.clientX - rect.left, e.clientY - rect.top);
  };

  // Right-click to remove
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent browser context menu
    onRemove(index);
  };

  return (
    <img
      ref={ref}
      src={item.imageUrl}
      alt={item.name}
      className="preview-layer-item"
      style={{ top: `${item.y}px`, left: `${item.x}px`, zIndex: index + 10 }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu} // <-- new
      draggable={false}
    />
  );
};


// ────────── ANIMATED LIST ──────────
const AnimatedItem = ({ children, delay = 0, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ cursor: "pointer", flexShrink: 0 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({ items = [], onItemSelect }) => (
  <div className="scroll-list-container horizontal-list-wrapper">
    <div className="scroll-list" style={{ display: "flex", gap: "15px" }}>
      {items.map((item, index) => (
        <AnimatedItem key={item._id || `${item.name}-${index}`} delay={0.05 * index} onClick={() => onItemSelect(item)}>
          <div className="item item-preview-box-animated">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="item-image" /> : <p className="item-text">No image</p>}
          </div>
        </AnimatedItem>
      ))}
    </div>
  </div>
);

// ────────── CLOSET ──────────
export default function Closet() {
  const navigate = useNavigate();
  const { previewItems, mainPreviewItem, addItemToPreview, removeItemFromPreview, updateItemPosition } = useCloset();

  const [clothesData, setClothesData] = useState({ Tops: [], Bottoms: [], Accessories: [], Shoes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const previewRef = useRef(null);
  const draggingRef = useRef({ index: -1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const fetchClothes = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          Object.entries(ENDPOINT_MAP).map(async ([category, endpoint]) => {
            const res = await fetch(`${BASE_API_URL}${endpoint}`);
            if (!res.ok) throw new Error(`Failed to load ${category}`);
            const items = await res.json();
            return items.map(item => ({
              ...item,
              category,
              originalCategory: (item.category || "").toLowerCase(),
            }));
          })
        );
        const grouped = Object.keys(ENDPOINT_MAP).reduce((acc, category, i) => {
          acc[category] = results[i];
          return acc;
        }, {});
        setClothesData(grouped);
      } catch (err) {
        setError(err.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchClothes();
  }, []);

  // ─── DRAG HANDLERS ───
  const handleDragStart = (index, offsetX, offsetY) => {
    draggingRef.current = { index, offsetX, offsetY };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const { index, offsetX, offsetY } = draggingRef.current;
    if (index < 0) return;
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newX = e.clientX - rect.left - offsetX;
    const newY = e.clientY - rect.top - offsetY;
    updateItemPosition(index, newX, newY);
  };

  const handleMouseUp = () => {
    draggingRef.current = { index: -1, offsetX: 0, offsetY: 0 };
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  if (loading) return <div className="closet-page-wrapper loading-state">Loading wardrobe…</div>;
  if (error) return <div className="closet-page-wrapper error-state">Warning: {error}</div>;

  return (
    <div className="closet-page-wrapper">
      {/* HEADER */}
      <div className="closet-header">
        <div className="closet-title-area">
          <FaUserCircle className="account-icon" size={24} onClick={() => navigate("/profile")} />
          <h2>Closet</h2>
        </div>
        <button className="close-btn" onClick={() => navigate("/")}>×</button>
      </div>

      {/* MAIN PREVIEW */}
      <div className="upgraded-preview" ref={previewRef}>
        {previewItems.length > 0 ? (
          previewItems.map((item, i) => (
            <DraggablePreviewItem key={item._id || `${item.name}-${i}`} item={item} index={i} onDragStart={handleDragStart} onRemove={removeItemFromPreview} />
          ))
        ) : mainPreviewItem?.imageUrl ? (
          <img src={mainPreviewItem.imageUrl} alt={mainPreviewItem.name} className="main-preview-image" />
        ) : (
          <p className="preview-text">Click an item below to preview it.</p>
        )}
      </div>

      {/* CATEGORIES */}
      {Object.keys(clothesData).map(category => {
        const filteredItems = (clothesData[category] || []).filter(item => item.originalCategory === category.toLowerCase());
        return (
          <div key={category} className="category-row-wrapper">
            <div className="category-header-and-button">
              <h3 className="category-name">{category}</h3>
              {filteredItems.length > 0 && (
                <button className="more-btn" onClick={() => navigate(`/items/${category.toLowerCase()}`)}>More »</button>
              )}
            </div>
            <div className="animated-list-container">
              <AnimatedList
                items={filteredItems}
                onItemSelect={(item) => addItemToPreview(item, previewRef.current?.offsetWidth, previewRef.current?.offsetHeight)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
