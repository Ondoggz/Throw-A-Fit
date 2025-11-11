import { useNavigate } from "react-router-dom";
import TextPressure from "./hpbg";
import "./hpbg.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header / Animated Text */}
      <div style={{ position: 'relative', height: '300px' }}>
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

      {/* Footer / Navigation Buttons */}
      <div className="home-footer">
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
