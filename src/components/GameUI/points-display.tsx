"use client";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameContext from "../../context/GameContext";

export function PointsDisplay() {
  const { pointsTotal } = useContext(GameContext);
  const [displayedPoints, setDisplayedPoints] = useState(pointsTotal);
  
  useEffect(() => {
    setDisplayedPoints(pointsTotal);
  }, [pointsTotal]);
  
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
      {/* Efecto de resplandor animado */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-50"
      />
      
      <h2 className="text-2xl font-semibold mb-2 text-blue-300 !text-blue-300 drop-shadow-lg">Ponist!!!</h2>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={displayedPoints}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-4xl font-mono !text-yellow-400 drop-shadow-lg"
          >
            {displayedPoints.toFixed(2)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}