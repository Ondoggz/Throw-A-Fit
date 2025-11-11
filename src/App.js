import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./categories/home.js";
import Upload from "./categories/upload.js";
import Closet from "./categories/closet.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route "/" shows Home */}
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/closet" element={<Closet />} />
      </Routes>
    </BrowserRouter>
  );
}
