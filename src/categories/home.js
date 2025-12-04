import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./hpbg.css";
import { TextPressure, FallingText } from "./hpbg";
import Squares from './hpbg';
import { useCloset } from "../categories/ClosetContext";
import { useUser } from "../categories/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const { resetCloset } = useCloset();
  const { user, setUser } = useUser();
  const [fallen, setFallen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  // -------- SIGNUP --------
  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! You can now log in.");
        setShowSignup(false);
        setSignupUsername("");
        setSignupPassword("");
      } else {
        setMessage(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during signup");
    }
  };

  // -------- LOGIN --------
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.msg || "Login failed");
        return;
      }

      // 1️⃣ Store JWT
      localStorage.setItem("token", data.token);

      // 2️⃣ Fetch full user info
      const userRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser({ _id: userData._id, username: userData.username });
      } else {
        setMessage("Failed to fetch user info");
        return;
      }

      // 3️⃣ Reset previous closet
      resetCloset();

      // 4️⃣ Clear inputs and close popup
      setMessage("Login successful!");
      setShowLogin(false);
      setLoginUsername("");
      setLoginPassword("");

      // 5️⃣ Navigate to closet
      navigate("/closet");
    } catch (err) {
      console.error(err);
      setMessage("Server error during login");
    }
  };

  const isLoggedIn = !!user;

  return (
    <div className="home-container">
      <Squares speed={0.5} squareSize={40} direction='diagonal' borderColor='#fff' hoverFillColor='#222' />

      {!isLoggedIn && (
        <div className="top-right-btns">
          <button className="home-btn secondary" onClick={() => setShowSignup(true)}>Sign Up</button>
          <button className="home-btn primary" onClick={() => setShowLogin(true)}>Login</button>
        </div>
      )}

      {isLoggedIn && (
        <div className="home-profile-icon" onClick={() => navigate("/profile")}>
          <FaUserCircle size={38} className="profile-icon-react" />
        </div>
      )}

      <div className="home-header" onClick={() => setFallen(true)}>
        {!fallen ? (
          <TextPressure text="Throw A Fit" fontFamily="Compressa VF" textColor="#e44a8dff" strokeColor="#FF0000" />
        ) : (
          <FallingText text="Throw A Fit" trigger="auto" backgroundColor="transparent" wireframes={false} gravity={0.56} fontSize="5rem" mouseConstraintStiffness={0.9} />
        )}
      </div>

      <div className="home-footer">
        <button className="home-btn secondary" onClick={() => navigate("/closet")}>Closet</button>
        <button className="home-btn primary" onClick={() => navigate("/upload")}>Throw a Fit</button>
        <button className="home-btn secondary" onClick={() => navigate("/upload")}>Upload</button>
      </div>

      {message && <div className="home-message">{message}</div>}

      {showSignup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">Sign Up</div>
            <input type="text" placeholder="Username" className="popup-input" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="popup-input" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
            <button className="popup-btn" onClick={handleSignup}>Create Account</button>
            <button className="popup-close" onClick={() => setShowSignup(false)}>Close</button>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">Login</div>
            <input type="text" placeholder="Username" className="popup-input" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="popup-input" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            <button className="popup-btn" onClick={handleLogin}>Login</button>
            <button className="popup-close" onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
