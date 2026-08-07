"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  // `will-change` is a hint for an animation that is *about* to run, not a
  // permanent style. Left on, it keeps the whole page promoted to its own
  // compositing layer and makes `<main>` a containing block for every fixed
  // descendant, for the sake of one 0.4s fade. Drop it once the fade is done.
  const [animating, setAnimating] = useState(true);

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setAnimating(false)}
      style={animating ? { willChange: "transform, opacity" } : undefined}
      className="relative"
    >
      {children}
    </motion.main>
  );
}
