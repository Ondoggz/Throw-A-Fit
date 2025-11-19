import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hpbg.css";
import { TextPressure, FallingText } from "./hpbg";
import Squares from './hpbg';
  

export default function Home() {
  const navigate = useNavigate();
  const [fallen, setFallen] = useState(false);

  return (
    <div className="home-container">
      <Squares 
        speed={0.5} 
        squareSize={40}
        direction='diagonal'
        borderColor='#fff'
        hoverFillColor='#222'
      />

      {/* ---------- TOP RIGHT BUTTONS ---------- */}
      <div className="top-right-btns">
        <button className="home-btn secondary" onClick={() => setShowSignup(true)}>
          Sign Up
        </button>
        <button className="home-btn primary" onClick={() => setShowLogin(true)}>
          Login
        </button>
      </div>

      {/* HEADER */}
      <div className="home-header" onClick={() => setFallen(true)}>
        {!fallen ? (
          <TextPressure
            text="Throw A Fit"
            fontFamily="Compressa VF"
            textColor="#e44a8dff"
            strokeColor="#FF0000"
          />
        ) : (
          <FallingText
            text="Throw A Fit"
            trigger="auto"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="5rem"
            mouseConstraintStiffness={0.9}
          />
        )}
      </div>

      {/* ---------- FOOTER BUTTONS ---------- */}
      <div className="home-footer">
        <button className="home-btn secondary" onClick={() => navigate("/closet")}>Closet</button>
        <button className="home-btn primary" onClick={() => navigate("/upload")}>Throw a Fit</button>
        <button className="home-btn secondary" onClick={() => navigate("/upload")}>Upload</button>
      </div>

      {/* ---------- SIGNUP POPUP ---------- */}
      {showSignup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">Sign Up</div>
            <input type="text" placeholder="Username" className="popup-input" />
            <input type="password" placeholder="Password" className="popup-input" />
            <button className="popup-btn" onClick={() => navigate("/signup")}>Create Account</button>
            <button className="popup-close" onClick={() => setShowSignup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ---------- LOGIN POPUP ---------- */}
      {showLogin && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">Login</div>
            <input type="text" placeholder="Username" className="popup-input" />
            <input type="password" placeholder="Password" className="popup-input" />
            <button className="popup-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="popup-close" onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
