
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import './closet.css';

const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ENDPOINT_MAP = {
    Tops: '/items/tops',
    Bottoms: '/items/bottoms',
    Accessories: '/items/accessories',
    Shoes: '/items/shoes',
};

const initialDataStructure = {
    Tops: [],
    Bottoms: [],
    Accessories: [],
    Shoes: [],
};

// DRAGGABLE PREVIEW ITEM COMPONENT
const DraggablePreviewItem = ({ item, index, onDragStart, onRemove }) => {
    const ref = useRef(null);

    const handleMouseDown = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        onDragStart(index, offsetX, offsetY);
    };

    return (
        <img
            ref={ref}
            src={item.imageUrl}
            alt={item.name}
            className="preview-layer-item"
            style={{ top: `${item.y}px`, left: `${item.x}px`, zIndex: index + 10 }}
            onMouseDown={handleMouseDown}
            onDoubleClick={() => onRemove(index)}
            draggable={false}
        />
    );
};

// ANIMATED ITEM & LIST
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

const AnimatedList = ({ items = [], onItemSelect }) => {
    return (
        <div className="scroll-list-container horizontal-list-wrapper">
            <div className="scroll-list" style={{ display: 'flex', gap: '15px' }}>
                {items.length === 0 ? (
                    <p className="no-items-text" style={{ color: '#999', padding: '20px 0' }}>
                        No items yet
                    </p>
                ) : (
                    items.map((item, index) => (
                        <AnimatedItem
                            key={item._id || `${item.name}-${index}`}
                            delay={0.05 * index}
                            onClick={() => onItemSelect(item)}
                        >
                            <div className="item item-preview-box-animated">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name || "Item"} className="item-image" />
                                ) : (
                                    <p className="item-text">No image</p>
                                )}
                            </div>
                        </AnimatedItem>
                    ))
                )}
            </div>
        </div>
    );
};

// MAIN CLOSET PAGE
export default function Closet() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mainPreviewItem, setMainPreviewItem] = useState(null);
    const [clothesData, setClothesData] = useState(initialDataStructure);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewItems, setPreviewItems] = useState([]);
    const previewRef = useRef(null);
    const draggingRef = useRef({ index: -1, offsetX: 0, offsetY: 0 });

    useEffect(() => {
        const fetchClothes = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    Object.entries(ENDPOINT_MAP).map(async ([correctCategory, endpoint]) => {
                        const res = await fetch(`${BASE_API_URL}${endpoint}`);
                        if (!res.ok) throw new Error(`Failed to load ${correctCategory}`);
                        const items = await res.json();
                        return items.map(item => ({
                            ...item,
                            category: correctCategory,
                            originalCategory: (item.category || "").toString().trim().toLowerCase()
                        }));
                    })
                );

                const grouped = Object.keys(ENDPOINT_MAP).reduce((acc, category, i) => {
                    acc[category] = results[i];
                    return acc;
                }, {});

                setClothesData(grouped);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load items');
            } finally {
                setLoading(false);
            }
        };
        fetchClothes();
    }, []);

    // Auto-add item when returning from category page
    useEffect(() => {
        if (location.state?.addToPreview) {
            addItemToPreview(location.state.addToPreview);
            navigate('/closet', { replace: true });
        }
    }, [location.state]);

    const openCategoryPage = (category) => {
        navigate(`/closet/${category.toLowerCase()}`);
    };

    const addItemToPreview = (item) => {
        setMainPreviewItem(item);
        const rect = previewRef.current?.getBoundingClientRect();
        const centerX = rect ? Math.max((rect.width - 200) / 2, 0) : 50;
        const centerY = rect ? Math.max((rect.height - 200) / 2, 0) : 50;

        setPreviewItems(prev => [...prev, { ...item, x: centerX, y: centerY }]);
    };

    const removePreviewItem = (index) => {
        setPreviewItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (index, offsetX, offsetY) => {
        draggingRef.current = { index, offsetX, offsetY };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const { index, offsetX, offsetY } = draggingRef.current;
        if (index < 0) return;
        const rect = previewRef.current?.getBoundingClientRect();
        if (!rect) return;
        const newX = e.clientX - rect.left - offsetX;
        const newY = e.clientY - rect.top - offsetY;
        setPreviewItems(prev => prev.map((it, i) => i === index ? { ...it, x: Math.max(newX, 0), y: Math.max(newY, 0) } : it));
    };

    const handleMouseUp = () => {
        draggingRef.current = { index: -1, offsetX: 0, offsetY: 0 };
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    if (loading) return <div className="closet-page-wrapper loading-state">Loading wardrobe…</div>;
    if (error) return <div className="closet-page-wrapper error-state">Warning: {error}</div>;

    return (
        <div className="closet-page-wrapper">
            {/* HEADER */}
            <div className="closet-header">
                <div className="closet-title-area">
                    <FaUserCircle className="account-icon" size={24} onClick={() => navigate('/profile')} />
                    <h2>Closet</h2>
                </div>
                <button className="close-btn" onClick={() => navigate('/')}>×</button>
            </div>

            {/* MAIN PREVIEW AREA */}
            <div className="upgraded-preview" ref={previewRef}>
                {previewItems.length > 0 ? (
                    previewItems.map((item, i) => (
                        <DraggablePreviewItem
                            key={item._id || i}
                            item={item}
                            index={i}
                            onDragStart={handleDragStart}
                            onRemove={removePreviewItem}
                        />
                    ))
                ) : mainPreviewItem?.imageUrl ? (
                    <img src={mainPreviewItem.imageUrl} alt={mainPreviewItem.name} className="main-preview-image" />
                ) : (
                    <p className="preview-text">Click an item below to preview it.</p>
                )}
            </div>

            {/* CATEGORIES WITH ALWAYS-VISIBLE "More »" BUTTON */}
            {Object.keys(clothesData).map(category => {
                const filteredItems = (clothesData[category] || []).filter(
                    item => item.originalCategory === category.toLowerCase()
                );

                return (
                    <div key={category} className="category-row-wrapper">
                        <div className="category-header-and-button">
                            <h3 className="category-name">{category}</h3>
                            
                            {/* "More »" button is now ALWAYS visible */}
                            <button
                                className="more-btn"
                                onClick={() => openCategoryPage(category)}
                            >
                                More »
                            </button>
                        </div>

                        <div className="animated-list-container">
                            <AnimatedList
                                items={filteredItems.slice(0, 10)}
                                onItemSelect={addItemToPreview}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}