import { useState } from "react";
import { useUser } from "../categories/UserContext";

export default function Upload() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("tops");

  const categories = ["tops", "bottoms", "shoes", "accessories"];
  const API_URL = process.env.REACT_APP_API_URL;

  const handleUpload = async () => {
    if (!user) return alert("You must be logged in to upload items!");
    if (!file || !itemName || !itemCategory) return alert("Complete all fields!");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", itemName);
    formData.append("category", itemCategory);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      alert(`Upload complete! Item: ${data.item.name}`);
      setFile(null);
      setItemName("");
      setItemCategory("tops");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    }
  };

  return (
    <div>
      <h1>Upload your Clothes!</h1>
      <input type="text" placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} />
      <select value={itemCategory} onChange={e => setItemCategory(e.target.value)}>
        {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
      </select>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
