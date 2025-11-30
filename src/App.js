import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./categories/home.js";
import Upload from "./categories/upload.js";
import Closet from "./categories/closet.js";
import CategoryPage from "./categories/CategoryPage.js"; // Now matches file exactly

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/closet/tops" element={<CategoryPage />} />
        <Route path="/closet/bottoms" element={<CategoryPage />} />
        <Route path="/closet/accessories" element={<CategoryPage />} />
        <Route path="/closet/shoes" element={<CategoryPage />} />
        <Route path="/closet/:category" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}