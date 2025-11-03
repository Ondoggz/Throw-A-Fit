import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./categories/home";
import Closet from "./categories/closet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/closet" element={<Closet />} />
      </Routes>
    </Router>
  );
}

export default App;
