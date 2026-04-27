'use client';

import { motion } from 'framer-motion';

// Pre-computed values to avoid hydration mismatch from Math.random()
const PARTICLES = [
  { w: 80, h: 90, left: 12, top: 8, xOff: 5, dur: 3.2 },
  { w: 95, h: 70, left: 65, top: 15, xOff: -8, dur: 4.1 },
  { w: 60, h: 110, left: 35, top: 55, xOff: 3, dur: 3.5 },
  { w: 100, h: 65, left: 78, top: 40, xOff: -6, dur: 4.5 },
  { w: 75, h: 85, left: 22, top: 72, xOff: 7, dur: 3.8 },
  { w: 90, h: 100, left: 55, top: 30, xOff: -4, dur: 4.3 },
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: p.w,
              height: p.h,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: 'radial-gradient(circle, #fbbf24, transparent)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, p.xOff, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Logo Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Cricket Ball Logo */}
        <motion.div
          className="relative w-28 h-28 mb-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Ball seam */}
            <div className="absolute w-full h-[2px] bg-white/40 top-1/2 -translate-y-1/2 rotate-[25deg]" />
            <div className="absolute w-[2px] h-full bg-white/30 left-1/2 -translate-x-1/2 rotate-[25deg]" />
            {/* Stitching */}
            <div className="absolute top-[30%] left-[15%] w-2 h-2 border border-white/50 rounded-full" />
            <div className="absolute top-[35%] left-[20%] w-2 h-2 border border-white/50 rounded-full" />
            <div className="absolute bottom-[30%] right-[15%] w-2 h-2 border border-white/50 rounded-full" />
            <div className="absolute bottom-[35%] right-[20%] w-2 h-2 border border-white/50 rounded-full" />
            {/* CP text */}
            <span className="text-white font-black text-2xl z-10">CP</span>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          className="text-4xl font-black text-white tracking-wider"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Cric<span className="text-yellow-400">Point</span>
        </motion.h1>

        <motion.p
          className="text-green-300 mt-2 text-sm font-medium tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Live Cricket Scores
        </motion.p>
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        className="absolute bottom-24 w-48 h-1 bg-green-900/50 rounded-full overflow-hidden z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="absolute bottom-16 text-green-400/60 text-xs tracking-widest z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
}
