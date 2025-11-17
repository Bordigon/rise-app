import React, { useMemo } from "react";
import "../styles/ExpBar.css";

export default function ExpBar({ level = 1, currentExp = 0, nextLevelExp = 1000 }) {
  const pct = useMemo(
    () => Math.max(0, Math.min(100, (currentExp / nextLevelExp) * 100)),
    [currentExp, nextLevelExp]
  ); 

  return (
    <div className="expbar-wrap">
      <div className="expbar-card">
        <div className="expbar-left">
          <div className="exp-level">LV {level}</div>
        </div>

        <div className="expbar-track">
          <div className="expbar-fill" style={{ width: `${pct}%` }} />
          <div className="expbar-glow" />
        </div>

        <div className="expbar-right">
          <span className="exp-numbers">
            {currentExp} / {nextLevelExp}
          </span>
        </div>
      </div>
    </div>
  );
}
