import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import phoenixSad from "../assets/img/dashboardpageimgs/phoenix-sad.png";
import phoenixHappy from "../assets/img/dashboardpageimgs/phoenix-happy.png";

export default function PhoenixStreakFM({
  completed,
  size = 360,
  rise = 120,
}) {
  const [phase, setPhase] = useState(completed ? "celebrate" : "idle");

  useEffect(() => {
    setPhase(prev => {
      if (completed && prev !== "celebrate") return "transform";
      if (!completed) return "idle";
      return prev;
    });
  }, [completed]);

  const dur = 1.15;
  const ringSize = size * 0.68;
  const ringY = size * 0.74; 
  const ringX = size * 0.5;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >

      {/* 🎉 Confetti burst */}
      {phase !== "idle" &&
        [-0.32, -0.12, 0.12, 0.32].map((x, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: size * (0.5 + x),
              top: size * 0.25,
              width: size * 0.04,
              height: size * 0.04,
              borderRadius: "50%",
              background: ["#FFB84D", "#FF7A00", "#FFD166", "#FF944D"][i % 4],
              filter: "drop-shadow(0 2px 2px rgba(0,0,0,.25))",
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: [-20, size * 0.3, size * 0.45] }}
            transition={{
              duration: 1.0,
              delay: 0.15 + i * 0.07,
              ease: "easeOut",
              repeat: phase === "celebrate" ? Infinity : 0,
              repeatDelay: 1.0,
            }}
          />
        ))}

      {/* 🕊️ Sad Phoenix (Idle + Transform rise) */}
      <AnimatePresence>
        {phase !== "celebrate" && (
          <motion.img
            key="sad"
            src={phoenixSad}
            alt="phoenix-sad"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={
              phase === "idle"
                ? {
                  scale: [1, 1.03, 1],
                  transition: { duration: 1.8, repeat: Infinity },
                }
                : {
                  y: [-rise * 0.2, -rise, -rise],
                  opacity: [1, 0.2, 0],
                  transition: { duration: dur, ease: "easeInOut" },
                }
            }
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              if (phase === "transform") setPhase("celebrate");
            }}
          />
        )}
      </AnimatePresence>

      {/* 🪶 Happy Phoenix (Celebrate pulse) */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.img
            key="happy"
            src={phoenixHappy}
            alt="phoenix-happy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              willChange: "transform, opacity",
            }}
            initial={
              phase === "transform"
                ? { opacity: 0, y: -rise, scale: 0.9 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            animate={
              phase === "transform"
                ? { opacity: 1, y: 0, scale: [1.12, 1.0] }
                : {
                  scale: [1.0, 1.03, 1.0],
                  transition: { duration: 1.1, repeat: Infinity },
                }
            }
            transition={{
              duration: phase === "transform" ? dur : 1.1,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
