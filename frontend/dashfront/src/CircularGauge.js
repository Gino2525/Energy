import React, { useEffect, useRef } from "react";
import './styles/GaugeStyles.css';

const CircularGauge = ({ value1 = 0, value2 = 0, value3 = 0 }) => {
  const gaugeValueRef = useRef(null);

  useEffect(() => {
    const max = 100;

    const setCircleValue = (circleId, value, radius) => {
      const circle = document.getElementById(circleId);
      const circumference = 2 * Math.PI * radius;
      const offset = circumference * (1 - value / max);
      if (circle) circle.style.strokeDashoffset = offset;
    };

    setCircleValue("layer1", value1, 45);
    setCircleValue("layer2", value2, 37);
    setCircleValue("layer3", value3, 29);

    if (gaugeValueRef.current) {
      gaugeValueRef.current.textContent = `${value1}%`;
    }
  }, [value1, value2, value3]);

  return (
    <div className="gauge-container">
      <svg width="250" height="250" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#222" strokeWidth="5" fill="none" />
        <circle cx="50" cy="50" r="37" stroke="#222" strokeWidth="5" fill="none" />
        <circle cx="50" cy="50" r="29" stroke="#222" strokeWidth="5" fill="none" />

        <circle id="layer1" className="glow" cx="50" cy="50" r="45" stroke="#ff3d00"
          strokeWidth="5" fill="none" strokeDasharray="282.6" strokeDashoffset="282.6"
          strokeLinecap="round" transform="rotate(-90 50 50)" />
        <circle id="layer2" className="glow" cx="50" cy="50" r="37" stroke="#ffcc00"
          strokeWidth="5" fill="none" strokeDasharray="232.5" strokeDashoffset="232.5"
          strokeLinecap="round" transform="rotate(-90 50 50)" />
        <circle id="layer3" className="glow" cx="50" cy="50" r="29" stroke="#00ffcc"
          strokeWidth="5" fill="none" strokeDasharray="182.2" strokeDashoffset="182.2"
          strokeLinecap="round" transform="rotate(-90 50 50)" />
      </svg>
      <div className="gauge-text" ref={gaugeValueRef}>0%</div>
    </div>
  );
};

export default CircularGauge;
