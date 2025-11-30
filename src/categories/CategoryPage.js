
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ENDPOINT_MAP = {
  tops: "Tops",        
  bottoms: "Bottoms",
  accessories: "Accessories",
  shoes: "Shoes"
};

const DISPLAY_NAME = {
  tops: "Tops",
  bottoms: "Bottoms",
  accessories: "Accessories",
  shoes: "Shoes"
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalized = category?.toLowerCase();
  const endpoint = ENDPOINT_MAP[normalized];
  const title = DISPLAY_NAME[normalized] || "Category";

  useEffect(() => {
    if (!endpoint) {
      navigate('/closet', { replace: true });
      return;
    }

    
    fetch(`${BASE_API_URL}/items/${endpoint}`)
      .then(res => {
        if (!res.ok) {
          console.error("Failed:", res.status, res.statusText);
          throw new Error("Not found");
        }
        return res.json();
      })
      .then(data => {
        console.log(`Successfully loaded ${title}:`, data);
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Fetch failed for", endpoint, err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <div className="closet-page-wrapper">
      <div className="closet-header">
        <button className="close-btn" onClick={() => navigate('/closet')}>
          <FaArrowLeft size={28} />
        </button>
        <h2>{title}</h2>
        <div style={{ width: 40 }}></div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 80 }}>Loading {title}...</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 80, color: '#ff6b6b' }}>
          No items found
        </p>
      ) : (
        <div className="modal-grid" style={{ marginTop: 30, padding: '0 20px' }}>
          {items.map(item => (
            <div
              key={item._id}
              className="modal-item"
              onClick={() => navigate('/closet', { state: { addToPreview: item } })}
              style={{ cursor: 'pointer' }}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name || "Item"} style={{ borderRadius: 8 }} />
              ) : (
                <div className="no-image">No image</div>
              )}
              <p>{item.name || "Unnamed Item"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}