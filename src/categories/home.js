import { useNavigate } from "react-router-dom";
import TextPressure from "./hpbg";
import "./hpbg.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="home-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Animated Text */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextPressure
          text="Throw A Fit"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
          strokeColor="#ff0000"
          minFontSize={36}
        />
      </div>

      {/* Footer / Buttons */}
      <div className="home-footer" style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <button
          type="button"
          className="home-btn secondary"
          onClick={() => navigate("/closet")}
        >
          Closet
        </button>

        <button
          type="button"
          className="home-btn primary"
          onClick={() => navigate("/upload")}
        >
          Throw a Fit
        </button>

        <button
          type="button"
          className="home-btn secondary"
          onClick={() => navigate("/upload")}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
