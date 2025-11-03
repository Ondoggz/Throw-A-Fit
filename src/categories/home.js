export default function Home() {
  return (
    <div style={{ width: "1440px", height: "1024px", position: "relative", background: "white", overflow: "hidden" }}>
      <div style={{ width: "1440px", height: "114px", position: "absolute", top: 0, overflow: "hidden" }}>
        <div style={{ width: "252px", left: "589px", top: "59px", position: "absolute", textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column", color: "black", fontSize: "36px", fontFamily: "Josefin Sans, serif", fontStyle: "italic", fontWeight: 600 }}>
          Throw . A . Fit
        </div>
      </div>

      <div style={{ width: "1440px", height: "278px", left: 0, top: "746px", position: "absolute", overflow: "hidden" }}>
        <button style={{
          width: "398px", height: "54px", position: "absolute", left: "558px", top: "114px",
          background: "#007AFF", border: "none", borderRadius: "12px", color: "white", fontSize: "17px",
          fontFamily: "SF Pro, sans-serif", cursor: "pointer"
        }}>
          Throw a Fit
        </button>

        <button style={{
          width: "310px", height: "54px", position: "absolute", left: "208px", top: "114px",
          borderRadius: "1000px", background: "rgba(0,0,0,0.05)", border: "none",
          fontSize: "13px", fontFamily: "SF Pro, sans-serif", color: "#4C4C4C", cursor: "pointer"
        }}>
          Closet
        </button>

        <button style={{
          width: "310px", height: "54px", position: "absolute", left: "999px", top: "114px",
          borderRadius: "1000px", background: "rgba(0,0,0,0.05)", border: "none",
          fontSize: "13px", fontFamily: "SF Pro, sans-serif", color: "#4C4C4C", cursor: "pointer"
        }}>
          Upload
        </button>
      </div>
    </div>
  );
}
