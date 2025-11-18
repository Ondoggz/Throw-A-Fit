import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  // 1. 🟢 NEW STATE: To capture the item name
  const [itemName, setItemName] = useState("");
  // 🟢 NEW STATE: To capture the item category (better than hardcoding)
  const [itemCategory, setItemCategory] = useState("tops"); 
  
  // Category options for the new select dropdown
  const categories = ["tops", "bottoms", "shoes", "accessories"];


  // handle file selection from input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    // 🛑 CRITICAL CHECK: Ensure both name and file are present
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    if (!itemName || !itemCategory) {
      alert("Please enter the item name and select a category!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // Key must be "image"
    // 2. 🟢 FIX: Append both required fields using state values
    formData.append("name", itemName); 
    formData.append("category", itemCategory); 

    try {
     const res = await fetch("https://throw-a-fit.onrender.com/api/upload", {
        method: "POST",
        body: formData
      });

      // Check for non-200 status codes
      if (!res.ok) {
        const errorData = await res.json();
        // The error message from the server (e.g., "Missing item name...")
        throw new Error(`Upload failed with status ${res.status}: ${errorData.message || 'Server error'}`);
      }

      const data = await res.json();
      // Backend returns the full item object, but imageUrl is the key part
      console.log("CLEAN IMAGE URL:", data.item.imageUrl); 
      alert("Upload complete! Item Name: " + data.item.name);
      
      // Optional: Reset form fields on success
      setFile(null);
      setItemName("");
      setItemCategory("tops");

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        position: "relative",
        background: "white",
        overflow: "hidden",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Upload Card */}
      <div
        style={{
          width: "700px",
          height: "480px", // Increased height to fit new inputs
          background: "rgba(217, 217, 217, 0.4)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px", // Decreased gap for space
          border: dragActive ? "3px dashed hotpink" : "3px dashed #aaa",
          transition: "0.3s ease",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h1 style={{ fontFamily: "Arial", color: "#1E1E1E", marginBottom: "5px" }}>
          Upload your Clothes!
        </h1>
        
        {/* 3. 🟢 NEW INPUTS: Name and Category Select */}
        <input
            type="text"
            placeholder="Enter Item Name (e.g., Black T-Shirt)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "60%",
            }}
        />

        <select
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "60%",
            }}
        >
            {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
        </select>
        {/* End New Inputs */}


        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />

        {/* Buttons Row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <label
            htmlFor="fileInput"
            style={{
              background: "#ff69b4",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Choose File
          </label>

          <button
            onClick={handleUpload}
            style={{
              background: "#1E1E1E",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Upload
          </button>
        </div>

        {file && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: "bold" }}>Selected: {file.name}</p>
            {file.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
        )}

        <p style={{ color: "#666", fontSize: "14px" }}>
          or drag and drop your file here
        </p>
      </div>
    </div>
  );
}