import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORTANT: You need to install react-icons (npm install react-icons)
import { FaUserCircle } from 'react-icons/fa'; 
import './closet.css'; 

// --- DUMMY DATA ---
// In a real application, this data would be fetched from your backend API
const categoriesData = [
  { name: 'Tops', endpoint: '/closet/tops', items: ['Tee', 'Blouse', 'Sweater', 'Tank'] },
  { name: 'Bottoms', endpoint: '/closet/bottoms', items: ['Jeans', 'Skirt', 'Shorts', 'Trousers'] },
  { name: 'Accessories', endpoint: '/closet/accessories', items: ['Scarf', 'Hat', 'Belt', 'Necklace'] },
  { name: 'Shoes', endpoint: '/closet/shoes', items: ['Sneakers', 'Boots', 'Sandals', 'Heels'] },
];
// ------------------


export default function Closet() {
  const navigate = useNavigate();
  // State to track what should be displayed in the large preview box
  const [mainPreviewItem, setMainPreviewItem] = useState(null); 

  return (
    <div className="closet-popup">
      
      {/* HEADER: Title, Account Icon, and Close Button */}
      <div className="closet-header">
        <div className="closet-title-area">
          {/* The account icon from your image */}
          <FaUserCircle 
            className="account-icon" 
            size={24} 
            onClick={() => navigate('/profile')} 
            title="Go to Profile"
          />
          <h2>Closet</h2>
        </div>
        {/* Close button (x) to dismiss the view, navigating back to home */}
        <button className="close-btn" onClick={() => navigate('/')}>&times;</button>
      </div>

      {/* 1. MAIN PREVIEW AREA (The big gray rectangle) */}
      <div className="main-preview-container">
        {mainPreviewItem ? (
          <p className="preview-text">Previewing: **{mainPreviewItem}**</p>
        ) : (
          <p className="preview-text">Click an item below to see the preview, or view your saved outfit.</p>
        )}
      </div>

      {/* 2. CATEGORY PREVIEWS (The smaller gray rectangles) */}
      <div className="category-list">
        {categoriesData.map((category) => (
          <div key={category.name} className="category-preview-row">
            
            {/* Category Name (e.g., "Tops") */}
            <h3 className="category-name">{category.name}</h3>

            {/* Item Previews (showing a few items) */}
            <div className="item-preview-grid">
              {category.items.slice(0, 3).map((item, index) => ( // Display max 3 items
                <div 
                  key={index} 
                  className="item-preview-box"
                  // On click, set this item as the main item to preview
                  onClick={() => setMainPreviewItem(item)} 
                >
                  <p className="item-placeholder-text">{item}</p> 
                  {/* In a real app, this would be <img src={item.imageUrl} alt={item.name} /> */}
                </div>
              ))}
            </div>

            {/* "More" Button to Navigate to the Full Category View */}
            <button 
              className="more-btn"
              onClick={() => navigate(category.endpoint)} // Navigates to e.g., /closet/tops
            >
              More &raquo;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}