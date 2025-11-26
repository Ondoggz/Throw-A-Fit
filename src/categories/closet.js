import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; 
import { motion, useInView } from 'framer-motion'; 
import './closet.css'; 

// =========================================================================
// 1. ANIMATED LIST SUB-COMPONENTS (Defined within this file)
// =========================================================================

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ cursor: 'pointer', flexShrink: 0 }} 
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [],
  onItemSelect,
  // ... (rest of props)
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  
  // (Scroll/keyboard logic remains the same but is trimmed for brevity)
  useEffect(() => { /* ... keyboard navigation logic ... */ }, []); 
  useEffect(() => { /* ... scroll-to-selected-item logic ... */ }, []);


  return (
    <div className={`scroll-list-container ${className}`}>
      <div 
        ref={listRef} 
        className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`} 
        // onScroll={handleScroll} // Removed handleScroll as gradients are set to false
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={item._id || index} // Use unique ID if available, otherwise index
            delay={0.05 * index} 
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) {
                onItemSelect(item); // Pass the entire item object
              }
            }}
          >
            {/* 🌟 KEY CHANGE: Render the image inside the item box */}
            <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="item-image" />
              ) : (
                <p className="item-text">Image not found</p>
              )}
            </div>
          </AnimatedItem>
        ))}
      </div>
    </div>
  );
};


// =========================================================================
// 2. MAIN CLOSET COMPONENT
// =========================================================================

// Dummy data structure for initial state, will be overwritten by fetch
const initialDataStructure = {
    Tops: [],
    Bottoms: [],
    Accessories: [],
    Shoes: [],
};

export default function Closet() {
    const navigate = useNavigate();
    const [mainPreviewItem, setMainPreviewItem] = useState(null); 
    const [clothesData, setClothesData] = useState(initialDataStructure);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🌟 MongoDB/API FETCH LOGIC
    useEffect(() => {
        const fetchClothes = async () => {
            // Replace with your actual backend endpoint!
            const API_ENDPOINT = 'YOUR_BACKEND_API_URL/clothes'; 
            
            try {
                const token = localStorage.getItem('authToken'); // Assuming you use JWT or similar auth
                const response = await fetch(API_ENDPOINT, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch clothes data.');
                }
                
                const rawItems = await response.json();
                
                // Group items by category
                const groupedData = rawItems.reduce((acc, item) => {
                    const category = item.category || 'Unknown';
                    if (acc[category]) {
                        acc[category].push({
                            _id: item._id, 
                            name: item.name, 
                            imageUrl: item.cloudinaryUrl // Adjust this key if your database uses a different name
                        });
                    }
                    return acc;
                }, { Tops: [], Bottoms: [], Accessories: [], Shoes: [] });

                setClothesData(groupedData);
            } catch (err) {
                console.error(err);
                setError('Could not load closet. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClothes();
    }, []); 

    // Function to handle item selection
    const handleItemSelect = (item) => {
        // When a picture is clicked, set the main preview to that item object
        setMainPreviewItem(item);
    };

    const categoriesList = Object.keys(clothesData);

    // Render logic for Loading/Error
    if (isLoading) {
        return <div className="closet-page-wrapper loading-state">Loading your digital wardrobe...</div>;
    }

    if (error) {
        return <div className="closet-page-wrapper error-state">{error}</div>;
    }


    return (
        <div className="closet-page-wrapper">
            
            {/* HEADER */}
            <div className="closet-header">
                {/* ... (Header remains the same) ... */}
                <div className="closet-title-area">
                    <FaUserCircle className="account-icon" size={24} onClick={() => navigate('/profile')} title="Go to Profile" />
                    <h2>Closet</h2>
                </div>
                <button className="close-btn" onClick={() => navigate('/')}>&times;</button>
            </div>

            {/* 1. MAIN PREVIEW AREA (The big gray rectangle) */}
            <div className="main-preview-container">
                {mainPreviewItem && mainPreviewItem.imageUrl ? (
                    <img 
                        src={mainPreviewItem.imageUrl} 
                        alt={mainPreviewItem.name} 
                        className="main-preview-image" 
                    />
                ) : (
                    <p className="preview-text">
                        {mainPreviewItem ? `Selected: ${mainPreviewItem.name}` : 'Click an item below to see the preview, or view your saved outfit.'}
                    </p>
                )}
            </div>

            {/* 2. CATEGORY PREVIEWS */}
            <div className="category-list">
                {categoriesList.map((categoryName) => (
                    <div key={categoryName} className="category-row-wrapper">
                        
                        <div className="category-header-and-button">
                            <h3 className="category-name">{categoryName}</h3>
                            <button 
                                className="more-btn"
                                onClick={() => navigate(`/closet/${categoryName.toLowerCase()}`)}
                            >
                                More &raquo;
                            </button>
                        </div>

                        <div className="animated-list-container">
                            {clothesData[categoryName].length > 0 ? (
                                <AnimatedList
                                    items={clothesData[categoryName]} // Pass the actual image objects
                                    onItemSelect={handleItemSelect}
                                    className="horizontal-list-wrapper"
                                    itemClassName="item-preview-box-animated"
                                />
                            ) : (
                                <p className="no-items-text">No {categoryName} found. Time to upload!</p>
                            )}
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
}