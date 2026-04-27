'use client';

import { motion } from 'framer-motion';

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
            animate={{ y: [0, -30, 0], x: [0, p.xOff, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Logo Only - no text */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-56 h-56 mb-8"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <img
            src="/cricpoint-logo-intro.png"
            alt="CricPoint Logo"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 -z-10 bg-green-400/20 rounded-full blur-3xl scale-110" />
        </motion.div>
      </motion.div>

      {/* Green Loading Animation */}
      <motion.div
        className="absolute bottom-24 z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Animated dots */}
        <div className="flex gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Green loading bar */}
        <div className="w-48 h-1.5 bg-green-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 2.2, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
