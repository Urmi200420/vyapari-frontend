
import { useEffect, useRef } from "react";
import { Button } from "./button.js";
import "./glass.css";

export default function LiquidGlassTest() {
  const hostRef = useRef(null);

  useEffect(() => {
  if (!hostRef.current) return;

 window.glassControls = {
  blurRadius: 4,
  edgeIntensity: 0.065,
  rimIntensity: 0.17,
  baseIntensity: 0.035,
  edgeDistance: 0.28,
  rimDistance: 1.5,
  baseDistance: 0.22,
  cornerBoost: 0.085,
  rippleEffect: 0.28,
};

  const glassButton = new Button({
    text: "Liquid Glass",
    size: 24,
    type: "rounded",
    tintOpacity: 0.22,
    warp: true,
  });

  hostRef.current.appendChild(glassButton.element);

  return () => {
    glassButton.element?.remove();
  };
}, []);

 

  return (
    <div
      ref={hostRef}
      style={{
        minHeight: "260px",
        margin: "24px",
        padding: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "24px",
        background: `
          repeating-linear-gradient(
            135deg,
            #1769aa 0px,
            #1769aa 35px,
            #72d6cf 35px,
            #72d6cf 70px,
            #f7c5e8 70px,
            #f7c5e8 105px
          )
        `,
      }}
    />
  );
}
