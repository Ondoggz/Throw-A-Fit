import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./categories/home.js";
import Upload from "./categories/upload.js";
import Closet from "./categories/closet.js";
import CategoryPage from "./categories/CategoryPage.js";
import { ClosetProvider } from "./categories/ClosetContext.js";

export default function App() {
  return (
    <ClosetProvider>
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Upload */}
          <Route path="/upload" element={<Upload />} />

          {/* Closet */}
          <Route path="/closet" element={<Closet />} />

          {/* Dynamic category pages */}
          <Route path="/items/:category" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </ClosetProvider>
  );
}
