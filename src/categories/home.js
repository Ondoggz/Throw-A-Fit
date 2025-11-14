import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hpbg.css";
import { TextPressure, FallingText } from "./hpbg";
import { useRef, useEffect, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

export default function Home() {
  const navigate = useNavigate();
  const [fallen, setFallen] = useState(false);

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Dither
    waveColor={[0.5, 0.5, 0.5]}
    disableAnimation={false}
    enableMouseInteraction={true}
    mouseRadius={0.3}
    colorNum={4}
    waveAmplitude={0.3}
    waveFrequency={3}
    waveSpeed={0.05}
  />
</div>

  return (
    <div className="home-container">
      <div className="home-header" onClick={() => setFallen(true)}>
        {!fallen ? (
          <TextPressure
            text="Throw A Fit"
            fontFamily="Compressa VF"
            textColor="#FFFFFF"
            strokeColor="#FF0000"
          />
        ) : (
          <FallingText
            text={`Throw A Fit`}
            trigger="auto"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="5 rem"
            mouseConstraintStiffness={0.9}
          />
        )}
      </div>

      <div
        className="home-footer"
        style={{ marginTop: "40px", display: "flex", gap: "20px" }}
      >
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

